// src/components/admin/users-table.tsx
"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { User } from "@/lib/actions/user-actions"
import { EditUserDialog } from "../users/edit-user-dialog"
import { DeleteUserDialog } from "../users/delete-user-dialog"
import Link from "next/link"

interface UsersTableProps {
    users: User[],
    onUserUpdated?: () => Promise<void>
}

export function UsersTable({ users, onUserUpdated }: UsersTableProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setShowEditDialog(true)
    }

    return (
        <>
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

            {/* Edit Dialog */}
            {selectedUser && <EditUserDialog open={showEditDialog} onOpenChange={setShowEditDialog} user={selectedUser} />}

            {/* Delete Dialog */}
            <DeleteUserDialog open={!!userIdToDelete} onOpenChange={() => setUserIdToDelete(null)} userId={userIdToDelete} />
        </>
    )
}