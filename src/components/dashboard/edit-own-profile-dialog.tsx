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
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, password: "", confirmPassword: "" })
            setPasswordError("")
        }
    }, [user])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        // Validação de confirmação de password
        if (field === "confirmPassword" || (field === "password" && formData.confirmPassword)) {
            if (field === "confirmPassword" && value !== formData.password) {
                setPasswordError("Passwords do not match")
            } else if (field === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
                setPasswordError("Passwords do not match")
            } else {
                setPasswordError("")
            }
        }
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
                    password: formData.password || undefined,
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
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border border-white/10 text-white [font-family:var(--font-poppins)]">

                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit Your Profile</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Update your account information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isLoading}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="border border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isLoading}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            className="border border-white/10 bg-[#111111] text-white"
                            disabled={isLoading}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    {formData.password && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                className="border border-white/10 bg-[#111111] text-white"
                                disabled={isLoading}
                                placeholder="Re-enter new password"
                            />
                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || (!!formData.password && !!passwordError)}
                            className="bg-white text-black hover:bg-white/90"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
