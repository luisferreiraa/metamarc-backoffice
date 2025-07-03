// src/components/admin/users-management.tsx
"use client"

import { Suspense, useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog"
import Link from "next/link"
import { LoadingSpinner } from "../../layout/loading-spinner"
import { UsersTable, type UserFilters } from "./users-table"
import { getUsersWithSearch, User } from "@/lib/actions/user-actions"

// Tipagem das props que o componente recebe
interface UsersManagementProps {
    initialUsers: User[]        // Lista inicial de utilizadores (vinda do servidor na renderização)
    initialMeta?: {     // Informação adicional de paginação e contagem
        total: number
        page: number
        limit: number
        pages: number
    }
}

export function UsersManagement({ initialUsers, initialMeta }: UsersManagementProps) {

    // Estado que controla se o modal para criar utilizador está aberto
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    // Estado com a lista de utilizadores atual
    const [users, setUsers] = useState<User[]>(initialUsers)
    // Estados para controlar loading durante o fetch dos dados
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Estados para controlar a paginação e os filtros
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

    // Função responsável por buscar os utilizadores no servidor, aplicando filtros
    const fetchUsers = useCallback(async (filters: UserFilters) => {
        setIsLoading(true)      // Ativa o loading visual
        try {
            // Prepara os parâmetros para o pedido, apenas envia os filtros que não são "all"
            const params = {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                role: filters.role !== "all" ? filters.role : undefined,
                tier: filters.tier !== "all" ? filters.tier : undefined,
                isActive: filters.isActive !== "all" ? filters.isActive : undefined,
                order: filters.order,
            }

            const response = await getUsersWithSearch(params)       // Faz o pedido ao servidor

            // Atualiza o estado com os dados recebidos
            setUsers(response.data)
            setTotalUsers(response.meta.total)
            setCurrentPage(response.meta.page)
            setTotalPages(response.meta.pages)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Função que lida com a alteração dos filtros (chamada pela tabela)
    const handleFiltersChange = useCallback(
        (filters: UserFilters) => {
            setCurrentFilters(filters)
            fetchUsers(filters)     // Faz o fetch com os novos filtros
        },
        [fetchUsers],       // Garantimos que esta função depende apenas do fetchUsers
    )

    // Função para atualizar os utilizadores, recarregando a página inteira
    const refreshUsers = async () => {
        setIsRefreshing(true)
        try {
            // Recarrega a página, forçando novo fetch no servidor
            window.location.reload()
        } catch (error) {
            console.error("Error refreshing users:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Sempre que os dados iniciais mudarem (por exemplo, renderização no servidor), atualizamos o estado local
    useEffect(() => {
        setUsers(initialUsers)
        if (initialMeta) {
            setTotalUsers(initialMeta.total)
            setCurrentPage(initialMeta.page)
            setTotalPages(initialMeta.pages)
        }
    }, [initialUsers, initialMeta])

    // Quando um novo utilizador for criado, fechamos o modal e atualizamos a lista
    const handleUserCreated = () => {
        setShowCreateDialog(false)
        refreshUsers()      // Recarrega para ver o novo utilizador na lista
    }

    // Quando um utilizador for editado, atualizamos a lista
    const handleUserUpdated = async () => {
        await refreshUsers()
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">

                {/* Cabeçalho da página */}
                <div className="flex items-center justify-between flex-wrap gap-4">

                    {/* Botão para voltar atrás e título */}
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

                        {/* Título e subtítulo */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Users Management</h1>
                            <p className="text-white/60 mt-1">Manage Users Information</p>
                        </div>
                    </div>

                    {/* Botão para abrir o modal de criação de utilizador */}
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

                {/* Caso não existam utilizadores, mostra estado vazio */}
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
                    /* Se houver utilizadores, mostra a tabela */
                    <Suspense fallback={<LoadingSpinner message="Loading users..." />}>
                        <UsersTable users={users}
                            totalUsers={totalUsers}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onFiltersChange={handleFiltersChange}
                            onUserUpdated={handleUserUpdated} />
                    </Suspense>
                )}

                {/* Modal para criar novo utilizador */}
                <CreateUserDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onUserCreated={handleUserCreated}
                />
            </div>
        </DashboardLayout>
    )







}