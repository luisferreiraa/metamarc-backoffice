// src/components/admin/tiers/delete-tier-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * to confirm and execute the deletion of a single subscription tier.
 * It uses the `useActionState` hook for integration with Next.js Server Actions.
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

// Imports the Server Action function and the ActionState type definition.
import { deleteTier, type ActionState } from "@/lib/actions/tier-actions"

/**
 * @interface DeleteTierDialogProps
 * @description Defines the props required for the DeleteTierDialog component.
 */
interface DeleteTierDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    tierId: string | null       // The ID of the tier entry to be deleted. Null if none is selected.
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: ActionState = {}

/**
 * @function DeleteTierDialog
 * @description A dialog component for confirming and executing the deletion of a single tier.
 *
 * @param {DeleteTierDialogProps} props - The component properties.
 * @returns {JSX.Element | null} The rendered dialog component, or null if no tierId is provided.
 */
export function DeleteTierDialog({ open, onOpenChange, tierId }: DeleteTierDialogProps) {
    // 1. Server Action Integration
    // useActionState hooks up the client component to the server-side function `deleteTier`.
    const [state, formAction, isPending] = useActionState(deleteTier, initialState)

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Closes the dialog upon successful deletion.
     */
    useEffect(() => {
        if (state.success) {
            onOpenChange(false)     // Close the dialog upon successful deletion.
        }
    }, [state.success, onOpenChange])       // Dependencies ensure effects run only when needed.

    // If no tier ID is provided, render nothing.
    if (!tierId) return null

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this tier? This action cannot be undone and may affect existing
                        subscriptions.
                    </DialogDescription>
                </DialogHeader>

                {/* The form element linked to the Server Action */}
                <form action={formAction}>
                    <input type="hidden" name="tierId" value={tierId} />

                    {/* Display error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter className="gap-2">
                        {/* Cancel Button (closes the dialog) */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        {/* Submit Button (triggers the Server Action) */}
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {/* Loading spinner when action is pending */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
