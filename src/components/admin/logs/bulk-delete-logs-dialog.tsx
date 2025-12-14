// src/components/admin/logs/bulk-delete-logs-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * to confirm and execute the bulk deletion of selected activity log entries.
 * It leverages Next.js Server Actions ('useActionState') for form submission and state management.
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
import { bulkDeleteLogsByIds, type ActionState } from "@/lib/actions/log-actions"

/**
 * @interface BulkDeleteLogsDialogProps
 * @description Defines the props required for the BulkDeleteLogsDialog component.
 */
interface BulkDeleteLogsDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    selectedIds?: string[]      // Optional array of log IDs to be deleted.
    onLogsDeleted?: () => Promise<void>     // Optional callback function to run after successful deletion (to refresh the log list).
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: ActionState = {}

/**
 * @function BulkDeleteLogsDialog
 * @description A dialog component for confirming and executing the bulk deletion of logs.
 * 
 * @param {BulkDeleteLogsDialogProps} props - The component properties.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function BulkDeleteLogsDialog({
    open,
    onOpenChange,
    selectedIds = [],
    onLogsDeleted,
}: BulkDeleteLogsDialogProps) {

    // 1. Server Action Integration
    // useActionState hooks up the client component to the server-side function 'bulkDeleteLogsByIds'.
    const [state, formAction, isPending] = useActionState(bulkDeleteLogsByIds, initialState)

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Closes the dialog and triggers the refresh callback upon successful deletion.
     */
    useEffect(() => {
        if (state.success) {
            onLogsDeleted?.()       // Executes callback to notify the parent component.
            onOpenChange(false)     // Close the dialog.
        }
    }, [state.success, onLogsDeleted, onOpenChange])        // Dependencies ensure effects run only when needed.

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border border-white/10">

                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Bulk Delete Logs</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Delete multiple selected log entries. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {/* The form element linked to the Server Action */}
                <form action={formAction}>
                    <input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />

                    {/* Display error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Confirmation and List of Selected IDs */}
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4 mb-4">
                        <p className="text-white/80 text-sm">
                            You are about to delete <span className="font-semibold text-[#66b497]">{selectedIds.length}</span>{" "}
                            selected log entries.
                        </p>
                        {selectedIds.length > 0 && (
                            <div className="mt-2 max-h-32 overflow-y-auto">
                                <p className="text-xs text-white/60 mb-1">Selected IDs:</p>
                                {/* Display up to 5 IDs for confirmation, plus a count if more exist. */}
                                <div className="text-xs text-white/50 font-mono">
                                    {selectedIds.slice(0, 5).map((id, index) => (
                                        <div key={id}>
                                            {index + 1}. {id}
                                        </div>
                                    ))}
                                    {selectedIds.length > 5 && <div>... and {selectedIds.length - 5} more</div>}
                                </div>
                            </div>
                        )}
                    </div>

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
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || selectedIds.length === 0}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {/* Loading spinner when action is pending */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Selected ({selectedIds.length})
                        </Button>
                    </DialogFooter>
                </form>

                {/* Display success message after submission */}
                {state.success && (
                    <Alert className="border-green-500/20 bg-green-500/10 mt-4">
                        <AlertDescription className="text-green-400">
                            Successfully deleted {state.deletedCount || 0} log entries.
                        </AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    )
}