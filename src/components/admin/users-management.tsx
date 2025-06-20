// src/components/admin/users-management.tsx

// Sugestões:
// - Adicionar colunas como lastLogin

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserCheck, UserX, Key, Download, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from 'react-toastify'

// Interface para representar os dados do utilizador
interface User {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
    createdAt: string
    lastLogin?: string
}

export function UsersManagement() {
    const [users, setUsers] = useState<User[]>([])      // Lista de utilizadores
    const [isLoading, setIsLoading] = useState(true)        // Estado de carregamento
    const [searchTerm, setSearchTerm] = useState("")        // Texto de pesquisa
    const [selectedUser, setSelectedUser] = useState<User | null>(null)     // Utilizador selecionado para edição
    const [showCreateDialog, setShowCreateDialog] = useState(false)     // Controla o modal de criação
    const [showEditDialog, setShowEditDialog] = useState(false)     // Controla o modal de edição
    const [page, setPage] = useState(1)     // Página atual da lista
    const [limit] = useState(20)        // Número de utilizadores por página
    const [totalPages, setTotalPages] = useState(1)     // Total de páginas (calculado pela API)
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

    // Carrega utilizadores sempre que a página muda
    useEffect(() => {
        fetchUsers()
    }, [page])

    // Requisição à API para obter utilizadores
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/users?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUsers(data.data || [])
                setTotalPages(data.meta?.pages || 1)
            }
        } catch (error) {
            console.error("Error loading users:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Ativa ou inativa um utilizador
    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/users/${userId}/activate`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            })

            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error("Error updating user status:", error)
        }
    }

    // Restaura a password de um utilizador
    const handleResetPassword = async (userId: string) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/users/${userId}/reset-password`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                alert("Password successfully reset!")
            }
        } catch (error) {
            console.error("Error resetting password:", error)
        }
    }

    // Exporta a lista de utilizadores num formato escolhido
    const handleExportUsers = async (format: string) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/users/export?format=${format}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `users.${format}`
                a.click()
            }
        } catch (error) {
            console.error("Error exporting users:", error)
        }
    }

    // Filtra utilizadores com base no termo de pesquisa
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Se estiver a carregar, mostra spinner
    if (isLoading) {
        return (
            <LoadingSpinner message="Loading users..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                {/* Título e Ações */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                            Users Management
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                                >
                                    <Download className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleExportUsers("csv")}>Export CSV</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportUsers("json")}>Export JSON</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportUsers("xlsx")}>Export Excel</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button className="bg-[#66b497] text-black hover:bg-[#5aa88b]" onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New User
                        </Button>
                    </div>
                </div>

                {/* Tabela */}
                <Card className="bg-[#1a1a1a] border border-white/10 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white [font-family:var(--font-poppins)]">List of Users</CardTitle>
                        <CardDescription className="text-white/70">Manage all system users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Pesquisa */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="h-4 w-4 text-white/60" />
                            <Input
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm bg-black border border-white/10 text-white placeholder-white/50"
                            />
                        </div>

                        {/* Tabela */}
                        <Table>
                            <TableHeader>
                                <TableRow className="bborder-b border-white/10">
                                    <TableHead className="text-white/80">Name</TableHead>
                                    <TableHead className="text-white/80">Email</TableHead>
                                    <TableHead className="text-white/80">Role</TableHead>
                                    <TableHead className="text-white/80">Tier</TableHead>
                                    <TableHead className="text-white/80">Status</TableHead>
                                    <TableHead className="text-white/80">Created at</TableHead>
                                    <TableHead className="text-right text-white/80">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                        <TableCell className="font-medium text-white">{user.name}</TableCell>
                                        <TableCell className="text-white/80">{user.email}</TableCell>
                                        <TableCell>
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
                                        <TableCell>
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
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditDialog(true);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.isActive)}>
                                                        {user.isActive ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                                        <Key className="mr-2 h-4 w-4" />
                                                        Reset Password
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setUserIdToDelete(user.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Paginação */}
                        <div className="flex items-center justify-center mt-6 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className="border border-white/10 text-white hover:border-[#66b497]"
                            >
                                Previous
                            </Button>

                            <span className="text-white/70 text-sm">Page {page} of {totalPages}</span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                className="border border-white/10 text-white hover:border-[#66b497]"
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Dialogs */}
                <CreateUserDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onUserCreated={fetchUsers}
                />
                {selectedUser && (
                    <EditUserDialog
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                        user={selectedUser}
                        onUserUpdated={fetchUsers}
                    />
                )}
            </div>

            {/* Modal de confirmação de remoção */}
            <Dialog open={!!userIdToDelete} onOpenChange={() => setUserIdToDelete(null)}>
                <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="[font-family:var(--font-poppins)] text-white">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <p className="[font-family:var(--font-poppins)]">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white"
                            onClick={() => setUserIdToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-[#66b497]"
                            onClick={async () => {
                                if (!userIdToDelete) return
                                try {
                                    const token = localStorage.getItem("token")
                                    const response = await fetch(`http://89.28.236.11:3000/api/admin/users/${userIdToDelete}`, {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    })

                                    if (response.ok) {
                                        await fetchUsers()
                                        toast.success("User deleted successfully.")
                                    }
                                } catch (error) {
                                    console.error("Error deleting user:", error)
                                    toast.error("Error deleting user.")
                                } finally {
                                    setUserIdToDelete(null)
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    )



}