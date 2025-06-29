// src/components/admin/tiers-management.tsx
"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "../layout/dashboard-layout"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowLeft, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { LoadingSpinner } from "../layout/loading-spinner"
import { CreateTierDialog } from "./create-tier-dialog"
import { EditTierDialog } from "./edit-tier-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "react-toastify"

interface Tier {
    id: string
    active: boolean
    created: number
    description: string
    name: string
    prices: {
        id: string
        active: boolean
        currency: string
        unit_amount: number
    }[]
}

export function TiersManagement() {
    const [tiers, setTiers] = useState<Tier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [tierIdToDelete, setTierIdToDelete] = useState<string | null>(null)

    const fetchTiers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://89.28.236.11:3000/api/admin/tiers/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                // A API retorna um array de objetos com product e prices
                const formattedTiers = data.map((item: any) => ({
                    id: item.product.id,
                    active: item.product.active,
                    created: item.product.created,
                    description: item.product.description,
                    name: item.product.name,
                    prices: item.prices
                }))
                setTiers(formattedTiers)
            }
        } catch (error) {
            console.error("Error loading tiers:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTiers()
    }, [])

    if (isLoading) {
        return (
            <LoadingSpinner message="Loading tiers..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                {/* Título e Ações */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                            Tiers Management
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="bg-[#66b497] text-black hover:bg-[#5aa88b]" onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Tier
                        </Button>
                    </div>
                </div>
                {/* Tabela */}
                <Table>
                    <TableHeader>
                        <TableRow className="bborder-b border-white/10">
                            <TableHead className="text-white/80">Name</TableHead>
                            <TableHead className="text-white/80">Description</TableHead>
                            <TableHead className="text-white/80">Price(€)</TableHead>
                            <TableHead className="text-white/80">Status</TableHead>
                            <TableHead className="text-white/80">Created at</TableHead>
                            <TableHead className="text-white/80 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tiers.map((tier) => (
                            <TableRow key={tier.id} className="hover:bg-white/5 transition-colors border-b border-white/10">
                                <TableCell className="font-medium text-white">{tier.name}</TableCell>
                                <TableCell className="text-white/80">{tier.description}</TableCell>
                                <TableCell className="text-white/80">
                                    {tier.prices[0]?.unit_amount ? (tier.prices[0].unit_amount / 100).toFixed(2) + '€' : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={tier.active ? "default" : "destructive"}
                                        className={tier.active
                                            ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                            : "bg-red-600/10 text-red-600 border border-red-600/40"}
                                    >
                                        {tier.active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/80">
                                    {new Date(tier.created * 1000).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedTier(tier);
                                                    setShowEditDialog(true);
                                                }}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setTierIdToDelete(tier.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Dialogs */}
                <CreateTierDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onTierCreated={fetchTiers}
                />
                {selectedTier && (
                    <EditTierDialog
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                        tier={selectedTier}
                        onTierUpdated={fetchTiers}
                    />
                )}
            </div>

            {/* Modal de confirmação de remoção */}
            <Dialog open={!!tierIdToDelete} onOpenChange={() => setTierIdToDelete(null)}>
                <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="[font-family:var(--font-poppins)] text-white">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <p className="[font-family:var(--font-poppins)]">
                        Are you sure you want to delete this tier? This action cannot be undone.
                    </p>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white"
                            onClick={() => setTierIdToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-[#66b497]"
                            onClick={async () => {
                                if (!tierIdToDelete) return
                                try {
                                    const token = localStorage.getItem("token")
                                    const response = await fetch(`http://89.28.236.11:3000/api/admin/tiers/${tierIdToDelete}`, {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    })

                                    if (response.ok) {
                                        await fetchTiers()
                                        toast.success("Tier deleted successfully.")
                                    }
                                } catch (error) {
                                    console.error("Error deleting tier:", error)
                                    toast.error("Error deleting tier.")
                                } finally {
                                    setTierIdToDelete(null)
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}