// src/components/admin/logs/delete-log-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * to confirm and execute the deletion of a single activity log entry.
 * It uses the 'useActionState' hook from Next.js for integrating a Server Action.
 */

"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"      // Icon for loading state.

// Imports UI components
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

// Imports the Server Action function and ActionState type definition.
import { deleteLog, type ActionState } from "@/lib/actions/log-actions"

/**
 * @interface DeleteLogDialogProps
 * @description Defines the props required for the DeleteLogDialog component.
 */
interface DeleteLogDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    logId: string | null        // The ID of the log entry to be deleted. Null if none is selected.
    onLogDeleted?: () => Promise<void>      // Optional callback function to run after success.
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: ActionState = {}

/**
 * @function DeleteLogDialog
 * @description A dialog component for confirming and executing the deletion of a single log entry.
 * 
 * @param {DeleteLogDialogProps} props - The component properties.
 * @returns {JSX.Element | null} The rendered dialog component, or null if no logId is provided.
 */
export function DeleteLogDialog({ open, onOpenChange, logId, onLogDeleted }: DeleteLogDialogProps) {

    // 1. Server Action Integration
    // useActionState hooks up the client component to the server-side function 'deleteLog'.
    const [state, formAction, isPending] = useActionState(deleteLog, initialState)

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Closes the dialog and triggers the refresh callback upon successful deletion.
     */
    useEffect(() => {
        if (state.success) {
            onLogDeleted?.()        // Execute callback to notify the parent component.
            onOpenChange(false)     // Close the dialog.
        }
    }, [state.success, onLogDeleted, onOpenChange])     // Dependencies ensure effects run only when needed.

    // If no log ID is provided, render nothing.
    if (!logId) return null

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this log entry? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {/* The form element linked to the Server Action */}
                <form action={formAction}>
                    {/* Hidden input field to pass the log ID to the Server Action. */}
                    <input type="hidden" name="logId" value={logId} />

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
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>

                        {/* Submit Button (triggers the Server Action) */}
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {/* Loading spinner when action is pending */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Log
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}