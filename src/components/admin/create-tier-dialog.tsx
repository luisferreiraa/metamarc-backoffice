"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { DialogFooter, DialogHeader } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

interface CreateTierDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onTierCreated: () => void
}

export function CreateTierDialog({ open, onOpenChange, onTierCreated }: CreateTierDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priceInCents: 0,
        features: "",  // <-- Campo extra para features separadas por ;
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await fetchWithAuth("http://89.28.236.11:3000/api/admin/tiers/", {
                method: "POST",
                body: {
                    name: formData.name,
                    description: formData.description,
                    priceInCents: formData.priceInCents,
                    features: formData.features,  // <-- Envia as features como string separada por ;
                }
            })

            onTierCreated()
            onOpenChange(false)

            setFormData({
                name: "",
                description: "",
                priceInCents: 0,
                features: ""
            })

        } catch (err: any) {
            setError(err.message || "Error creating tier")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "priceInCents" ? parseInt(value) || 0 : value
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-[#66b497]">Create New Tier</DialogTitle>
                    <DialogDescription className="text-sm text-white/70">Fill in the data to create a new tier</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Nome */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white"
                                required
                            />
                        </div>

                        {/* Descrição */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-white">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white"
                                required
                            />
                        </div>

                        {/* Preço em cêntimos */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priceInCents" className="text-white">Price (in cents)</Label>
                            <Input
                                id="priceInCents"
                                type="number"
                                value={formData.priceInCents}
                                onChange={(e) => handleChange("priceInCents", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white"
                                required
                            />
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="features" className="text-white">Features</Label>
                            <Input
                                id="features"
                                placeholder="Feature1; Feature2; Feature3"
                                value={formData.features}
                                onChange={(e) => handleChange("features", e.target.value)}
                                className="col-span-3 border border-white/10 bg-[#111111] text-white placeholder-white/30"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant={"ghost"} disabled={isLoading} className="text-white hover:bg-white/10">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}