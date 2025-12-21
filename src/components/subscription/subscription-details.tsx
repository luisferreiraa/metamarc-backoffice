// src/components/subscription/subscription-details.tsx

/**
 * @fileoverview This component displays the key details for the user's current subscription plan.
 * and provides options for changing or upgrading the plan.
 */

import { Button } from "@/components/ui/button"
// Imports icons for visual context.
import { ArrowLeft, Podcast, CircleFadingArrowUp } from "lucide-react"
import Link from "next/link"        // For declarative navigation (Back button).
import { useRouter } from "next/navigation"     // Hook for programmatic navigation (Change Plan button).
import { Badge } from "@/components/ui/badge"       // UI component for status/tier display.

/**
 * @interface Props 
 * @description Defines the expected properties for the SubscriptionDetails component.
 * 
 * @property {object | null} status - An object containing the current subscription status details, or null if loading/unavailable.
 * @property {string} status.tier - The name of the user's current subscription tier.
 * @property {boolean} status.isActive - Whether the subcription is currently active.
 * @property {Date | null} status.expiresAt - The date when the subscription is set to expire/renew (null for Free).
 * @property {Date | null} status.apiKeyExpiresAt - The expiration date of the user's API key.
 */
interface Props {
    status: {
        tier: string
        isActive: boolean
        expiresAt: Date | null
        apiKeyExpiresAt: Date | null
    } | null
}

/**
 * @function SubscriptionDetails
 * @description A functional component that displays the user's subscription status and renewal dates.
 * 
 * @param {Props} { status } - The subscription status object passed as a prop.
 * @returns {JSX.Element} The rendered subscription details interface.
 */
export default function SubscriptionDetails({ status }: Props) {
    // Hook to access the router instance for programmatic navigation.
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-20 space-y-10 [font-family:var(--font-poppins)]">

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        {/* Button to navigate back to the dashboard */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-white/10 text-white hover:border-[#66b497] transition-all"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        My Subscription Plan
                    </h1>
                </div>
            </div>

            {/* Subscription Details Card Container */}
            <div className="flex items-center justify-center">
                {/* Main Card-like structure */}
                <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">

                    {/* Card Title/Icon */}
                    <div className="space-y-2">
                        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
                            <Podcast className="h-5 w-5 text-[#66b497]" />
                            Subscription Details
                        </h2>
                        <p className="text-white/70 text-sm">
                            Information about your current plan
                        </p>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="space-y-4 text-white/90">
                        {/* Check if subscription status data is available */}
                        {status ? (
                            <>
                                {/* 1. Current Plan Tier */}
                                <div>
                                    <p className="text-sm text-white/70">Current Plan</p>
                                    <Badge className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50">
                                        {status.tier}
                                    </Badge>
                                </div>

                                {/* 2. Subscription Status */}
                                <div>
                                    <p className="text-sm text-white/70">Status</p>
                                    {/* Dynamically style the badge based on isActive status */}
                                    <Badge className={status.isActive
                                        ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                        : "bg-red-500/10 text-red-500 border border-red-500/40"}>
                                        {status.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                {/* 3. Renews At/Expires At (Hidden for FREE tier) */}
                                {status.tier !== "FREE" && (
                                    <div>
                                        <p className="text-sm text-white/70">Renews At</p>
                                        <p className="text-lg">
                                            {/* Formats the date string if available */}
                                            {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                )}

                                {/* 4. API Key Expiration */}
                                <div>
                                    <p className="text-sm text-white/70">API Key Expires At</p>
                                    <p className="text-lg">
                                        {/* Formats the API Key expiration date */}
                                        {status.apiKeyExpiresAt ? new Date(status.apiKeyExpiresAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                {/* Button to change/upgrade plan */}
                                <Button
                                    onClick={() => router.push("/subscription/plans")}
                                    className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all"
                                >
                                    <CircleFadingArrowUp className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Change Plan
                                </Button>
                            </>
                        ) : (
                            // Displayed if status is null (e.g., user is not subscribed or data failed to load)
                            <div className="text-center text-white/70 space-y-4">
                                <p>You don't have an active subscription</p>
                                {/* Button to view plans */}
                                <Button
                                    onClick={() => router.push("/subscription/plans")}
                                    className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all"
                                >
                                    <CircleFadingArrowUp className="mr-2 h-4 w-4 text-[#66b497]" />
                                    View Plans
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
