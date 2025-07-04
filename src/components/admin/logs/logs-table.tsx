"use client"

import { useState, useEffect, useRef } from "react"
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { Log } from "@/lib/actions/log-actions"
import { DeleteLogDialog } from "./delete-log-dialog"
import { BulkDeleteLogsDialog } from "./bulk-delete-logs-dialog"

interface LogsTableProps {
    logs: Log[]
    totalLogs: number
    currentPage: number
    totalPages: number
    filters: LogFilters
    onFiltersChange: (filters: LogFilters) => void
    onLogUpdated?: () => Promise<void>
}

export interface LogFilters {
    page: number
    limit: number
    search: string
    startDate: string
    endDate: string
    userId: string
    ip: string
    order: "asc" | "desc"
}

export function LogsTable({ logs, totalLogs, currentPage, totalPages, filters, onFiltersChange, onLogUpdated }: LogsTableProps) {
    const [logIdToDelete, setLogIdToDelete] = useState<string | null>(null)
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
    const [selectedLogs, setSelectedLogs] = useState<string[]>([])

    // Estados locais de filtros sincronizados com props.filters
    const [searchTerm, setSearchTerm] = useState(filters.search)
    const [startDate, setStartDate] = useState(filters.startDate)
    const [endDate, setEndDate] = useState(filters.endDate)
    const [userId, setUserId] = useState(filters.userId)
    const [ip, setIp] = useState(filters.ip)
    const [limit, setLimit] = useState(filters.limit)
    const [order, setOrder] = useState(filters.order)

    // Sincroniza estados locais quando filters do pai mudam
    useEffect(() => {
        setSearchTerm(filters.search)
        setStartDate(filters.startDate)
        setEndDate(filters.endDate)
        setUserId(filters.userId)
        setIp(filters.ip)
        setLimit(filters.limit)
        setOrder(filters.order)
    }, [filters])

    // Refs para debounce
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const filtersTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Aplica filtros: chama onFiltersChange no pai
    const applyFilters = (newFilters: Partial<LogFilters> = {}) => {
        const mergedFilters: LogFilters = {
            page: newFilters.page !== undefined ? newFilters.page : 1,
            limit: newFilters.limit !== undefined ? newFilters.limit : limit,
            search: newFilters.search !== undefined ? newFilters.search : searchTerm,
            startDate: newFilters.startDate !== undefined ? newFilters.startDate : startDate,
            endDate: newFilters.endDate !== undefined ? newFilters.endDate : endDate,
            userId: newFilters.userId !== undefined ? newFilters.userId : userId,
            ip: newFilters.ip !== undefined ? newFilters.ip : ip,
            order: newFilters.order !== undefined ? newFilters.order : order,
        }

        setSelectedLogs([]) // limpa seleção ao aplicar filtros ou mudar página
        onFiltersChange(mergedFilters)
    }

    // Debounce search
    const handleSearchChange = (value: string) => {
        setSearchTerm(value)

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

        searchTimeoutRef.current = setTimeout(() => {
            applyFilters({ search: value, page: 1 })
        }, 500)
    }

    // Debounce para outros filtros
    const handleFilterChange = (key: keyof LogFilters, value: string | number) => {
        // Atualiza estado local imediatamente
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

        filtersTimeoutRef.current = setTimeout(() => {
            applyFilters({
                [key]: value,
                page: key !== "page" ? 1 : typeof value === "number" ? value : Number(value),
            })
        }, 300)
    }

    // Mudanças imediatas (sem debounce) para limit e order
    const handleImmediateChange = (key: keyof LogFilters, value: string | number) => {
        switch (key) {
            case "limit":
                setLimit(value as number)
                break
            case "order":
                setOrder(value as "asc" | "desc")
                break
        }
        applyFilters({ [key]: value, page: 1 })
    }

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

    const hasActiveFilters =
        Boolean(searchTerm) ||
        Boolean(startDate) ||
        Boolean(endDate) ||
        Boolean(userId) ||
        Boolean(ip)

    const handlePageChange = (page: number) => {
        applyFilters({ page })
    }

    const toggleOrder = () => {
        const newOrder = order === "desc" ? "asc" : "desc"
        setOrder(newOrder)
        applyFilters({ order: newOrder })
    }

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLogs(logs.map((log) => log.id))
        } else {
            setSelectedLogs([])
        }
    }

    const handleSelectLog = (logId: string, checked: boolean) => {
        if (checked) {
            setSelectedLogs((prev) => [...prev, logId])
        } else {
            setSelectedLogs((prev) => prev.filter((id) => id !== logId))
        }
    }

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
            if (filtersTimeoutRef.current) clearTimeout(filtersTimeoutRef.current)
        }
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getActionBadgeColor = (action: string) => {
        const actionLower = action.toLowerCase()
        if (actionLower.includes("login")) return "bg-green-500/10 text-green-400 border-green-500/30"
        if (actionLower.includes("logout")) return "bg-blue-500/10 text-blue-400 border-blue-500/30"
        if (actionLower.includes("delete")) return "bg-red-500/10 text-red-400 border-red-500/30"
        if (actionLower.includes("create")) return "bg-[#66b497]/10 text-[#66b497] border-[#66b497]/30"
        if (actionLower.includes("update")) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
        return "bg-white/10 text-white/80 border-white/20"
    }

    return (
        <>
            {/* Área de Pesquisa e Filtros */}
            <div className="space-y-4 mb-6">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                        placeholder="Search logs by action..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                    />
                </div>

                {/* Grid de filtros adicionais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <Input
                            type="datetime-local"
                            placeholder="Start date"
                            value={startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white/40"
                        />
                    </div>

                    <div>
                        <Input
                            type="datetime-local"
                            placeholder="End date"
                            value={endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white/40"
                        />
                    </div>

                    <div className="relative max-w-md">
                        <UserRoundSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                        <Input
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => handleFilterChange("userId", e.target.value)}
                            className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                        />
                    </div>

                    <div className="relative max-w-md">
                        <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                        <Input
                            placeholder="IP Address"
                            value={ip}
                            onChange={(e) => handleFilterChange("ip", e.target.value)}
                            className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40"
                        />
                    </div>

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

                {/* Botão Clear Filters abaixo do grid, alinhado à direita */}
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

                {/* Actions and Results Summary */}
                <div className="flex justify-between items-center text-sm">
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

            {/* Table */}
            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
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
                                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-white/40" />
                                            <div>
                                                <div className="font-medium">{log.user.name}</div>
                                                <div className="text-xs text-white/60">{log.user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="h-4 w-4 text-white/40" />
                                            {log.ip}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={log.userAgent}>
                                        {log.userAgent}
                                    </TableCell>
                                    <TableCell className="text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-white/40" />
                                            {formatDate(log.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-white/60">
                        Page {currentPage} of {totalPages} ({totalLogs} total logs)
                    </div>
                    <div className="flex items-center space-x-2">
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

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
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

            {/* Delete Dialog */}
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

