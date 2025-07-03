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
    const [logs, setLogs] = useState<Log[]>(initialLogs)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

    // Pagination and filter states
    const [totalLogs, setTotalLogs] = useState(initialMeta?.total || 0)
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1)
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1)

    // Função para buscar logs com filtros
    const fetchLogs = useCallback(async (filters: LogFilters) => {
        setIsLoading(true)
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
                userId: filters.userId || undefined,
                ip: filters.ip || undefined,
                order: filters.order,
            }

            const response = await getLogsWithSearch(params)

            setLogs(response.data)
            setTotalLogs(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Handle filter changes - simplified without comparison
    const handleFiltersChange = useCallback(
        (filters: LogFilters) => {
            fetchLogs(filters)
        },
        [fetchLogs],
    )

    // Função para atualizar a lista de logs
    const refreshLogs = async () => {
        setIsRefreshing(true)
        try {
            // Use current filters for refresh
            const currentFilters: LogFilters = {
                page: 1,
                limit: 10,
                search: "",
                startDate: "",
                endDate: "",
                userId: "",
                ip: "",
                order: "desc",
            }
            await fetchLogs(currentFilters)
        } catch (error) {
            console.error("Error refreshing logs:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Atualiza o estado local quando initialLogs muda (apenas uma vez)
    useEffect(() => {
        setLogs(initialLogs)
        if (initialMeta) {
            setTotalLogs(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, []) // Empty dependency array - only run once

    const handleLogUpdated = async () => {
        await refreshLogs()
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">
                {/* Header */}
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{totalLogs}</div>
                        <div className="text-white/60 text-sm">Total Logs</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#66b497]">
                            {logs.filter((log) => log.action.toLowerCase().includes("login")).length}
                        </div>
                        <div className="text-white/60 text-sm">Login Events</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">
                            {logs.filter((log) => log.action.toLowerCase().includes("delete")).length}
                        </div>
                        <div className="text-white/60 text-sm">Delete Actions</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">{new Set(logs.map((log) => log.userId)).size}</div>
                        <div className="text-white/60 text-sm">Unique Users</div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <LoadingSpinner message="Loading logs..." />
                ) : (
                    /* Table */
                    <Suspense fallback={<LoadingSpinner message="Loading logs..." />}>
                        <LogsTable
                            logs={logs}
                            totalLogs={totalLogs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onFiltersChange={handleFiltersChange}
                            onLogUpdated={handleLogUpdated}
                        />
                    </Suspense>
                )}

                {/* Bulk Delete Dialog */}
                <BulkDeleteLogsDialog
                    open={showBulkDeleteDialog}
                    onOpenChange={setShowBulkDeleteDialog}
                    onLogsDeleted={handleLogUpdated}
                />
            </div>
        </DashboardLayout>
    )
}