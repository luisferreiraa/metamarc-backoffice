// src/components/adming/tiers/tier-management.tsx

/**
 * @fileoverview This component provides the main interface for managing subscription tiers
 * in the Admin dashboard. It handles displaying tier statistics, rendering the tiers table,
 * and managing the creation of new tiers.
 */

"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"      // Icons for navigation and action.

// Imports UI and layout components.
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoadingSpinner } from "@/components/layout/loading-spinner"

import type { Tier } from "@/lib/actions/tier-actions"      // Imports the Tier data structure type.
// Imports related tier components.
import { CreateTierDialog } from "../tiers/create-tier-dialog"
import { TiersTable } from "../tiers/tiers-table"

/**
 * @interface TiersManagementProps
 * @description Defines the props passed to the component, usually initial tier data fetched server-side.
 */
interface TiersManagementProps {
    initialTiers: Tier[]        // The initial array of subscription tiers to display.
}

/**
 * @function TiersManagement
 * @description Manages the state and logic for the Admin Tiers view.
 *
 * @param {TiersManagementProps} props - Initial tiers data.
 * @returns {JSX.Element} The rendered tier management interface.
 */
export function TiersManagement({ initialTiers }: TiersManagementProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [tiers, setTiers] = useState<Tier[]>(initialTiers)
    const [isRefreshing, setIsRefreshing] = useState(false)

    /**
     * @async
     * @function refreshTiers
     * @description Re-fetches the list of tiers after a change (create/update/delete).
     *
     * @note In this implementation, refreshing is done by forcing a full page reload (`window.location.reload()`),
     * which re-runs the Next.js server component fetching logic and updates the client state.
     */
    const refreshTiers = async () => {
        setIsRefreshing(true)
        try {
            // Forces a hard reload of the page to get fresh server-side data.
            window.location.reload()
        } catch (error) {
            console.error("Error refreshing tiers:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    /**
     * @hook useEffect
     * @description Synchronizes the client state (`tiers`) with the initial data prop
     * when the component mounts or if `initialTiers` changes externally.
     */
    useEffect(() => {
        setTiers(initialTiers)
    }, [initialTiers])

    /**
     * @function handleTierCreated
     * @description Callback function executed after a new tier is successfully created.
     * Closes the dialog and triggers a data refresh.
     */
    const handleTierCreated = () => {
        setShowCreateDialog(false)

        refreshTiers()
    }

    // Component Rendering
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 font-[family-name:var(--font-poppins)]">
                {/* Header, Title, and Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            {/* Back Button */}
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
                        {/* Button to open Create New Tier dialog */}
                        <Button
                            className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-colors"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Tier
                        </Button>
                    </div>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Tiers Card */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{tiers.length}</div>
                        <div className="text-white/60 text-sm">Total Tiers</div>
                    </div>
                    {/* Active Tiers Card (Count based on the `active` property) */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#66b497]">{tiers.filter((tier) => tier.active).length}</div>
                        <div className="text-white/60 text-sm">Active Tiers</div>
                    </div>
                    {/* Inactive Tiers Card */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-400">{tiers.filter((tier) => !tier.active).length}</div>
                        <div className="text-white/60 text-sm">Inactive Tiers</div>
                    </div>
                </div>

                {/* Tiers List or Empty State */}
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

                    // Tiers Table Display
                    <Suspense fallback={<LoadingSpinner message="Loading tiers..." />}>
                        {/* Passes the current tiers list and the refresh callback for updates/deletes */}
                        <TiersTable tiers={tiers} onTierUpdated={refreshTiers} />
                    </Suspense>
                )}

                {/* Create Tier Dialog */}
                <CreateTierDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onTierCreated={handleTierCreated}
                />
            </div>
        </DashboardLayout>
    )
}