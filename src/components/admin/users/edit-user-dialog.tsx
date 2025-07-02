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

interface EditUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User
    onUserUpdated?: () => void
}

const initialState: ActionState = {}

export function EditUserDialog({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {
    const [state, formAction, isPending] = useActionState(updateUser, initialState)

    // Estado local do formulário
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
    })

    // Atualiza formData sempre que abrir popup com outro user
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            tier: user.tier,
        })
    }, [user])

    // Lidar com atualização bem sucedida
    useEffect(() => {
        if (state.success) {
            onUserUpdated?.()
            onOpenChange(false)
        }
    }, [state.success, onUserUpdated, onOpenChange])

    // Função genérica para atualizar o estado do form com o campo alterado
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit User</DialogTitle>
                    <DialogDescription className="text-white/70">Update the user information below</DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {/* Hidden field para o ID do tier */}
                    <input type="hidden" name="tierId" value={user.id} />

                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-white">
                            Name
                        </Label>
                        <Input
                            id="edit-name"
                            name="name"
                            type="text"
                            defaultValue={user.name}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="edit-email"
                            name="email"
                            type="text"
                            defaultValue={user.email}
                            className="border-white/10 bg-[#111111] text-white resize-none"
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.description && (
                            <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right text-white">
                            Role
                        </Label>
                        <Select value={user.role} onValueChange={(value) => handleChange("role", value)}>
                            <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLIENT">Client</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="user" className="text-right text-white">
                            Tier
                        </Label>
                        <Select value={user.tier} onValueChange={(value) => handleChange("tier", value)}>
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

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}