// src/components/admin/users-management.tsx
"use client"

import { Suspense, useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, RefreshCw } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog"
import Link from "next/link"
import { LoadingSpinner } from "../../layout/loading-spinner"
import { UsersTable, type UserFilters } from "./users-table"
import { getUsersWithSearch, User } from "@/lib/actions/user-actions"

interface UsersManagementProps {
    initialUsers: User[]
    initialMeta?: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export function UsersManagement({ initialUsers, initialMeta }: UsersManagementProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Pagination and filter states
    const [totalUsers, setTotalUsers] = useState(initialMeta?.total || 0)
    const [currentPage, setCurrentPage] = useState(initialMeta?.page || 1)
    const [totalPages, setTotalPages] = useState(initialMeta?.pages || 1)
    const [currentFilters, setCurrentFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        search: "",
        role: "all",
        tier: "all",
        isActive: "all",
        order: "desc",
    })

    // Função para buscar users com filtros
    const fetchUsers = useCallback(async (filters: UserFilters) => {
        setIsLoading(true)
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                role: filters.role !== "all" ? filters.role : undefined,
                tier: filters.tier !== "all" ? filters.tier : undefined,
                isActive: filters.isActive !== "all" ? filters.isActive : undefined,
                order: filters.order,
            }

            const response = await getUsersWithSearch(params)

            setUsers(response.data)
            setTotalUsers(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
        } catch (error) {
            console.error("Error fetching users:", error)
            // Optionally show toast error message
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Handle filter changes
    const handleFiltersChange = useCallback(
        (filters: UserFilters) => {
            setCurrentFilters(filters)
            fetchUsers(filters)
        },
        [fetchUsers],
    )

    // Função para atualizar a lista de users
    const refreshUsers = async () => {
        setIsRefreshing(true)
        try {
            // Recarrega a página para buscar dados frescos do servidor
            window.location.reload()
        } catch (error) {
            console.error("Error refreshing users:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Atualiza o estado local quando initialUsers muda
    useEffect(() => {
        setUsers(initialUsers)
        if (initialMeta) {
            setTotalUsers(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, [initialUsers, initialMeta])

    const handleUserCreated = () => {
        setShowCreateDialog(false)
        // Recarrega a página para mostrar o novo user
        refreshUsers()
    }

    const handleUserUpdated = async () => {
        await refreshUsers()
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
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Users Management</h1>
                            <p className="text-white/60 mt-1">Manage Users Information</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-colors"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New User
                        </Button>
                    </div>
                </div>

                {/* Empty State */}
                {users.length === 0 ? (
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
                    /* Table */
                    <Suspense fallback={<LoadingSpinner message="Loading users..." />}>
                        <UsersTable users={users}
                            totalUsers={totalUsers}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onFiltersChange={handleFiltersChange}
                            onUserUpdated={handleUserUpdated} />
                    </Suspense>
                )}

                {/* Create Dialog */}
                <CreateUserDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onUserCreated={handleUserCreated}
                />
            </div>
        </DashboardLayout>
    )







}