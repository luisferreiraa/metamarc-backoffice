// src/components/adming/logs/logs-management.tsx

/**
 * @fileoverview This component provides the main interface for managing system and
 * user activity logs in the Admin dashboard. It handles fetching, filtering,
 * pagination, displaying statistics, and triggering bulk deletion operations.
 */

"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
// Imports UI components
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"        // Icons for navigation
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"

// Imports the LogsTable component and filter type definition.
import { LogsTable, type LogFilters } from "@/components/admin/logs/logs-table"
// Imports the dialog component for bulk deletion.
import { BulkDeleteLogsDialog } from "@/components/admin/logs/bulk-delete-logs-dialog"
// Imports types and the server action function for fetching logs.
import { type Log, getLogsWithSearch } from "@/lib/actions/log-actions"
import { LoadingSpinner } from "@/components/layout/loading-spinner"        // Loading indicator component.

/**
 * @interface LogsManagementProps
 * @description Defines the props passed to the component, usually initial data fetched server-side.
 */
interface LogsManagementProps {
    initialLogs: Log[]      // The initial array of log entries to display.
    initialMeta?: {     // Initial metadata for pagination.
        total: number
        page: number
        limit: number
        pages: number
    }
}

/**
 * @function LogsManagement
 * @description Manages the state and logic for the Admin System Logs view.
 * 
 * @param {LogsManagementProps} props - Initial logs and metadata.
 * @returns {JSX.Element} The rendered log management interface.
 */
export function LogsManagement({ initialLogs, initialMeta }: LogsManagementProps) {
    // State for the current list of logs displayed in the table.
    const [logs, setLogs] = useState<Log[]>(initialLogs)
    // General loading state for the main data fetch.
    const [isLoading, setIsLoading] = useState(false)
    // Specific loading state for the refresh button.
    const [isRefreshing, setIsRefreshing] = useState(false)
    // State to control the visibility of the bulk delete confirmation dialog.
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

    // Pagination/Metadata states initialized with initial data.
    const [totalLogs, setTotalLogs] = useState(initialMeta?.total || 0)
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1)
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1)

    // State for the current filtering and pagination parameters.
    const [filters, setFilters] = useState<LogFilters>({
        page: initialMeta?.page || 1,
        limit: initialMeta?.limit || 10,
        search: "",
        startDate: "",
        endDate: "",
        userId: "",
        ip: "",
        order: "desc",      // Default sorting order.
    })

    /**
     * @async
     * @function fetchLogs
     * @description Fetches logs from the backend using the current filters.
     * Uses useCallback to memoize the function, optimizing performance.
     *
     * @param {LogFilters} filters - The parameters (pagination, search, filters) for the API call.
     */
    const fetchLogs = useCallback(async (filters: LogFilters) => {
        setIsLoading(true)
        try {
            // Prepare parameters for the Server Action, converting empty string to undefined where applicable.
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

            // Calls the server action to retrieve logs.
            const response = await getLogsWithSearch(params)

            setLogs(response.data)
            setTotalLogs(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
            setFilters(filters)     // Update filters state to reflect the fetched parameters.
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])      // Empty dependency array as 'getLogsWithSearch' is imported. 

    /**
     * @function handleFiltersChange
     * @description Callback passed to the `LogsTable` to trigger a new log fetch whenever
     * pagination, search, or filters change.
     */
    const handleFiltersChange = useCallback(
        (newfilters: LogFilters) => {
            fetchLogs(newfilters)
        },
        [fetchLogs],
    )

    /**
     * @async
     * @function refreshLogs
     * @description Refreshes the log data, resetting to the first page if necessary,
     * while maintaining current filters.
     */
    const refreshLogs = async () => {
        setIsRefreshing(true)
        try {
            // Force page 1 on refresh, maintaining other current filters.
            const currentFilters: LogFilters = { ...filters, page: 1 }
            await fetchLogs(currentFilters)
        } catch (error) {
            console.error("Error refreshing logs:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    /**
     * @hook useEffect
     * @description Used to set the initial state when the component first renders,
     * ensures client state is synced with server-provided initial props.
     */
    useEffect(() => {
        setLogs(initialLogs)
        if (initialMeta) {
            setTotalLogs(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, [])

    /**
     * @async
     * @function handleLogUpdated
     * @description Callback function executed after a single log is deleted or bulk deletion occurs,
     * triggering a refresh of the log data.
     */
    const handleLogUpdated = async () => {
        await refreshLogs()
    }

    // Component Rendering
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">
                {/* Header and Controls */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            {/* Back Button */}
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
                    {/* Action buttons (e.g., Refresh, Bulk Delete trigger) - Currently not implemented in this section */}
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{totalLogs}</div>
                        <div className="text-white/60 text-sm">Total Logs</div>
                    </div>

                    {/* Login Events Card (Calculated from current page data) */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#66b497]">
                            {logs.filter((log) => log.action.toLowerCase().includes("login")).length}
                        </div>
                        <div className="text-white/60 text-sm">Login Events</div>
                    </div>

                    {/* Delete Actions Card (Calculated from current page data) */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">
                            {logs.filter((log) => log.action.toLowerCase().includes("delete")).length}
                        </div>
                        <div className="text-white/60 text-sm">Delete Actions</div>
                    </div>

                    {/* Unique Users Card (Calculated from current page data) */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        {/* Note: This calculates unique users only on the current page's logs */}
                        <div className="text-2xl font-bold text-blue-400">{new Set(logs.map((log) => log.userId)).size}</div>
                        <div className="text-white/60 text-sm">Unique Users</div>
                    </div>
                </div>

                {/* Log Table Display and Loading State */}
                {isLoading ? (
                    <LoadingSpinner message="Loading logs..." />
                ) : (
                    // Suspense boundary for potential server component rendering within the table.
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

                {/* Bulk Delete Dialog */}
                {/* Note: The selectedIds prop is missing here, it should be managed by LogsTable and passed down. */}
                <BulkDeleteLogsDialog
                    open={showBulkDeleteDialog}
                    onOpenChange={setShowBulkDeleteDialog}
                    onLogsDeleted={handleLogUpdated}
                />
            </div>
        </DashboardLayout>
    )
}