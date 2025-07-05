// src/components/adming/logs/logs-management.tsx
"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"

import { LogsTable, type LogFilters } from "@/components/admin/logs/logs-table"
import { BulkDeleteLogsDialog } from "@/components/admin/logs/bulk-delete-logs-dialog"
import { type Log, getLogsWithSearch } from "@/lib/actions/log-actions"
import { LoadingSpinner } from "@/components/layout/loading-spinner"

// Interface para as props do componente
interface LogsManagementProps {
    initialLogs: Log[]
    initialMeta?: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export function LogsManagement({ initialLogs, initialMeta }: LogsManagementProps) {
    const [logs, setLogs] = useState<Log[]>(initialLogs)        // Lista de logs
    const [isLoading, setIsLoading] = useState(false)       // Estado de carregamento
    const [isRefreshing, setIsRefreshing] = useState(false)     //Estado de refresh
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)     // Controlo do dialog

    // Estados de paginação
    const [totalLogs, setTotalLogs] = useState(initialMeta?.total || 0)
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1)
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1)

    // Estado dos filtros atuais
    const [filters, setFilters] = useState<LogFilters>({
        page: initialMeta?.page || 1,
        limit: initialMeta?.limit || 10,
        search: "",
        startDate: "",
        endDate: "",
        userId: "",
        ip: "",
        order: "desc",
    })

    /**
     * Função para buscar logs com filtros
     * useCallback é usado para memorização e evitar recriações desnecessárias
     */
    const fetchLogs = useCallback(async (filters: LogFilters) => {
        setIsLoading(true)
        try {
            // Prepara os parâmetros para a requisição
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                startDate: filters.startDate || undefined,      // Converte string vazia para undefined
                endDate: filters.endDate || undefined,
                userId: filters.userId || undefined,
                ip: filters.ip || undefined,
                order: filters.order,
            }

            // Faz a requisição para a API
            const response = await getLogsWithSearch(params)

            // Atualiza estados com a resposta
            setLogs(response.data)
            setTotalLogs(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
            setFilters(filters)     // Armazena os filtros atuais
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Manipulador de mudanças de filtro
     * Chama fetchLogs com os novos filtros
     */
    const handleFiltersChange = useCallback(
        (newfilters: LogFilters) => {
            fetchLogs(newfilters)
        },
        [fetchLogs],
    )

    /**
     * Função para atualizar a lista de logs
     * Faz reset para a primeira página ao atualizar
     */
    const refreshLogs = async () => {
        setIsRefreshing(true)
        try {
            // Usa os filtros atuais para refresh, resetando a página para 1
            const currentFilters: LogFilters = { ...filters, page: 1 }
            await fetchLogs(currentFilters)
        } catch (error) {
            console.error("Error refreshing logs:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Inicializa estados com os valores iniciais
    useEffect(() => {
        setLogs(initialLogs)
        if (initialMeta) {
            setTotalLogs(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, []) // Executa apenas uma vez no mount

    /**
     * Callback para quando um log é atualizado
     * Atualiza a lsita de logs
     */
    const handleLogUpdated = async () => {
        await refreshLogs()
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">
                {/* Cabeçadlho */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300 bg-transparent"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">System Logs</h1>
                            <p className="text-white/60 mt-1">Monitor system activity and user actions</p>
                        </div>
                    </div>
                </div>

                {/* Cartões de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Total de logs */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{totalLogs}</div>
                        <div className="text-white/60 text-sm">Total Logs</div>
                    </div>

                    {/* Eventos de login */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#66b497]">
                            {logs.filter((log) => log.action.toLowerCase().includes("login")).length}
                        </div>
                        <div className="text-white/60 text-sm">Login Events</div>
                    </div>

                    {/* Ações de delete */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">
                            {logs.filter((log) => log.action.toLowerCase().includes("delete")).length}
                        </div>
                        <div className="text-white/60 text-sm">Delete Actions</div>
                    </div>

                    {/* Utilizadores únicos */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">{new Set(logs.map((log) => log.userId)).size}</div>
                        <div className="text-white/60 text-sm">Unique Users</div>
                    </div>
                </div>

                {/* Estado de carregamento */}
                {isLoading ? (
                    <LoadingSpinner message="Loading logs..." />
                ) : (
                    /* Tabela de logs com Suspense para fallback */
                    <Suspense fallback={<LoadingSpinner message="Loading logs..." />}>
                        <LogsTable
                            logs={logs}
                            totalLogs={totalLogs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onLogUpdated={handleLogUpdated}
                        />
                    </Suspense>
                )}

                {/* Dialog para bulk delete */}
                <BulkDeleteLogsDialog
                    open={showBulkDeleteDialog}
                    onOpenChange={setShowBulkDeleteDialog}
                    onLogsDeleted={handleLogUpdated}
                />
            </div>
        </DashboardLayout>
    )
}