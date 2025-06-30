// src/components/admin/edit-tier-dialog.tsx
"use client"

import { Dialog, DialogDescription, DialogTitle, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "../ui/alert"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { EditTierData } from "@/interfaces/stripe-tier"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { toast } from "react-toastify"

// Props do component, incluindo o tier a editar e callbacks para abrir/fechar e atualização
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

    // Sempre que o prop "tier" muda, atualiza os dados do form para os valores do tier
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

    // Função chamada quando o form é submetido
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (isNaN(formData.priceInCents) || formData.priceInCents <= 0) {
            setError("Price must be a valid number greater than 0.")
            setIsLoading(false)
            return
        }

        try {
            // Atualiza nome e descrição
            await fetchWithAuth(`http://89.28.236.11:3000/api/admin/tiers/${tier.id}`, {
                method: "PUT",
                body: {
                    newName: formData.name,
                    newDescription: formData.description,
                },
            })

            // Atualiza preço
            await fetchWithAuth(`http://89.28.236.11:3000/api/admin/tiers/${tier.id}/replace-price`, {
                method: "POST",
                body: {
                    priceInCents: formData.priceInCents,
                },
            })

            toast.success("Tier updated successfully!")

            onTierUpdated()
            onOpenChange(false)
        } catch (err: any) {
            setError(err.message || "Unexpected error")
            toast.error("Failed to update tier. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!tier) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Edit Tier</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">Update the information below</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSaveChanges} className="grid gap-4 py-4">
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
                        <Label htmlFor="priceInCents" className="text-white">Price (in cents)</Label>
                        <Input
                            id="priceInCents"
                            type="number"
                            value={formData.priceInCents}
                            onChange={(e) => handleChange("priceInCents", e.target.value)}
                            className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                            required
                        />
                    </div>

                    {/* Botões no rodapé do diálogo */}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" variant="ghost" disabled={isLoading} className="text-white hover:bg-white/10 transition-all">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
