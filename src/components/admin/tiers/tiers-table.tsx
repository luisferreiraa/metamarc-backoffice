// src/components/admin/tiers/tiers-table.tsx
"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { Tier } from "@/lib/actions/tier-actions"

import { EditTierDialog } from "@/components/admin/tiers/edit-tier-dialog"
import { DeleteTierDialog } from "@/components/admin/tiers/delete-tier-dialog"

interface TiersTableProps {
    tiers: Tier[],
    onTierUpdated?: () => Promise<void>
}

export function TiersTable({ tiers, onTierUpdated }: TiersTableProps) {
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [tierIdToDelete, setTierIdToDelete] = useState<string | null>(null)

    const handleEditTier = (tier: Tier) => {
        setSelectedTier({
            ...tier,
            priceInCents: tier.prices[0]?.unit_amount || 0,
        })
        setShowEditDialog(true)
    }

    const formatPrice = (unitAmount: number) => {
        return `€${(unitAmount / 100).toFixed(2)}`
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

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
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-white/60 py-8">
                                    No tiers found. Create your first tier to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tiers.map((tier) => (
                                <TableRow key={tier.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                    <TableCell className="font-medium text-white">{tier.name}</TableCell>
                                    <TableCell className="text-white/80 max-w-xs truncate" title={tier.description}>
                                        {tier.description}
                                    </TableCell>
                                    <TableCell className="text-white/80">
                                        {tier.prices[0]?.unit_amount ? formatPrice(tier.prices[0].unit_amount) : "N/A"}
                                    </TableCell>
                                    <TableCell>
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
                                                <DropdownMenuItem
                                                    onClick={() => handleEditTier(tier)}
                                                    className="text-white hover:bg-white/10 focus:bg-white/10"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
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

            {/* Edit Dialog */}
            {selectedTier && <EditTierDialog open={showEditDialog} onOpenChange={setShowEditDialog} tier={selectedTier} />}

            {/* Delete Dialog */}
            <DeleteTierDialog open={!!tierIdToDelete} onOpenChange={() => setTierIdToDelete(null)} tierId={tierIdToDelete} />
        </>
    )
}