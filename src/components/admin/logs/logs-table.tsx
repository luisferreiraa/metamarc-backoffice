// src/components/adming/logs/logs-table.tsx

/**
 * @fileoverview This component renders the main data table for system logs in the Admin interface.
 * It manages client-side state for filtering, searching, selection (for bulk operations),
 * pagination, and handling user interactions with individual log entries.
 */

"use client"

import { useState, useEffect, useRef } from "react"
// Imports required icons from Lucide-React.
import {
    MoreHorizontal,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Calendar,
    User,
    Monitor,
    Wifi,
    UserRoundSearch,
} from "lucide-react"

// Imports UI components (Shadcn UI or similar).
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { Log } from "@/lib/actions/log-actions"        // Imports the Log data structure type.
// Imports the dialog components for single and bulk deletion.
import { DeleteLogDialog } from "./delete-log-dialog"
import { BulkDeleteLogsDialog } from "./bulk-delete-logs-dialog"

/**
 * @interface LogsTableProps
 * @description Defines the properties passed to the LogsTable component.
 */
interface LogsTableProps {
    logs: Log[]     // The log data for the current page.
    totalLogs: number       // Total number of logs available (unfiltered or filtered count).
    currentPage: number     // The current page number.
    totalPages: number      // The total number of pages.
    filters: LogFilters     // The current filters applied to the data.
    onFiltersChange: (filters: LogFilters) => void      // Callback to request a new data based on changed filters.
    onLogUpdated?: () => Promise<void>      // Callback to refresh data after a successful log operation.
}

/**
 * @interface LogFilters
 * @description Defines the structure for filtering and pagination parameters.
 */
export interface LogFilters {
    page: number
    limit: number       // Logs per page.
    search: string      // General search term.
    startDate: string       // Start date/time filter.
    endDate: string     // End date/time filter.
    userId: string
    ip: string      // IP address filter.
    order: "asc" | "desc"       // Sorting order (Ascending/Descending by date).
}

/**
 * @function LogsTable
 * @description The main component for displaying and managing log data.
 *
 * @param {LogsTableProps} props - The component properties.
 * @returns {JSX.Element} The rendered log table interface.
 */
