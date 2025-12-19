// src/components/admin/users/users-table.tsx

/**
 * @fileoverview This component renders the table displaying user accounts in the Admin interface.
 * It includes functionality for searching, filtering, pagination, and triggering user CRUD operations (edit/delete).
 * Data fetching for filtering/pagination is managed by calling the `onFiltersChange` prop,
 * which typically triggers a fetch in the parent component (`UsersManagement`).
 */

"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"

// Imports UI components (Shadcn UI or similar).
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { User } from "@/lib/actions/user-actions"       // Imports the User data structure type.
// Imports dialog components for operations.
import { EditUserDialog } from "../users/edit-user-dialog"
import { DeleteUserDialog } from "../users/delete-user-dialog"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * @interface UsersTableProps
 * @description Defines the properties passed to the UsersTable component.
 */
interface UsersTableProps {
    users: User[]       // The list of user data currently displayed (based on current filters/page).
    totalUsers: number      // Total number of users across all pages (for display).
    currentPage: number     // The current active page number.
    totalPages: number      // The total number of pages available.
    onFiltersChange: (filters: UserFilters) => void     // Callback to request new data based on updated filters/page.
    onUserUpdated?: () => Promise<void>     // Optional callback to refresh the parent list after an operation (edit/delete).
}

/**
 * @interface UserFilters
 * @description Defines the structure for filtering and pagination parameters.
 */
export interface UserFilters {
    page: number        // Current page number.
    limit: number       // Items per page.
    search: string      // Search query string.
    role: string        // Filter by user role ('all', 'ADMIN', 'CLIENT').
    tier: string        // Filter by subscription tier ('all', 'FREE', 'PRO', etc.).
    isActive: string        // Filter by active status ('all', 'true', 'false').
    order: "asc" | "desc"       // Sort order ('desc' for newest first).
}

/**
 * @function UsersTable
 * @description Component responsible for rendering the users table, filtering controls, and pagination UI.
 *
 * @param {UsersTableProps} props - The component properties.
 * @returns {JSX.Element} The rendered users table and associated controls.
 */
export function UsersTable({ users, totalUsers, currentPage, totalPages, onFiltersChange, onUserUpdated }: UsersTableProps) {

    // State to hold the user object currently selected for editing.
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // State to control the visibility of the Edit User dialog.
    const [showEditDialog, setShowEditDialog] = useState(false)

    // State to hold the ID of the user currently targeted for deletion.
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

    // State to manage all filtering and pagination parameters.
    const [filters, setFilters] = useState<UserFilters>({
        page: currentPage,
        limit: 10,
        search: "",
        role: "all",
        tier: "all",
        isActive: "all",
        order: "desc",
    })

    // Local state for the search input value (used for debouncing).
    const [searchTerm, setSearchTerm] = useState("")

    /**
     * @hook useEffect
     * @description Debounces the `searchTerm`. When `searchTerm` changes, it waits 500ms
     * before updating the main `filters` state with the new search value, preventing
     * excessive calls to `onFiltersChange` while the user is typing.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            // Update search filter and reset page to 1
            setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }))
        }, 500)

        return () => clearTimeout(timer)        // Cleanup function to clear the previous timer.
    }, [searchTerm])

    /**
     * @hook useEffect
     * @description Triggers the parent's data fetching mechanism whenever the `filters` state changes.
     * This is the core mechanism for client-side filtering and pagination.
     */
    useEffect(() => {
        onFiltersChange(filters)
    }, [filters, onFiltersChange])

    /**
     * @function handleEditUser
     * @description Sets the selected user and opens the edit dialog.
     *
     * @param {User} user - The user object selected for editing.
     */
    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setShowEditDialog(true)
    }

    /**
     * @function updateFilter
     * @description Generic function to update a single filter key. It also resets the page to 1
     * unless the key being updated is 'page' itself.
     *
     * @param {keyof UserFilters} key - The filter property to update.
     * @param {string | number} value - The new value for the filter property.
     */
    const updateFilter = (key: keyof UserFilters, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            // Reset page to 1 when any filter other than 'page' is changed
            page: key !== "page" ? 1 : (typeof value === "number" ? value : prev.page),
        }))
    }

    /**
     * @function clearFilters
     * @description Resets all filtering parameters to their initial default values.
     */
    const clearFilters = () => {
        setSearchTerm("")       // Clears the local search input state
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

    /**
     * @constant hasActiveFilters
     * @description Checks if any filter (search, role, tier, status) is currently active (not default).
     */
    const hasActiveFilters =
        filters.search || filters.role !== "all" || filters.tier !== "all" || filters.isActive !== "all"

    /**
     * @function handlePageChange
     * @description Updates the current page number for pagination.
     *
     * @param {number} page - The target page number.
     */
    const handlePageChange = (page: number) => {
        updateFilter("page", page)
    }

    /**
     * @function toggleOrder
     * @description Toggles the sorting order between 'asc' and 'desc'.
     */
    const toggleOrder = () => {
        updateFilter("order", filters.order === "desc" ? "asc" : "desc")
    }

    // --- Component Rendering ---
    return (
        <>
            <div className="space-y-4 mb-6">
                {/* Search Input with Debounce */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-white/10 bg-[#111111] text-white placeholder-white/40 w-full"
                    />
                </div>

                {/* Filtering Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                    {/* Role Filter */}
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

                    {/* Tier Filter */}
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

                    {/* Status (Active) Filter */}
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

                    {/* Limit (Items per page) Filter */}
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

                    {/* Clear Filters Button (only shown if filters are active) */}
                    {hasActiveFilters && (
                        <Button variant="default" onClick={clearFilters} className="border-white/10 text-white hover:bg-white/10 w-full">
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Status and Order Controls */}
                <div className="flex justify-between items-center text-sm text-white/60">
                    <span>
                        Showing {users.length} of {totalUsers} users
                        {hasActiveFilters && " (filtered)"}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Sort Order Toggle Button */}
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

            {/* Users Data Table */}
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
                            // Render a row for each user
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                    <TableCell className="text-white/80">
                                        {/* Link to user detail page */}
                                        <Link href={`/admin/users/${user.id}`} className="hover:opacity-80 transition">
                                            {user.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={user.email}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        {/* Role Badge */}
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
                                        {/* Tier Badge */}
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
                                        {/* Active Status Badge */}
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
                                        {/* Actions Dropdown Menu */}
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
                                                {/* Edit Action */}
                                                <DropdownMenuItem
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-white hover:bg-white/10 focus:bg-white/10"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                {/* Delete Action */}
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

            {/* Pagination Controls (only shown if there is more than 1 page) */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-white/60">
                        Page {currentPage} of {totalPages} ({totalUsers} total users)
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Previous Page Button */}
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

                        {/* Pagination Number Buttons (logic for displaying up to 5 buttons centered around the current page) */}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber
                                // Logic to determine which page numbers to display
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

                        {/* Next Page Button */}
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

            {/* Edit User Dialog */}
            {selectedUser && <EditUserDialog open={showEditDialog} onOpenChange={setShowEditDialog} user={selectedUser} />}

            {/* Delete User Dialog */}
            <DeleteUserDialog open={!!userIdToDelete} onOpenChange={() => setUserIdToDelete(null)} userId={userIdToDelete} />
        </>
    )
}