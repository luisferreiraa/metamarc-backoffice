"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2, Calendar, Filter } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { bulkDeleteLogsByIds, bulkDeleteLogsByFilter, type ActionState } from "@/lib/actions/log-actions"

interface BulkDeleteLogsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedIds?: string[]
    onLogsDeleted?: () => Promise<void>
    /* selectedLogs: string[] */
}

const initialState: ActionState = {}

export function BulkDeleteLogsDialog({
    open,
    onOpenChange,
    selectedIds = [],
    onLogsDeleted,
}: BulkDeleteLogsDialogProps) {
    const [stateIds, formActionIds, isPendingIds] = useActionState(bulkDeleteLogsByIds, initialState)
    const [stateFilter, formActionFilter, isPendingFilter] = useActionState(bulkDeleteLogsByFilter, initialState)
    const [activeTab, setActiveTab] = useState("ids")

    // Handle successful deletion
    useEffect(() => {
        if (stateIds.success || stateFilter.success) {
            onLogsDeleted?.()
            onOpenChange(false)
        }
    }, [stateIds.success, stateFilter.success, onLogsDeleted, onOpenChange])

    // Reset tab when dialog opens
    useEffect(() => {
        if (open) {
            setActiveTab(selectedIds.length > 0 ? "ids" : "filter")
        }
    }, [open, selectedIds.length])

    const isPending = isPendingIds || isPendingFilter
    const currentState = activeTab === "ids" ? stateIds : stateFilter

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Bulk Delete Logs</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Choose how you want to delete multiple log entries. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#0f0f0f]">
                        <TabsTrigger
                            value="ids"
                            disabled={selectedIds.length === 0}
                            className="data-[state=active]:bg-[#66b497] data-[state=active]:text-black"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Selected ({selectedIds.length})
                        </TabsTrigger>
                        <TabsTrigger value="filter" className="data-[state=active]:bg-[#66b497] data-[state=active]:text-black">
                            <Calendar className="h-4 w-4 mr-2" />
                            By Filter
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ids" className="space-y-4">
                        <form action={formActionIds}>
                            <input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />

                            {stateIds.error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{stateIds.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4">
                                <p className="text-white/80 text-sm">
                                    You are about to delete <span className="font-semibold text-[#66b497]">{selectedIds.length}</span>{" "}
                                    selected log entries.
                                </p>
                            </div>

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
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={isPending || selectedIds.length === 0}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isPendingIds && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete Selected
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="filter" className="space-y-4">
                        <form action={formActionFilter} className="space-y-4">
                            {stateFilter.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{stateFilter.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beforeDate" className="text-white">
                                        Delete logs before date
                                    </Label>
                                    <Input
                                        id="beforeDate"
                                        name="beforeDate"
                                        type="datetime-local"
                                        className="border-white/10 bg-[#111111] text-white"
                                        disabled={isPending}
                                    />
                                    <p className="text-xs text-white/50">Optional: Only delete logs created before this date</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="action" className="text-white">
                                        Action contains
                                    </Label>
                                    <Input
                                        id="action"
                                        name="action"
                                        type="text"
                                        placeholder="e.g., LOGIN, DELETE, UPDATE"
                                        className="border-white/10 bg-[#111111] text-white"
                                        disabled={isPending}
                                    />
                                    <p className="text-xs text-white/50">Optional: Filter by action type</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="userId" className="text-white">
                                        User ID
                                    </Label>
                                    <Input
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        placeholder="Specific user ID"
                                        className="border-white/10 bg-[#111111] text-white"
                                        disabled={isPending}
                                    />
                                    <p className="text-xs text-white/50">Optional: Filter by specific user</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ip" className="text-white">
                                        IP Address contains
                                    </Label>
                                    <Input
                                        id="ip"
                                        name="ip"
                                        type="text"
                                        placeholder="e.g., 192.168, 10.0"
                                        className="border-white/10 bg-[#111111] text-white"
                                        disabled={isPending}
                                    />
                                    <p className="text-xs text-white/50">Optional: Filter by IP address pattern</p>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <p className="text-yellow-400 text-sm font-medium">⚠️ Warning</p>
                                <p className="text-yellow-400/80 text-sm mt-1">
                                    This will permanently delete all logs matching the specified filters. Use with caution.
                                </p>
                            </div>

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
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={isPending}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isPendingFilter && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete by Filter
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>

                {/* Success message */}
                {(stateIds.success || stateFilter.success) && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                        <AlertDescription className="text-green-400">
                            Successfully deleted {stateIds.deletedCount || stateFilter.deletedCount || 0} log entries.
                        </AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    )
}