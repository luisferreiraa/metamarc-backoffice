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

interface User {
    name: string
}

interface Log {
    id: string
    userId: string
    user: User
    action: string
    ip: string
    userAgent: string
    createdAt: string
}

export function SystemLogsManagement() {
    const [logs, setLogs] = useState<Log[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const [page, setPage] = useState(1)
    const [limit] = useState(20)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    useEffect(() => {
        fetchLogs()
    }, [page, debouncedSearchTerm])

    const fetchLogs = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")

            // Construir query string dinamicamente
            const params = new URLSearchParams()
            params.append("page", String(page))
            params.append("limit", String(limit))
            if (searchTerm) {
                params.append("action", debouncedSearchTerm)
            }

            const response = await fetch(`http://89.28.236.11:3000/api/admin/logs?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setLogs(data.data || [])
                setTotalPages(data.meta.pages || 1)
                setSelectedLogIds([])
            } else {
                console.error("Failed to fetch logs:", response.status)
            }
        } catch (error) {
            console.error("Error loading system logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(1)
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    const toggleSelectLog = (logId: string) => {
        setSelectedLogIds((prevSelected) =>
            prevSelected.includes(logId)
                ? prevSelected.filter((id) => id !== logId)
                : [...prevSelected, logId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedLogIds.length === logs.length) {
            setSelectedLogIds([])
        } else {
            setSelectedLogIds(logs.map((log) => log.id))
        }
    }

    const handleDeleteSelected = async () => {
        if (selectedLogIds.length === 0) return

        if (!window.confirm(`Are you sure you want to delete ${selectedLogIds.length} log(s)?`)) {
            return
        }

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
            } else {
                console.error("Failed to delete logs:", response.status)
            }
        } catch (error) {
            console.error("Error deleting logs:", error)
        }
    }

    if (isLoading) {
        return (
            <LoadingSpinner message="Loading system logs..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                {/* Header */}
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

                {/* Log Card */}
                <Card className="bg-[#1a1a1a] border border-white/10 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white [font-family:var(--font-poppins)]">List of System Logs</CardTitle>
                        <CardDescription className="text-white/70">Manage all system logs</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Search */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="h-4 w-4 text-white/60" />
                            <Input
                                placeholder="Search by action or IP..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="max-w-sm bg-black border border-white/10 text-white placeholder-white/50"
                            />
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                disabled={selectedLogIds.length === 0}
                                className="bg-red-600 text-white hover:bg-red-700 transition-all"
                            >
                                Delete ({selectedLogIds.length})
                            </Button>
                        </div>

                        {/* Table */}
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

                        {/* Pagination */}
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
        </DashboardLayout>
    )

}