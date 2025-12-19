// src/components/admin/users/edit-user-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * for editing the details of an existing user account (name, email, role, and tier).
 * It uses the `useActionState` hook for form submission with Next.js Server Actions.
 */

"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

// Imports UI components (Shadcn UI or similar).
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

// Imports the User type, the update Server Action function, and the ActionState type.
import { User, updateUser, type ActionState } from "@/lib/actions/user-actions"

import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * @interface EditUserDialogProps
 * @description Defines the props required for the EditUserDialog component.
 */
interface EditUserDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    user: User      // The data object of the user being edited.
    onUserUpdated?: () => void      // Optional callback function to execute after a user is successfully updated (e.g., to refresh the list).
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: ActionState = {}

/**
 * @function EditUserDialog
 * @description A dialog component for editing existing user accounts.
 *
 * @param {EditUserDialogProps} props - The component properties.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function EditUserDialog({ open, onOpenChange, user, onUserUpdated }: EditUserDialogProps) {

    // 1. Server Action Integration
    // useActionState hooks up the client form submission to the server-side `updateUser` function.
    const [state, formAction, isPending] = useActionState(updateUser, initialState)

    // 2. Local State for Form Data
    // This state manages all editable fields and is initialized with the current user data.
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
    })

    /**
     * @hook useEffect
     * @description Re-initializes `formData` whenever the `user` prop changes.
     * This is crucial when the dialog is reused for different users (i.e., when a new user is selected).
     */
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            tier: user.tier,
        })
    }, [user])

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state changes.
     * Triggers the success callback and closes the dialog upon successful user update.
     */
    useEffect(() => {
        if (state.success) {
            onUserUpdated?.()
            onOpenChange(false)
        }
    }, [state.success, onUserUpdated, onOpenChange])

    /**
     * @function handleChange
     * @description Generic handler for updating local `formData` state from input and select changes.
     * This keeps the input fields controlled.
     *
     * @param {keyof typeof formData} field - The name of the form field being updated.
     * @param {string} value - The new value of the field.
     */
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Dialog wrapper controls open/close state.
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Edit User</DialogTitle>
                    <DialogDescription className="text-white/70">Update the user information below</DialogDescription>
                </DialogHeader>

                {/* The form element linked to the Server Action */}
                <form action={formAction} className="space-y-4">

                    {/* Hidden inputs to pass non-editable (or state-controlled) essential data */}
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="role" value={formData.role} />
                    <input type="hidden" name="tier" value={formData.tier} />

                    {/* Display general error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-white">Name</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-email" className="text-white">Email</Label>
                        <Input
                            id="edit-email"
                            name="email"
                            type="text"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {/* Display field-specific validation errors */}
                        {state.fieldErrors?.email && <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>}
                    </div>

                    {/* Role Select Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-white">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} disabled={isPending}>
                            {/* Select component manages the `role` part of the `formData` state */}
                            <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLIENT">Client</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tier Select Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-white">Tier</Label>
                        {/* Select component manages the `tier` part of the `formData` state */}
                        <Select value={formData.tier} onValueChange={(value) => handleChange("tier", value)} disabled={isPending}>
                            <SelectTrigger className="col-span-3 border border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FREE">Free</SelectItem>
                                <SelectItem value="PRO">Pro</SelectItem>
                                <SelectItem value="PREMIUM">Premium</SelectItem>
                                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        {/* Cancel Button */}
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        {/* Submit Button (triggers formAction) */}
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {/* Loading spinner when action is pending */}
                            Update User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}