// src/components/dashboard/edit-own-profile.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface EditOwnProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: {
        id: string
        name: string
        email: string
    }
    onUserUpdated: () => void
}

export function EditOwnProfileDialog({ open, onOpenChange, user, onUserUpdated }: EditOwnProfileDialogProps) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, password: "" })
        }
    }, [user])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await fetchWithAuth(`http://89.28.236.11:3000/api/users/me`, {
                method: "PUT",
                body: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password || undefined, // Só envia se existir password
                }
            })

            onUserUpdated()
            onOpenChange(false)

        } catch (err: any) {
            setError(err.message || "Error updating profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Edit Your Profile</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">
                        Update your account information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center gap-4">
                        <Label htmlFor="name" className="w-1/4 text-right text-white flex items-center">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-3/4 border border-white/10 bg-[#111111] text-white h-10"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Label htmlFor="email" className="w-1/4 text-right text-white flex items-center">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-3/4 border border-white/10 bg-[#111111] text-white h-10"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Label htmlFor="password" className="w-1/4 text-white flex items-center">
                            New Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            className="w-3/4 border border-white/10 bg-[#111111] text-white h-10"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" variant="ghost" disabled={isLoading} className="text-white hover:bg-white/10">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
