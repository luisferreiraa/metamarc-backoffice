// src/components/admin/tiers/edit-tier-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * for editing the details of an existing subscription tier.
 * It uses the `useActionState` hook for form submission with Next.js Server Actions.
 */

"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"      // Icon for loading state.

// Imports UI components.
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

// Imports the Tier type, the update Server Action function, and the ActionState type.
import { Tier, updateTier, type ActionState } from "@/lib/actions/tier-actions"

import { toast } from "react-toastify"

/**
 * @interface EditTierDialogProps
 * @description Defines the props required for the EditTierDialog component.
 */
interface EditTierDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    tier: Tier      // The data object of the tier being edited.
    onTierUpdated?: () => void      // Optional callback function to execute after a tier is updated.
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: ActionState = {}

/**
 * @function EditTierDialog
 * @description A dialog component for editing existing subscription tiers.
 *
 * @param {EditTierDialogProps} props - The component properties.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function EditTierDialog({ open, onOpenChange, tier, onTierUpdated }: EditTierDialogProps) {
    // 1. Server Action Integration
    // useActionState hooks up the client form submission to the server-side `updateTier` function.
    const [state, formAction, isPending] = useActionState(updateTier, initialState)

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Triggers the success callback and closes the dialog upon successful tier update.
     */
    useEffect(() => {
        if (state.success) {
            onTierUpdated?.()       // Execute optional callback.
            onOpenChange(false)     // Close the dialog.
        }
    }, [state.success, onTierUpdated, onOpenChange])        // Dependencies ensure effects run only when `state.success` changes to true.

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit Tier</DialogTitle>
                    <DialogDescription className="text-white/70">Update the tier information below</DialogDescription>
                </DialogHeader>

                {/* The form element linked to the Server Action */}
                <form action={formAction} className="space-y-4">
                    {/* Hidden input field to pass the tier ID, which is essential for the update Server Action. */}
                    <input type="hidden" name="tierId" value={tier.id} />

                    {/* Display general error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Tier Name Input */}
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
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Description Textarea */}
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
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.description && (
                            <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    {/* Price Input */}
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
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.priceInCents && (
                            <p className="text-sm text-red-500">{state.fieldErrors.priceInCents[0]}</p>
                        )}
                    </div>

                    {/* Features Textarea */}
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
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.features && <p className="text-sm text-red-500">{state.fieldErrors.features[0]}</p>}
                    </div>

                    <DialogFooter>
                        {/* Cancel Button */}
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        {/* Submit Button (triggers formAction) */}
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {/* Loading spinner when action is pending */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}