// src/components/admin/users-table.tsx
"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { User } from "@/lib/actions/user-actions"
import { EditUserDialog } from "../users/edit-user-dialog"
import { DeleteUserDialog } from "../users/delete-user-dialog"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UsersTableProps {
    users: User[]
    totalUsers: number
    currentPage: number
    totalPages: number
    onFiltersChange: (filters: UserFilters) => void
    onUserUpdated?: () => Promise<void>
}

export interface UserFilters {
    page: number
    limit: number
    search: string
    role: string
    tier: string
    isActive: string
    order: "asc" | "desc"
}

export function UsersTable({ users, totalUsers, currentPage, totalPages, onFiltersChange, onUserUpdated }: UsersTableProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

    // Filter states
    const [filters, setFilters] = useState<UserFilters>({
        page: currentPage,
        limit: 10,
        search: "",
        role: "all",
        tier: "all",
        isActive: "all",
        order: "desc",
    })

    // Debounce search
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }))
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Apply filters when they change
    useEffect(() => {
        onFiltersChange(filters)
    }, [filters, onFiltersChange])

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setShowEditDialog(true)
    }

    const updateFilter = (key: keyof UserFilters, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: key !== "page" ? 1 : (typeof value === "number" ? value : prev.page), // Reset to page 1 when changing filters
        }))
    }

    const clearFilters = () => {
        setSearchTerm("")
        setFilters({
            page: 1,
            limit: 10,
            search: "",
            role: "all",
            tier: "all",
            isActive: "all",
            order: "desc",
        })
    }

    const hasActiveFilters =
        filters.search || filters.role !== "all" || filters.tier !== "all" || filters.isActive !== "all"

    const handlePageChange = (page: number) => {
        updateFilter("page", page)
    }

    const toggleOrder = () => {
        updateFilter("order", filters.order === "desc" ? "asc" : "desc")
    }

    return (
        <>
            {/* Search e Filtros */}
            <div className="space-y-4 mb-6">
                {/* Search em destaque na primeira linha */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40 w-full"
                    />
                </div>

                {/* Grid de Filtros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                    <Select value={filters.role} onValueChange={(value) => updateFilter("role", value)}>
                        <SelectTrigger className="border-white/10 bg-[#111111] text-white w-full">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                            <SelectItem value="all" className="text-white hover:bg-white/10">All Roles</SelectItem>
                            <SelectItem value="ADMIN" className="text-white hover:bg-white/10">Admin</SelectItem>
                            <SelectItem value="CLIENT" className="text-white hover:bg-white/10">Client</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.tier} onValueChange={(value) => updateFilter("tier", value)}>
                        <SelectTrigger className="border-white/10 bg-[#111111] text-white w-full">
                            <SelectValue placeholder="Filter by tier" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                            <SelectItem value="all" className="text-white hover:bg-white/10">All Tiers</SelectItem>
                            <SelectItem value="FREE" className="text-white hover:bg-white/10">Free</SelectItem>
                            <SelectItem value="PRO" className="text-white hover:bg-white/10">Pro</SelectItem>
                            <SelectItem value="PREMIUM" className="text-white hover:bg-white/10">Premium</SelectItem>
                            <SelectItem value="ENTERPRISE" className="text-white hover:bg-white/10">Enterprise</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.isActive} onValueChange={(value) => updateFilter("isActive", value)}>
                        <SelectTrigger className="border-white/10 bg-[#111111] text-white w-full">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                            <SelectItem value="all" className="text-white hover:bg-white/10">All Status</SelectItem>
                            <SelectItem value="true" className="text-white hover:bg-white/10">Active</SelectItem>
                            <SelectItem value="false" className="text-white hover:bg-white/10">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.limit.toString()} onValueChange={(value) => updateFilter("limit", Number.parseInt(value))}>
                        <SelectTrigger className="border-white/10 bg-[#111111] text-white w-full">
                            <SelectValue placeholder="Per page" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10">
                            <SelectItem value="10" className="text-white hover:bg-white/10">10 per page</SelectItem>
                            <SelectItem value="25" className="text-white hover:bg-white/10">25 per page</SelectItem>
                            <SelectItem value="50" className="text-white hover:bg-white/10">50 per page</SelectItem>
                            <SelectItem value="100" className="text-white hover:bg-white/10">100 per page</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button variant="default" onClick={clearFilters} className="border-white/10 text-white hover:bg-white/10 w-full">
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Resumo dos resultados */}
                <div className="flex justify-between items-center text-sm text-white/60">
                    <span>
                        Showing {users.length} of {totalUsers} users
                        {hasActiveFilters && " (filtered)"}
                    </span>
                    <div className="flex items-center gap-2">
                        <span>Sort by created date:</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleOrder}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            <ArrowUpDown className="h-4 w-4 mr-1" />
                            {filters.order === "desc" ? "Newest first" : "Oldest first"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/80 font-medium">Name</TableHead>
                            <TableHead className="text-white/80 font-medium">Email</TableHead>
                            <TableHead className="text-white/80 font-medium">Role</TableHead>
                            <TableHead className="text-white/80 font-medium">Tier</TableHead>
                            <TableHead className="text-white/80 font-medium">Status</TableHead>
                            <TableHead className="text-white/80 font-medium">Created at</TableHead>
                            <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/60 py-8">
                                    No users found. Create your first user to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                    <TableCell className="text-white/80">
                                        <Link href={`/admin/users/${user.id}`} className="hover:opacity-80 transition">
                                            {user.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={user.email}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        <Badge
                                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                                            className={user.role === "ADMIN"
                                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                                : "bg-white/10 text-white/80 border border-white/20"}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.tier === "PREMIUM" ? "default" : "outline"}
                                            className={user.tier === "PREMIUM"
                                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                                : "bg-white/10 text-white/80 border border-white/20"}
                                        >
                                            {user.tier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        <Badge
                                            variant={user.isActive ? "default" : "destructive"}
                                            className={user.isActive
                                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                                : "bg-red-600/10 text-red-600 border border-red-600/40"}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-white hover:bg-white/10"
                                                    aria-label={`Actions for ${user.name}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-white hover:bg-white/10 focus:bg-white/10"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setUserIdToDelete(user.id)}
                                                    className="text-red-400 hover:bg-red-600/10 focus:bg-red-600/10"
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

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-white/60">
                        Page {currentPage} of {totalPages} ({totalUsers} total users)
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
                                        variant={currentPage === pageNumber ? "default" : "outline"}
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

            {/* Edit Dialog */}
            {selectedUser && <EditUserDialog open={showEditDialog} onOpenChange={setShowEditDialog} user={selectedUser} />}

            {/* Delete Dialog */}
            <DeleteUserDialog open={!!userIdToDelete} onOpenChange={() => setUserIdToDelete(null)} userId={userIdToDelete} />
        </>
    )
}