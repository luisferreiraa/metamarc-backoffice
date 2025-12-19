// src/components/admin/tiers/tiers-table.tsx

/**
 * @fileoverview This component renders the table displaying subscription tiers in the Admin interface.
 * It provides functionality for viewing tier details, triggering edit operations,
 * and initiating tier deletion.
 */

"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"     // Icons for actions.

// Imports UI components (Shadcn UI or similar).
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { Tier } from "@/lib/actions/tier-actions"      // Imports the Tier data structure type.

// Imports dialog components for operations.
import { EditTierDialog } from "@/components/admin/tiers/edit-tier-dialog"
import { DeleteTierDialog } from "@/components/admin/tiers/delete-tier-dialog"

/**
 * @interface TiersTableProps
 * @description Defines the properties passed to the TiersTable component.
 */
interface TiersTableProps {
    tiers: Tier[],      // The list of tier data to be displayed.
    onTierUpdated?: () => Promise<void>     // Optional callback to refresh the parent list after operation (edit/delete).
}

/**
 * @function TiersTable
 * @description Component responsible for rendering the table structure and managing UI state
 * for tier actions (edit/delete dialogs).
 *
 * @param {TiersTableProps} props - The component properties.
 * @returns {JSX.Element} The rendered tiers table.
 */
export function TiersTable({ tiers, onTierUpdated }: TiersTableProps) {
    // State to hold the tier object currently selected for editing.
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
    // State to control the visibility of the Edit Tier dialog.
    const [showEditDialog, setShowEditDialog] = useState(false)
    // State to hold the ID of the tier currently targeted for deletion.
    const [tierIdToDelete, setTierIdToDelete] = useState<string | null>(null)

    /**
     * @function handleEditTier
     * @description Prepares the tier data for editing, ensuring the price is extracted
     * from the first price object in the array, and opens the edit dialog.
     *
     * @param {Tier} tier - The tier object selected for editing.
     */
    const handleEditTier = (tier: Tier) => {
        setSelectedTier({
            ...tier,
            // Extracts the price in cents (unit_amount) for pre-populating the edit form.
            priceInCents: tier.prices[0]?.unit_amount || 0,
        })
        setShowEditDialog(true)
    }

    /**
     * @function formatPrice
     * @description Converts a price amount from cents to a formatted currency string (e.g., €10.00).
     *
     * @param {number} unitAmount - The price in cents.
     * @returns {string} The formatted price string.
     */
    const formatPrice = (unitAmount: number) => {
        return `€${(unitAmount / 100).toFixed(2)}`
    }

    /**
     * @function formatDate
     * @description Formats a Unix timestamp (seconds) into a localized date string.
     *
     * @param {number} timestamp - The Unix timestamp.
     * @returns {string} The formatted date string.
     */
    const formatDate = (timestamp: number) => {
        // Convert timestamp (seconds) to milliseconds for Date object creation.
        return new Date(timestamp * 1000).toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Component Rendering
    return (
        <>
            <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/80 font-medium">Name</TableHead>
                            <TableHead className="text-white/80 font-medium">Description</TableHead>
                            <TableHead className="text-white/80 font-medium">Price</TableHead>
                            <TableHead className="text-white/80 font-medium">Status</TableHead>
                            <TableHead className="text-white/80 font-medium">Created</TableHead>
                            <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tiers.length === 0 ? (
                            // No Data Row
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/60 py-8">
                                    No tiers found. Create your first tier to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Tier Rows
                            tiers.map((tier) => (
                                <TableRow key={tier.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                    <TableCell className="font-medium text-white">{tier.name}</TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={tier.description}>
                                        {tier.description}
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        {/* Display formatted price or "N/A" if price data is missing */}
                                        {tier.prices[0]?.unit_amount ? formatPrice(tier.prices[0].unit_amount) : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {/* Status Badge */}
                                        <Badge
                                            variant={tier.active ? "default" : "destructive"}
                                            className={
                                                tier.active
                                                    ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50 hover:bg-[#66b497]/20"
                                                    : "bg-red-600/10 text-red-600 border border-red-600/40 hover:bg-red-600/20"
                                            }
                                        >
                                            {tier.active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/80">{formatDate(tier.created)}</TableCell>
                                    <TableCell className="text-right">
                                        {/* Actions Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-white hover:bg-white/10"
                                                    aria-label={`Actions for ${tier.name}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                                                {/* Edit Action */}
                                                <DropdownMenuItem
                                                    onClick={() => handleEditTier(tier)}
                                                    className="text-white hover:bg-white/10 focus:bg-white/10"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                {/* Delete Action */}
                                                <DropdownMenuItem
                                                    onClick={() => setTierIdToDelete(tier.id)}
                                                    className="text-red-400 hover:bg-red-600/10 focus:bg-red-600/10"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Tier Dialog */}
            {selectedTier && <EditTierDialog open={showEditDialog} onOpenChange={setShowEditDialog} tier={selectedTier} />}

            {/* Delete Tier Dialog */}
            <DeleteTierDialog open={!!tierIdToDelete} onOpenChange={() => setTierIdToDelete(null)} tierId={tierIdToDelete} />
        </>
    )
}