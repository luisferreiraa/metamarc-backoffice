// src/components/admin/user/create-user-dialog.tsx

/**
 * @fileoverview This component defines a modal dialog used in the Admin interface
 * for creating a new user account. It integrates with a Next.js Server Action
 * for form submission and handles validation and success states.
 */

"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"      // Icon for loading state.

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Imports the Server Action function and the state type definition.
import { createUser, type CreateUserState } from "@/lib/actions/user-actions"

/**
 * @interface CreateUserDialogProps
 * @description Defines the properties passed to the CreateUserDialog component.
 */
interface CreateUserDialogProps {
    open: boolean       // Controls the visibility of the dialog.
    onOpenChange: (open: boolean) => void       // Handler to close or open the dialog.
    onUserCreated: () => void       // Callback function to execute after a user is successfully created.
}

/**
 * @constant initialState
 * @description The initial state for the Server Action response.
 */
const initialState: CreateUserState = {}

/**
 * @function CreateUserDialog
 * @description A dialog component for creating new user accounts.
 *
 * @param {CreateUserDialogProps} props - The component properties.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {

    // 1. Server Action Integration
    // useActionState hooks up the client form submission to the server-side `createUser` function.
    const [state, formAction, isPending] = useActionState(createUser, initialState)

    // 2. Local State for Select Inputs (Controlled Components)
    const [selectedRole, setSelectedRole] = useState("CLIENT")
    const [selectedTier, setSelectedTier] = useState("FREE")

    /**
     * @hook useEffect
     * @description Resets the role and tier selections to their default values 
     * whenever the dialog is opened (`open` changes to true).
     */
    useEffect(() => {
        if (open) {
            setSelectedRole("CLIENT")
            setSelectedTier("FREE")
        }
    }, [open])

    /**
     * @hook useEffect
     * @description Runs side effects when the Server Action state indicates success.
     * Executes the success callback, closes the dialog, and resets the local selection states.
     */
    useEffect(() => {
        if (state.success) {
            onUserCreated()     // Execute callback to notify the parent component/data source.
            onOpenChange(false)     // Close the dialog.
            // Reset local state to defaults, ensuring the dialog is clean for the next use.
            setSelectedRole("CLIENT")
            setSelectedTier("FREE")
        }
    }, [state.success, onUserCreated, onOpenChange])        // Dependencies ensure effects run only when state.success changes.

    return (
        // Dialog wrapper controls open/close state.
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 font-[family-name:var(--font-poppins)]">

                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Create New User</DialogTitle>
                    <DialogDescription className="text-white/70">Fill in the data to create a new user</DialogDescription>
                </DialogHeader>

                {/* The form element linked to the Server Action */}
                <form action={formAction} className="space-y-4">

                    {/* Display general error message from the Server Action state */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Name Input */}
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
                            placeholder="Enter user's full name"
                        />
                        {/* Display field-specific validation errors for 'name' */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                            placeholder="Enter user's email address"
                        />
                        {/* Display field-specific validation errors for 'email' */}
                        {state.fieldErrors?.email && <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>}
                    </div>

                    {/* Role Select Input */}
                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-white">
                            Role
                        </Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isPending}>
                            <SelectTrigger className="border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10">
                                <SelectItem value="CLIENT" className="text-white hover:bg-white/10">
                                    Client
                                </SelectItem>
                                <SelectItem value="ADMIN" className="text-white hover:bg-white/10">
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Hidden input sends the `selectedRole` state value as form data for the Server Action */}
                        <input type="hidden" name="role" value={selectedRole} />
                        {/* Hidden input sends the `selectedRole` state value as form data for the Server Action */}
                        {state.fieldErrors?.role && <p className="text-sm text-red-500">{state.fieldErrors.role[0]}</p>}
                    </div>

                    {/* Tier Select Input */}
                    <div className="space-y-2">
                        <Label htmlFor="tier" className="text-white">
                            Tier
                        </Label>
                        <Select value={selectedTier} onValueChange={setSelectedTier} disabled={isPending}>
                            <SelectTrigger className="border-white/10 bg-[#111111] text-white">
                                <SelectValue placeholder="Select user tier" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10">
                                {/* List of possible subscription tiers */}
                                <SelectItem value="FREE" className="text-white hover:bg-white/10">
                                    Free
                                </SelectItem>
                                <SelectItem value="PRO" className="text-white hover:bg-white/10">
                                    Pro
                                </SelectItem>
                                <SelectItem value="PREMIUM" className="text-white hover:bg-white/10">
                                    Premium
                                </SelectItem>
                                <SelectItem value="ENTERPRISE" className="text-white hover:bg-white/10">
                                    Enterprise
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Hidden input sends the `selectedTier` state value as form data for the Server Action */}
                        <input type="hidden" name="tier" value={selectedTier} />
                        {/* Display field-specific validation errors for 'tier' */}
                        {state.fieldErrors?.tier && <p className="text-sm text-red-500">{state.fieldErrors.tier[0]}</p>}
                    </div>

                    <DialogFooter>
                        {/* Cancel Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>
                        {/* Submit Button (triggers formAction) */}
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {/* Submit Button (triggers formAction) */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}