// src/components/admin/user/edit-user-dialog.tsx
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

import { User, updateUser, type ActionState } from "@/lib/actions/user-actions"

import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipagem das props que o componente espera receber
interface EditUserDialogProps {
    open: boolean       // Define se o diálogo está aberto ou fechado
    onOpenChange: (open: boolean) => void       // Função para alterar o estado de aberto ou fechado
    user: User
    onUserUpdated?: () => void      // Função opcional a executar após atualizar
}

// Estado inicial para a gestão do feedback da ação (erros, sucesso, etc)
const initialState: ActionState = {}

export function EditUserDialog({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {

    // useActionState gere o estado da atualização e fornece a função que será associada ao form
    const [state, formAction, isPending] = useActionState(updateUser, initialState)

    // Estado local do formulário para armazenar os dados editáveis
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
    })

    // Sempre que o utilizador passado por prop muda, atualizamos o formData
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            tier: user.tier,
        })
    }, [user])

    // Quando a atualização for bem sucedida
    useEffect(() => {
        if (state.success) {
            onUserUpdated?.()       // Executa callback caso exista (para refresh da lista, por exemplo)
            onOpenChange(false)     // Fecha o Dialog
        }
    }, [state.success, onUserUpdated, onOpenChange])

    // Função genérica para alterar campos do formulário
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,        // Mantém os outros campos inalterados
            [field]: value,     // Atualiza o campo modificado
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                {/* Cabeçalho do diálogo */}
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit User</DialogTitle>
                    <DialogDescription className="text-white/70">Update the user information below</DialogDescription>
                </DialogHeader>

                {/* Formulário para submissão dos dados */}
                <form action={formAction} className="space-y-4">

                    {/* Campos escondidos com dados importantes */}
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="role" value={formData.role} />
                    <input type="hidden" name="tier" value={formData.tier} />

                    {/* Mostra erro geral caso exista */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Campo do Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-white">Name</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {/* Mostra erro específico do campo Nome */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Campo do Email */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-email" className="text-white">Email</Label>
                        <Input
                            id="edit-email"
                            name="email"
                            type="text"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {/* Mostra erro específico do campo Email */}
                        {state.fieldErrors?.email && <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>}
                    </div>

                    {/* Dropdown Role (função do utilizador) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-white">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} disabled={isPending}>
                            <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLIENT">Client</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dropdown Tier (plano do utilizador) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-white">Tier</Label>
                        <Select value={formData.tier} onValueChange={(value) => handleChange("tier", value)} disabled={isPending}>
                            <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="PRO">Pro</SelectItem>
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Área dos botões */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {/* Ícone animado enquanto o pedido está a ser processado */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}