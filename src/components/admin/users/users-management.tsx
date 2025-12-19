// src/components/admin/users/users-management.tsx

/**
 * @fileoverview This component defines the main interface for managing user accounts
 * in the Admin dashboard. It handles displaying the users table, pagination, filtering,
 * and managing the creation of new users. It supports client-side fetching for filtering/pagination
 * and a full refresh for CRUD operations.
 */

"use client"

import { Suspense, useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"      // Icons for actions and navigation.
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog"
import Link from "next/link"
import { LoadingSpinner } from "../../layout/loading-spinner"
// Imports the UsersTable component and its associated filter type.
import { UsersTable, type UserFilters } from "./users-table"
// Imports the user data type and the client-side fetch function (which wraps a Server Action/API).
import { getUsersWithSearch, User } from "@/lib/actions/user-actions"

/**
 * @interface UsersManagementProps
 * @description Defines the props passed to the component, usually initial user data and metadata fetched server-side.
 */
interface UsersManagementProps {
    initialUsers: User[]        // The initial array of user data to display.
    initialMeta?: {     // Optional metadata for pagination.
        total: number
        page: number
        limit: number
        pages: number
    }
}

/**
 * @function UsersManagement
 * @description Manages the state and logic for the Admin Users view, including data fetching,
 * pagination, and dialog visibility.
 *
 * @param {UsersManagementProps} props - Initial users data and metadata.
 * @returns {JSX.Element} The rendered user management interface.
 */
export function UsersManagement({ initialUsers, initialMeta }: UsersManagementProps) {

    // State to control the visibility of the "Create New User" dialog.
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    // State to hold the current list of users displayed in the table.
    const [users, setUsers] = useState<User[]>(initialUsers)

    // State indicators for data fetching processes.
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // States for pagination metadata.
    const [totalUsers, setTotalUsers] = useState(initialMeta?.total || 0)
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1)
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1)

    // State to track the currently active filters and pagination settings.
    const [currentFilters, setCurrentFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        search: "",
        role: "all",
        tier: "all",
        isActive: "all",
        order: "desc",
    })

    /**
     * @async
     * @function fetchUsers
     * @description Fetches user data based on the provided filters (for pagination/searching/filtering).
     * This function is memoized using `useCallback`.
     *
     * @param {UserFilters} filters - The pagination, search, and filtering parameters.
     */
    const fetchUsers = useCallback(async (filters: UserFilters) => {
        setIsLoading(true)
        try {

            // Constructs parameters, setting 'undefined' for 'all' selections
            // to simplify the API/Server Action query logic.
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                role: filters.role !== "all" ? filters.role : undefined,
                tier: filters.tier !== "all" ? filters.tier : undefined,
                isActive: filters.isActive !== "all" ? filters.isActive : undefined,
                order: filters.order,
            }

            // Calls the function that executes the server-side data fetching logic.
            const response = await getUsersWithSearch(params)

            // Update client state with the new data and metadata.
            setUsers(response.data)
            setTotalUsers(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])      // Empty dependency array means this function is created once.

    /**
     * @function handleFiltersChange
     * @description Handler called by the UsersTable when filters or pagination change.
     * Updates the current filters state and initiates a new data fetch.
     * This function is memoized using `useCallback`.
     *
     * @param {UserFilters} filters - The new set of filters.
     */
    const handleFiltersChange = useCallback(
        (filters: UserFilters) => {
            setCurrentFilters(filters)
            fetchUsers(filters)
        },
        [fetchUsers],       // Depends on `fetchUsers`
    )

    /**
     * @async
     * @function refreshUsers
     * @description Forces a full reload of the page to re-fetch all server-side props.
     * Used primarily after successful creation or update/delete of a user,
     * ensuring the entire component tree and initial data are fresh.
     */
    const refreshUsers = async () => {
        setIsRefreshing(true)
        try {

            // Forces a hard reload of the page.
            window.location.reload()
        } catch (error) {
            console.error("Error refreshing users:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    /**
     * @hook useEffect
     * @description Ensures the component state is synchronized with the initial server-side props
     * upon mounting or if `initialUsers`/`initialMeta` change.
     */
    useEffect(() => {
        setUsers(initialUsers)
        if (initialMeta) {
            setTotalUsers(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, [initialUsers, initialMeta])

    /**
     * @function handleUserCreated
     * @description Callback executed after a new user is successfully created.
     * Closes the dialog and initiates a full page refresh.
     */
    const handleUserCreated = () => {
        setShowCreateDialog(false)
        refreshUsers()
    }

    /**
     * @async
     * @function handleUserUpdated
     * @description Callback executed after a user is successfully updated or deleted.
     * Initiates a full page refresh.
     */
    const handleUserUpdated = async () => {
        await refreshUsers()
    }

    // --- Component Rendering ---
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">

                {/* Header, Title, and Actions */}
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
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Users Management</h1>
                            <p className="text-white/60 mt-1">Manage Users Information</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Button to open Create New User dialog */}
                        <Button
                            className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-colors"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New User
                        </Button>
                    </div>
                </div>

                {/* Users List or Empty State */}
                {users.length === 0 ? (
                    // Empty State UI
                    <div className="text-center py-12">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md mx-auto">
                            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                            <p className="text-white/60 mb-4">Get started by creating a first user.</p>
                            <Button className="bg-[#66b497] text-black hover:bg-[#5aa88b]" onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First User
                            </Button>
                        </div>
                    </div>
                ) : (

                    // Users Table Display
                    <Suspense fallback={<LoadingSpinner message="Loading users..." />}>
                        <UsersTable users={users}
                            totalUsers={totalUsers}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onFiltersChange={handleFiltersChange}
                            onUserUpdated={handleUserUpdated} />
                    </Suspense>
                )}

                {/* Create User Dialog */}
                <CreateUserDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onUserCreated={handleUserCreated}
                />
            </div>
        </DashboardLayout>
    )
}