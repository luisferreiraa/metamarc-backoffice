// src/components/admin/tiers/create-tier-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * for creating a new subscription tier (e.g., FREE, PRO, PREMIUM) in the system.
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

// Imports the Server Action function and the state type definition.
import { createTier, type CreateTierState } from "@/lib/actions/tier-actions"

/**
 * @interface CreateTierDialogProps
 * @description Defines the props required for the CreateTierDialog component.
 */
interface CreateTierDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    onTierCreated: () => void       // Callback function to execute after a tier is successfully created.
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: CreateTierState = {}

/**
 * @function CreateTierDialog
 * @description A dialog component for creating new subscription tiers.
 *
 * @param {CreateTierDialogProps} props - The component properties.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function CreateTierDialog({ open, onOpenChange, onTierCreated }: CreateTierDialogProps) {

    // 1. Server Action Integration
    // useActionState hooks up the client form submission to the server-side 'createTier' function.
    const [state, formAction, isPending] = useActionState(createTier, initialState)

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Triggers the success callback and closes the dialog upon successful tier creation.
     */
    useEffect(() => {
        if (state.success) {
            onTierCreated()     // Execute callback to notify the parent component.
            onOpenChange(false)     // Close the dialog.
        }
    }, [state.success, onTierCreated, onOpenChange])        // Dependencies ensure effects run only when `state.success` changes to true.

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Create New Tier</DialogTitle>
                    <DialogDescription className="text-white/70">Fill in the data to create a new tier</DialogDescription>
                </DialogHeader>

                {/* The form element linked to the Server Action */}
                <form action={formAction} className="space-y-4">
                    {/* Display general error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Tier Name Input */}
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
                        />
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
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
                        <Label htmlFor="priceInCents" className="text-white">
                            Price (in cents)
                        </Label>
                        <Input
                            id="priceInCents"
                            name="priceInCents"
                            type="number"
                            min="0"
                            step="1"
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
                        <Label htmlFor="features" className="text-white">
                            Features
                        </Label>
                        <Textarea
                            id="features"
                            name="features"
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        {/* Submit Button (triggers formAction) */}
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {/* Loading spinner when action is pending */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


