// src/components/admin/tiers-management.tsx
"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/layout/loading-spinner"

import type { Tier } from "@/lib/actions/tier-actions"
import { CreateTierDialog } from "./create-tier-dialog"
import { TiersTable } from "./tiers-table"

interface TiersManagementProps {
    initialTiers: Tier[]
}

export function TiersManagement({ initialTiers }: TiersManagementProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [tiers, setTiers] = useState<Tier[]>(initialTiers)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Função para atualizar a lista de tiers
    const refreshTiers = async () => {
        setIsRefreshing(true)
        try {
            // Recarrega a página para buscar dados frescos do servidor
            window.location.reload()
        } catch (error) {
            console.error("Error refreshing tiers:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Atualiza o estado local quando initialTiers muda
    useEffect(() => {
        setTiers(initialTiers)
    }, [initialTiers])

    const handleTierCreated = () => {
        setShowCreateDialog(false)
        // Recarrega a página para mostrar o novo tier
        refreshTiers()
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300 bg-transparent"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Tiers Management</h1>
                            <p className="text-white/60 mt-1">Manage your subscription tiers and pricing</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshTiers}
                            disabled={isRefreshing}
                            className="border border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button
                            className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-colors"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Tier
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{tiers.length}</div>
                        <div className="text-white/60 text-sm">Total Tiers</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#66b497]">{tiers.filter((tier) => tier.active).length}</div>
                        <div className="text-white/60 text-sm">Active Tiers</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">{tiers.filter((tier) => !tier.active).length}</div>
                        <div className="text-white/60 text-sm">Inactive Tiers</div>
                    </div>
                </div>

                {/* Empty State */}
                {tiers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md mx-auto">
                            <h3 className="text-xl font-semibold text-white mb-2">No tiers found</h3>
                            <p className="text-white/60 mb-4">Get started by creating your first subscription tier.</p>
                            <Button className="bg-[#66b497] text-black hover:bg-[#5aa88b]" onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Tier
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Table */
                    <Suspense fallback={<LoadingSpinner message="Loading tiers..." />}>
                        <TiersTable tiers={tiers} onTierUpdated={refreshTiers} />
                    </Suspense>
                )}

                {/* Create Dialog */}
                <CreateTierDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onTierCreated={handleTierCreated}
                />
            </div>
        </DashboardLayout>
    )
}