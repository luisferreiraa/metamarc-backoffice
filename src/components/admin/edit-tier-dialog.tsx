"use client"

import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

interface EditTierData {
    id: string
    name: string
    description: string
    priceInCents: number
}

interface EditTierDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tier: EditTierData
    onTierUpdated: () => void
}

export function EditTierDialog({ open, onOpenChange, tier, onTierUpdated }: EditTierDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priceInCents: 0,
    })

    // Atualiza o formData sempre que o tier mudar
    useEffect(() => {
        if (tier) {
            setFormData({
                name: tier.name || "",
                description: tier.description || "",
                priceInCents: tier.priceInCents || 0,
            })
        }
    }, [tier])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "priceInCents" ? parseInt(value) || 0 : value
        }))
    }

    const handleUpdateTier = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/tiers/${tier.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newName: formData.name,
                    newDescription: formData.description,
                }),
            })

            if (response.ok) {
                onTierUpdated()
                onOpenChange(false)
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Error updating tier")
            }
        } catch (err) {
            setError("Connection error. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdatePrice = async () => {
        if (isNaN(formData.priceInCents) || formData.priceInCents <= 0) {
            setError("Price must be a valid number greater than 0.")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://89.28.236.11:3000/api/admin/tiers/${tier.id}/price`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceInCents: formData.priceInCents,
                }),
            })

            if (response.ok) {
                onTierUpdated()
                onOpenChange(false)
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Error updating price")
            }
        } catch (err) {
            setError("Connection error. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!tier) return null // Garante que só renderiza com dados prontos

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Edit Tier</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">Update the information below</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateTier}>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-white">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priceInCents" className="text-right text-white">Price (in cents)</Label>
                            <Input
                                id="priceInCents"
                                type="number"
                                value={formData.priceInCents}
                                onChange={(e) => handleChange("priceInCents", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Button type="submit" variant="ghost" disabled={isLoading} className="text-white hover:bg-white/10 transition-all">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        </div>
                        <Button type="button" variant="secondary" onClick={handleUpdatePrice} disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}