export function LogsTable({ logs, totalLogs, currentPage, totalPages, filters, onFiltersChange, onLogUpdated }: LogsTableProps) {
    // State to hold the ID of the log currently targeted for single deletion.
    const [logIdToDelete, setLogIdToDelete] = useState<string | null>(null)
    // State to control the visibility of the bulk deletion dialog.
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    // State to store the IDs of logs selected via checkboxes for bulk actions.
    const [selectedLogs, setSelectedLogs] = useState<string[]>([])

    // States for local filter control, synchronized with the `filters` prop.
    const [searchTerm, setSearchTerm] = useState(filters.search)
    const [startDate, setStartDate] = useState(filters.startDate)
    const [endDate, setEndDate] = useState(filters.endDate)
    const [userId, setUserId] = useState(filters.userId)
    const [ip, setIp] = useState(filters.ip)
    const [limit, setLimit] = useState(filters.limit)
    const [order, setOrder] = useState(filters.order)

    /**
     * @hook useEffect
     * @description Synchronizes local filter states with the external `filters` prop
     * whenever the prop changes (e.g., when a parent component requests a data refresh).
     */
    useEffect(() => {
        setSearchTerm(filters.search)
        setStartDate(filters.startDate)
        setEndDate(filters.endDate)
        setUserId(filters.userId)
        setIp(filters.ip)
        setLimit(filters.limit)
        setOrder(filters.order)
    }, [filters])

    // Refs for debouncing search and filter changes to prevent excessive API calls.
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const filtersTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    /**
     * @function applyFilters
     * @description Merges new filter changes with current filters, resets selection,
     * and calls the `onFiltersChange` callback to request fresh data.
     *
     * @param {Partial<LogFilters>} [newFilters={}] - The partial set of filters to update.
     */
    const applyFilters = (newFilters: Partial<LogFilters> = {}) => {
        const mergedFilters: LogFilters = {
            // Merges new filters, defaulting to current local state if not provided.
            page: newFilters.page !== undefined ? newFilters.page : 1,
            limit: newFilters.limit !== undefined ? newFilters.limit : limit,
            search: newFilters.search !== undefined ? newFilters.search : searchTerm,
            startDate: newFilters.startDate !== undefined ? newFilters.startDate : startDate,
            endDate: newFilters.endDate !== undefined ? newFilters.endDate : endDate,
            userId: newFilters.userId !== undefined ? newFilters.userId : userId,
            ip: newFilters.ip !== undefined ? newFilters.ip : ip,
            order: newFilters.order !== undefined ? newFilters.order : order,
        }

        setSelectedLogs([])     // Clear selections on filter change.
        onFiltersChange(mergedFilters)      // Notify parent component/data source to fetch new data.
    }

    /**
     * @function handleSearchChange
     * @description Handles changes to the main search input with debouncing.
     *
     * @param {string} value - The new search term.
     */
    const handleSearchChange = (value: string) => {
        setSearchTerm(value)

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

        // Debounce: Wait 500ms before applying the filter to avoid querying on every keystroke.
        searchTimeoutRef.current = setTimeout(() => {
            applyFilters({ search: value, page: 1 })
        }, 500)
    }

    /**
     * @function handleFilterChange
     * @description Handles changes to secondary filters (date, user ID, IP) with debouncing.
     *
     * @param {keyof LogFilters} key - The filter property name.
     * @param {string | number} value - The new filter value.
     */
    const handleFilterChange = (key: keyof LogFilters, value: string | number) => {
        // Update local state immediately for input control.
        switch (key) {
            case "startDate":
                setStartDate(value as string)
                break
            case "endDate":
                setEndDate(value as string)
                break
            case "userId":
                setUserId(value as string)
                break
            case "ip":
                setIp(value as string)
                break
            case "limit":
                setLimit(value as number)
                break
            case "order":
                setOrder(value as "asc" | "desc")
                break
        }

        if (filtersTimeoutRef.current) clearTimeout(filtersTimeoutRef.current)

        // Debounce: Wait 300ms before applying the filter.
        filtersTimeoutRef.current = setTimeout(() => {
            applyFilters({
                [key]: value,
                // Reset to page 1 unless the change was a direct page change itself.
                page: key !== "page" ? 1 : typeof value === "number" ? value : Number(value),
            })
        }, 300)
    }

    /**
     * @function handleImmediateChange
     * @description Handles filters that should trigger an immediate API call without debouncing (e.g., limit, order).
     *
     * @param {keyof LogFilters} key - The filter property name.
     * @param {string | number} value - The new filter value.
     */
    const handleImmediateChange = (key: keyof LogFilters, value: string | number) => {
        switch (key) {
            case "limit":
                setLimit(value as number)
                break
            case "order":
                setOrder(value as "asc" | "desc")
                break
        }
        applyFilters({ [key]: value, page: 1 })     // Always reset to page 1 when changing limit or order.
    }

    /**
     * @function clearFilters
     * @description Resets all local filter states and applies the cleared filters to request unfiltered data.
     */
    const clearFilters = () => {
        setSearchTerm("")
        setStartDate("")
        setEndDate("")
        setUserId("")
        setIp("")
        setLimit(10)
        setOrder("desc")
        setSelectedLogs([])

        applyFilters({
            page: 1,
            limit: 10,
            search: "",
            startDate: "",
            endDate: "",
            userId: "",
            ip: "",
            order: "desc",
        })
    }

    // Checks if any filters other than default pagination/order are active.
    const hasActiveFilters =
        Boolean(searchTerm) ||
        Boolean(startDate) ||
        Boolean(endDate) ||
        Boolean(userId) ||
        Boolean(ip)

    /**
     * @function handlePageChange
     * @description Changes the current page number and triggers a data fetch.
     *
     * @param {number} page - The page number to navigate to.
     */
    const handlePageChange = (page: number) => {
        applyFilters({ page })
    }

    /**
     * @function toggleOrder
     * @description Toggles the sorting order between 'asc' and 'desc' and triggers a data fetch.
     */
    const toggleOrder = () => {
        const newOrder = order === "desc" ? "asc" : "desc"
        setOrder(newOrder)
        applyFilters({ order: newOrder })
    }

    /**
     * @function handleSelectAll
     * @description Selects or deselects all logs on the current page.
     *
     * @param {boolean} checked - True to select all, false to deselect all.
     */
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLogs(logs.map((log) => log.id))
        } else {
            setSelectedLogs([])
        }
    }

    /**
     * @function handleSelectLog
     * @description Selects or deselects a single log entry.
     *
     * @param {string} logId - The ID of the log to toggle.
     * @param {boolean} checked - True to select, false to deselect.
     */
    const handleSelectLog = (logId: string, checked: boolean) => {
        if (checked) {
            setSelectedLogs((prev) => [...prev, logId])
        } else {
            setSelectedLogs((prev) => prev.filter((id) => id !== logId))
        }
    }

    /**
     * @hook useEffect
     * @description Cleanup function: clears any pending timeouts when the component unmounts.
     */
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
            if (filtersTimeoutRef.current) clearTimeout(filtersTimeoutRef.current)
        }
    }, [])

    /**
     * @function formatDate
     * @description Formats a date string into a localized, readable format (pt-PT).
     *
     * @param {string} dateString - The raw ISO date string.
     * @returns {string} The formatted date string.
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    /**
     * @function getActionBadgeColor
     * @description Determines the CSS class for a badge based on the log action content.
     *
     * @param {string} action - The log action description.
     * @returns {string} Tailwind CSS class string for styling.
     */
    const getActionBadgeColor = (action: string) => {
        const actionLower = action.toLowerCase()
        if (actionLower.includes("login")) return "bg-green-500/10 text-green-400 border-green-500/30"
        if (actionLower.includes("logout")) return "bg-blue-500/10 text-blue-400 border-blue-500/30"
        if (actionLower.includes("delete")) return "bg-red-500/10 text-red-400 border-red-500/30"
        if (actionLower.includes("create")) return "bg-[#66b497]/10 text-[#66b497] border-[#66b497]/30"
        if (actionLower.includes("update")) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
        return "bg-white/10 text-white/80 border-white/20"
    }

    // Component Rendering
    return (
        <>
            <div className="space-y-4 mb-6">
                {/* 1. Search Input */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                        placeholder="Search logs by action..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                    />
                </div>

                {/* 2. Filter Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Start Date Filter */}
                    <div>
                        <Input
                            type="datetime-local"
                            placeholder="Start date"
                            value={startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white/40"
                        />
                    </div>

                    {/* End Date Filter */}
                    <div>
                        <Input
                            type="datetime-local"
                            placeholder="End date"
                            value={endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white/40"
                        />
                    </div>

                    {/* User ID Filter */}
                    <div className="relative max-w-md">
                        <UserRoundSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                        <Input
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => handleFilterChange("userId", e.target.value)}
                            className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                        />
                    </div>

                    {/* IP Address Filter */}
                    <div className="relative max-w-md">
                        <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                        <Input
                            placeholder="IP Address"
                            value={ip}
                            onChange={(e) => handleFilterChange("ip", e.target.value)}
                            className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                        />
                    </div>

                    {/* Limit (Items Per Page) Select */}
                    <div>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => handleImmediateChange("limit", Number.parseInt(value))}
                        >
                            <SelectTrigger className="border-white/10 bg-[#111111] text-white w-full">
                                <SelectValue placeholder="Per page" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10">
                                <SelectItem value="10" className="text-white hover:bg-white/10">
                                    10 per page
                                </SelectItem>
                                <SelectItem value="25" className="text-white hover:bg-white/10">
                                    25 per page
                                </SelectItem>
                                <SelectItem value="50" className="text-white hover:bg-white/10">
                                    50 per page
                                </SelectItem>
                                <SelectItem value="100" className="text-white hover:bg-white/10">
                                    100 per page
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <div className="flex justify-end mt-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={clearFilters}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Status and Action Row */}
                <div className="flex justify-between items-center text-sm">
                    {/* Log Count and Bulk Actions */}
                    <div className="flex items-center gap-4">
                        <span className="text-white/60">
                            Showing {logs.length} of {totalLogs} logs
                            {hasActiveFilters && " (filtered)"}
                        </span>
                        {selectedLogs.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-[#66b497]/30 text-[#66b497]">
                                    {selectedLogs.length} selected
                                </Badge>
                                {/* Button to open Bulk Delete Dialog */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowBulkDeleteDialog(true)}
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Selected
                                </Button>
                            </div>
                        )}
                    </div>
                    {/* Order Toggle */}
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                            >
                                Clear Filters
                            </Button>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={toggleOrder}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            <ArrowUpDown className="h-4 w-4 mr-1" />
                            {order === "desc" ? "Newest first" : "Oldest first"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. Logs Table */}
            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
                            {/* Select All Checkbox */}
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedLogs.length === logs.length && logs.length > 0}
                                    onCheckedChange={handleSelectAll}
                                    className="border-white/20"
                                />
                            </TableHead>
                            <TableHead className="text-white/80 font-medium">Action</TableHead>
                            <TableHead className="text-white/80 font-medium">User</TableHead>
                            <TableHead className="text-white/80 font-medium">IP Address</TableHead>
                            <TableHead className="text-white/80 font-medium">User Agent</TableHead>
                            <TableHead className="text-white/80 font-medium">Date</TableHead>
                            <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            // No Data Row
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-white/60 py-8">
                                    {hasActiveFilters ? (
                                        <div className="space-y-2">
                                            <p>No logs found matching your filters.</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    ) : (
                                        "No logs found."
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Log Rows
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedLogs.includes(log.id)}
                                            onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                                            className="border-white/20"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* Log Action Badge */}
                                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        {/* User Details */}
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-white/40" />
                                            <div>
                                                <div className="font-medium">{log.user.name}</div>
                                                <div className="text-xs text-white/60">{log.user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        {/* IP Address */}
                                        <div className="flex items-center gap-2">
                                            <Monitor className="h-4 w-4 text-white/40" />
                                            {log.ip}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={log.userAgent}>
                                        {/* User Agent (Truncated for space) */}
                                        {log.userAgent}
                                    </TableCell>
                                    <TableCell className="text-white/70">
                                        {/* Creation Date */}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-white/40" />
                                            {formatDate(log.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* Actions Dropdown Menu (Single Delete) */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-white hover:bg-white/10"
                                                    aria-label={`Actions for log ${log.id}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                                                <DropdownMenuItem
                                                    onClick={() => setLogIdToDelete(log.id)}
                                                    className="text-red-400 hover:bg-red-500/10 focus:bg-red-600/10"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 4. Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-white/60">
                        Page {currentPage} of {totalPages} ({totalLogs} total logs)
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        {/* Page Number Buttons (showing a max of 5 buttons for smart pagination) */}
                        <div className="flex items-center space-x-1">
                            {/* Dynamically generates page numbers based on current page and total pages */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber
                                if (totalPages <= 5) {
                                    pageNumber = i + 1
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i
                                } else {
                                    pageNumber = currentPage - 2 + i
                                }

                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "default"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={
                                            currentPage === pageNumber
                                                ? "bg-[#66b497] text-black hover:bg-[#5aa88b]"
                                                : "border-white/10 text-white hover:bg-white/10 bg-transparent"
                                        }
                                    >
                                        {pageNumber}
                                    </Button>
                                )
                            })}
                        </div>

                        {/* Next Button */}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* 5. Dialogs */}
            {/* Single Delete Dialog */}
            <DeleteLogDialog
                open={!!logIdToDelete}
                onOpenChange={() => setLogIdToDelete(null)}
                logId={logIdToDelete}
                onLogDeleted={onLogUpdated}
            />

            {/* Bulk Delete Dialog */}
            <BulkDeleteLogsDialog
                open={showBulkDeleteDialog}
                onOpenChange={setShowBulkDeleteDialog}
                selectedIds={selectedLogs}
                onLogsDeleted={onLogUpdated}
            />
        </>
    )
}

