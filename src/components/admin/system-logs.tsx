// src/components/admin/system-logs.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Log } from "@/interfaces/log"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

export function SystemLogsManagement() {
    const [logs, setLogs] = useState<Log[]>([])     // Lista de logs
    const [isLoading, setIsLoading] = useState(true)    // Spinner
    const [searchTerm, setSearchTerm] = useState("")        // Campo de pesquisa em tempo real
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)      // Pesquisa após delay
    const [page, setPage] = useState(1)     // Página atual
    const [limit] = useState(20)        // Nº de registos por página
    const [totalPages, setTotalPages] = useState(1)     // Total de páginas
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([])      // Logs selecionados para apagar
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)       // Modal de confirmação

    // Debounce da pesquisa para evitar chamadas excessivas
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    // Recolhe os logs sempre que muda a página ou a pesquisa
    useEffect(() => {
        fetchLogs()
    }, [page, debouncedSearchTerm])

    // Função principal de fetch dos logs
    const fetchLogs = async () => {
        try {
            setIsLoading(true)

            const data = await fetchWithAuth("http://89.28.236.11:3000/api/admin/logs", {
                params: {
                    page,
                    limit,
                    action: debouncedSearchTerm || undefined,   // Só envia se existir
                }
            })

            if (data?.data) {
                setLogs(data.data)
                setTotalPages(data.meta.pages || 1)
                setSelectedLogIds([])   // Limpa seleção
            } else {
                console.error("Failed to fetch logs or no data returned")
            }

        } catch (error) {
            console.error("Error loading system logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Atualiza pequisa e faz reset à página
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(1)
    }

    // Navegação entre páginas
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    // Selecionar log individual
    const toggleSelectLog = (logId: string) => {
        setSelectedLogIds((prevSelected) =>
            prevSelected.includes(logId)
                ? prevSelected.filter((id) => id !== logId)
                : [...prevSelected, logId]
        )
    }

    // Selecionar todos os logs da página
    const toggleSelectAll = () => {
        if (selectedLogIds.length === logs.length) {
            setSelectedLogIds([])
        } else {
            setSelectedLogIds(logs.map((log) => log.id))
        }
    }

    // Apagar logs selecionados
    const handleDeleteSelected = async () => {
        if (selectedLogIds.length === 0) return

        const confirmed = confirm(`Are you sure you want to delete ${selectedLogIds.length} log(s)?`)
        if (!confirmed) return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(`http://89.28.236.11:3000/api/admin/logs`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: selectedLogIds }),
            })

            if (response.ok) {
                await fetchLogs()
                setSelectedLogIds([])
                toast.success('Logs deleted successfully.')
            } else {
                console.error("Failed to delete logs:", response.status)
                toast.error('Failed to delete logs (${response.status})')
            }
        } catch (error) {
            console.error("Error deleting logs:", error)
            toast.error("An unexpected error ocurred.")
        }
    }

    // Mostrar spinner enquanto carrega
    if (isLoading) {
        return (
            <LoadingSpinner message="Loading system logs..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                {/* Cabeçalho com botão "Back" */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                            System Logs
                        </h1>
                    </div>
                </div>

                {/* Cartão de logs com pesquisa e tabela */}
                <Card className="bg-[#1a1a1a] border border-white/10 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white [font-family:var(--font-poppins)]">List of System Logs</CardTitle>
                        <CardDescription className="text-white/70">Manage all system logs</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Pesquisa */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="h-4 w-4 text-white/60" />
                            <Input
                                placeholder="Search by action or IP..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="max-w-sm bg-black border border-white/10 text-white placeholder-white/50"
                            />
                        </div>

                        {/* Botão para apagar selecionados */}
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={selectedLogIds.length === 0}
                                onClick={() => setShowConfirmDialog(true)}
                                className="bg-red-600 text-white hover:bg-red-700 transition-all"
                            >
                                Delete ({selectedLogIds.length})
                            </Button>
                        </div>

                        {/* Tabela de logs */}
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-white/10">
                                    <TableHead>
                                        <input
                                            type="checkbox"
                                            checked={selectedLogIds.length === logs.length && logs.length > 0}
                                            onChange={toggleSelectAll}
                                            className="accent-[#66b497]"
                                        />
                                    </TableHead>
                                    <TableHead className="text-white/80">User</TableHead>
                                    <TableHead className="text-white/80">Action</TableHead>
                                    <TableHead className="text-white/80">IP</TableHead>
                                    <TableHead className="text-white/80">Agent</TableHead>
                                    <TableHead className="text-white/80">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={selectedLogIds.includes(log.id)}
                                                onChange={() => toggleSelectLog(log.id)}
                                                className="accent-[#66b497]"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-white">{log.user.name}</TableCell>
                                        <TableCell className="text-white/80">{log.action}</TableCell>
                                        <TableCell className="text-white/80">{log.ip}</TableCell>
                                        <TableCell className="text-white/80">{log.userAgent}</TableCell>
                                        <TableCell className="text-white/60">
                                            {new Date(log.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Paginação */}
                        <div className="flex items-center justify-center mt-6 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                Previous
                            </Button>
                            <span className="text-white/70">Page {page} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal de confirmação de remoção */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="[font-family:var(--font-poppins)] text-white">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <p className="[font-family:var(--font-poppins)]">Are you sure you want to delete <strong>{selectedLogIds.length}</strong> log(s)? This action cannot be undone.</p>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white"
                            onClick={() => setShowConfirmDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-[#66b497]"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem("token")

                                    const response = await fetch(`http://89.28.236.11:3000/api/admin/logs`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({ ids: selectedLogIds }),
                                    })

                                    if (response.ok) {
                                        await fetchLogs()
                                        setSelectedLogIds([])
                                        toast.success("Logs deleted successfully.")
                                    } else {
                                        toast.error("Failed to delete logs.")
                                    }
                                } catch (error) {
                                    toast.error("An unexpected error occurred.")
                                } finally {
                                    setShowConfirmDialog(false)
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    )

}