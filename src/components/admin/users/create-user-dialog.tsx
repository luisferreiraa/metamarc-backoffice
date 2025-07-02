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

interface CreateUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUserCreated: () => void
}

const initialState: CreateUserState = {}

export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
    const [state, formAction, isPending] = useActionState(createUser, initialState)

    // Estado local para os selects (necessário para componentes controlados)
    const [selectedRole, setSelectedRole] = useState("CLIENT")
    const [selectedTier, setSelectedTier] = useState("FREE")

    // Reset ao abrir o dialog
    useEffect(() => {
        if (open) {
            setSelectedRole("CLIENT")
            setSelectedTier("FREE")
        }
    }, [open])

    // Lidar com criação bem sucedida
    useEffect(() => {
        if (state.success) {
            onUserCreated()
            onOpenChange(false)
            // Reset form
            setSelectedRole("CLIENT")
            setSelectedTier("FREE")
        }
    }, [state.success, onUserCreated, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 font-[family-name:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Create New User</DialogTitle>
                    <DialogDescription className="text-white/70">Fill in the data to create a new user</DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Name Field */}
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
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Email Field */}
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

                    {/* Role Field */}
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
                        {/* Hidden input para enviar o valor do select */}
                        <input type="hidden" name="role" value={selectedRole} />
                        {state.fieldErrors?.role && <p className="text-sm text-red-500">{state.fieldErrors.role[0]}</p>}
                    </div>

                    {/* Tier Field */}
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
                        {/* Hidden input para enviar o valor do select */}
                        <input type="hidden" name="tier" value={selectedTier} />
                        {state.fieldErrors?.tier && <p className="text-sm text-red-500">{state.fieldErrors.tier[0]}</p>}
                    </div>

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
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}