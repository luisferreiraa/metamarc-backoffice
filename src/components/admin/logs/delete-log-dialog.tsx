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

import { deleteLog, type ActionState } from "@/lib/actions/log-actions"

interface DeleteLogDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    logId: string | null
    onLogDeleted?: () => Promise<void>
}

const initialState: ActionState = {}

export function DeleteLogDialog({ open, onOpenChange, logId, onLogDeleted }: DeleteLogDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteLog, initialState)

    // Handle successful deletion
    useEffect(() => {
        if (state.success) {
            onLogDeleted?.()
            onOpenChange(false)
        }
    }, [state.success, onLogDeleted, onOpenChange])

    if (!logId) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this log entry? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction}>
                    <input type="hidden" name="logId" value={logId} />

                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Log
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}