// src/components/admin/users/create-tier-dialog.tsx
"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { createUser, type CreateUserState } from "@/lib/actions/user-actions"

// Props esperadas no componente
interface CreateUserDialogProps {
    open: boolean       // Estado de visibilidade do dialog
    onOpenChange: (open: boolean) => void       // Função para abrir e fechar o dialog
    onUserCreated: () => void       // Função callback após criação bem sucedida
}

// Estado inicial do formulário (sem error nem sucesso)
const initialState: CreateUserState = {}

export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
    // useActionState gere o envio do form e o estado associado (erros, sucesso)
    const [state, formAction, isPending] = useActionState(createUser, initialState)

    // Estados locais para controlar os Selects do Role e do Tier
    const [selectedRole, setSelectedRole] = useState("CLIENT")
    const [selectedTier, setSelectedTier] = useState("FREE")

    // Sempre que o Dialog abre, faz reset ao Role e Tier
    useEffect(() => {
        if (open) {
            setSelectedRole("CLIENT")
            setSelectedTier("FREE")
        }
    }, [open])

    // Quando a criação do user for bem-sucedida
    useEffect(() => {
        if (state.success) {
            onUserCreated()     // Atualiza tabela ou dados no componente pai
            onOpenChange(false)     // Fecha o Dialog
            setSelectedRole("CLIENT")       // Faz reset aos campos
            setSelectedTier("FREE")
        }
    }, [state.success, onUserCreated, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 font-[family-name:var(--font-poppins)]">

                {/* Cabeçalho do Dialog */}
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Create New User</DialogTitle>
                    <DialogDescription className="text-white/70">Fill in the data to create a new user</DialogDescription>
                </DialogHeader>

                {/* Formulário */}
                <form action={formAction} className="space-y-4">

                    {/* Exibir mensagem de erro geral se existir */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Campo de Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                            placeholder="Enter user's full name"
                        />
                        {/* Exibe erro de validação se existir */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Campo de Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                            placeholder="Enter user's email address"
                        />
                        {state.fieldErrors?.email && <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>}
                    </div>

                    {/* Select do Role (Admin ou Client) */}
                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-white">
                            Role
                        </Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isPending}>
                            <SelectTrigger className="border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10">
                                <SelectItem value="CLIENT" className="text-white hover:bg-white/10">
                                    Client
                                </SelectItem>
                                <SelectItem value="ADMIN" className="text-white hover:bg-white/10">
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Campo escondido obrigatório para enviar o valor do Select no form */}
                        <input type="hidden" name="role" value={selectedRole} />
                        {state.fieldErrors?.role && <p className="text-sm text-red-500">{state.fieldErrors.role[0]}</p>}
                    </div>

                    {/* Select do Tier (plano do utilizador) */}
                    <div className="space-y-2">
                        <Label htmlFor="tier" className="text-white">
                            Tier
                        </Label>
                        <Select value={selectedTier} onValueChange={setSelectedTier} disabled={isPending}>
                            <SelectTrigger className="border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select user tier" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10">
                                <SelectItem value="FREE" className="text-white hover:bg-white/10">
                                    Free
                                </SelectItem>
                                <SelectItem value="PRO" className="text-white hover:bg-white/10">
                                    Pro
                                </SelectItem>
                                <SelectItem value="PREMIUM" className="text-white hover:bg-white/10">
                                    Premium
                                </SelectItem>
                                <SelectItem value="ENTERPRISE" className="text-white hover:bg-white/10">
                                    Enterprise
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Campo escondido para garantir que o valor do Tier vai no FormData */}
                        <input type="hidden" name="tier" value={selectedTier} />
                        {state.fieldErrors?.tier && <p className="text-sm text-red-500">{state.fieldErrors.tier[0]}</p>}
                    </div>

                    {/* Botões de ação */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {/* Mostra ícone de loading enquanto envia */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}