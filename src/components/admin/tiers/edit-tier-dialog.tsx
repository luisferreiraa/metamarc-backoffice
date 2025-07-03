// src/components/admin/tiers/edit-tier-dialog.tsx
"use client"

import { useActionState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"

import { Tier, updateTier, type ActionState } from "@/lib/actions/tier-actions"

import { toast } from "react-toastify"

interface EditTierDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tier: Tier
    onTierUpdated?: () => void
}

const initialState: ActionState = {}

export function EditTierDialog({ open, onOpenChange, tier, onTierUpdated }: EditTierDialogProps) {
    const [state, formAction, isPending] = useActionState(updateTier, initialState)

    // Lidar com atualização bem sucedida
    useEffect(() => {
        if (state.success) {
            onTierUpdated?.()
            onOpenChange(false)
        }
    }, [state.success, onTierUpdated, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit Tier</DialogTitle>
                    <DialogDescription className="text-white/70">Update the tier information below</DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {/* Hidden field para o ID do tier */}
                    <input type="hidden" name="tierId" value={tier.id} />

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
                            defaultValue={tier.name}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="edit-description"
                            name="description"
                            defaultValue={tier.description}
                            className="border-white/10 bg-[#111111] text-white resize-none"
                            rows={3}
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.description && (
                            <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-priceInCents" className="text-white">
                            Price (in cents)
                        </Label>
                        <Input
                            id="edit-priceInCents"
                            name="priceInCents"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={tier.priceInCents}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.priceInCents && (
                            <p className="text-sm text-red-500">{state.fieldErrors.priceInCents[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-features" className="text-white">
                            Features
                        </Label>
                        <Textarea
                            id="edit-features"
                            name="features"
                            defaultValue={tier.metadata.features || ""}
                            placeholder="Separate features with semicolons (;)"
                            className="border-white/10 bg-[#111111] text-white placeholder-white/30 resize-none"
                            rows={3}
                            disabled={isPending}
                        />
                        <p className="text-xs text-white/50">Optional: List features separated by semicolons</p>
                        {state.fieldErrors?.features && <p className="text-sm text-red-500">{state.fieldErrors.features[0]}</p>}
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
        </Dialog>
    )
}