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

import { deleteUser, type ActionState } from "@/lib/actions/user-actions"

interface DeleteUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string | null
}

const initialState: ActionState = {}

export function DeleteUserDialog({ open, onOpenChange, userId }: DeleteUserDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteUser, initialState)

    // Lidar com eliminação bem sucedida
    useEffect(() => {
        if (state.success) {
            onOpenChange(false)
        }
    }, [state.success, onOpenChange])

    if (!userId) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this user? This action cannot be undone and may affect existing
                        subscriptions.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction}>
                    <input type="hidden" name="userId" value={userId} />

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
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}