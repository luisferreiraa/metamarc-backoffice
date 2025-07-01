// src/components/admin/create-user-dialog.tsx

// Sugestões:
// - Considerar mover os valores fixos de role e tier para arrys constantes - ajuda a manter e a escalar
// - Poderia extrair o formData para um custom hook no futuro (ex: useCreateUserForm) para reutilização

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Loader2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

// Props que o component recebe do component pai
interface CreateUserDialogProps {
    open: boolean       // Se o dialog está visível
    onOpenChange: (open: boolean) => void       // Função para alterar o estado do dialog
    onUserCreated: () => void       // Função para chamar depois de criar um novo user
}

// Component de criação de utilizador
export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
    const [isLoading, setIsLoading] = useState(false)       // Estado para mostrar spinner enquanto faz request
    const [error, setError] = useState("")      // Mensagem de erro, se houver
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "CLIENT",
        tier: "FREE",
    })

    // Função chamada ao submeter o formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await fetchWithAuth("http://89.28.236.11:3000/api/admin/users", {
                method: "POST",
                body: formData,
            })

            onUserCreated()
            onOpenChange(false)

            setFormData({
                name: "",
                email: "",
                role: "CLIENT",
                tier: "FREE",
            })

        } catch (err: any) {
            setError(err.message || "Error creating user")
        } finally {
            setIsLoading(false)
        }
    }

    // Função genérica para atualizar os campos do formulário
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
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Create New User</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">Fill in the data to create a new user.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Campo: Nome */}
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

                        {/* Campo: Email */}
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

                        {/* Campo: Role (função do utilizador) */}
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

                        {/* Campo: Tier (plano do utilizador) */}
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

                    {/* Botões de ação no rodapé do diálogo */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant={"ghost"} disabled={isLoading} className="text-white hover:bg-white/10 transition-all">
                            {/* Ícone de loading enquanto envia */}
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}