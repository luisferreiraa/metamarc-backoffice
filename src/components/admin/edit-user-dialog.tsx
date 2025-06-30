// src/components/admin/edit-user-dialog.tsx

// Sugestões:
// - Adicionar validações mais complexas (ex: email válido) antes do submit

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { toast } from "react-toastify"
import { UpdateUser } from "@/interfaces/user"

// Props do component, incluindo o user a editar e callbacks para abrir/fechar e atualização
interface EditUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UpdateUser
    onUserUpdated: () => void
}

export function EditUserDialog({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {
    const [isLoading, setIsLoading] = useState(false)       // Estado para controlar se o form está a enviar dados
    const [error, setError] = useState("")      // Estado para guardar mensagens de erro
    const [formData, setFormData] = useState({      // Estado local para armazenar os dados do form antes de enviar
        name: "",
        email: "",
        role: "",
        tier: "",
    })

    // Sempre que o prop "user" muda, atualiza os dados do form para os valores do user
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                tier: user.tier,
            })
        }
    }, [user])

    // Função chamada quando o form é submetido
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await fetchWithAuth(`http://89.28.236.11:3000/api/admin/users/${user.id}`, {
                method: "PUT",
                body: formData,
            })

            onUserUpdated()
            onOpenChange(false)

            toast.success("User updated successfully!")
        } catch (err: any) {
            setError(err.message || "Error updating user")
            toast.error("Failed to update user. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Função genérica para atualizar o estado do form com o campo alterado
    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Edit User</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">Update user data.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Se houver erro, mostra um alerta vermelho com a mensagem */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Campo para editar o Nome */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                                required
                            />
                        </div>

                        {/* Campo para editar o Email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right text-white">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                                required
                            />
                        </div>

                        {/* Campo para editar o Role (função) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right text-white">
                                Role
                            </Label>
                            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                                <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Campo para editar o Tier (plano) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tier" className="text-right text-white">
                                Tier
                            </Label>
                            <Select value={formData.tier} onValueChange={(value) => handleChange("tier", value)}>
                                <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FREE">Free</SelectItem>
                                    <SelectItem value="PRO">Pro</SelectItem>
                                    <SelectItem value="PREMIUM">Premium</SelectItem>
                                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Botões no rodapé do diálogo */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant={"ghost"} disabled={isLoading} className="text-white hover:bg-white/10 transition-all">
                            {/* Spinner de loading enquanto aguarda resposta */}
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}