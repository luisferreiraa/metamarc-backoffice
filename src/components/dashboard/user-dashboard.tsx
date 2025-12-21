// src/components/dashboard/user-dashboard.tsx

/**
 * @fileoverview This component renders the main user dashboard, displaying personal account
 * information, API key, and current API usage statistics. It also provides links for 
 * managing the subscription and opening the profile edit dialog.
 */

"use client"

import { useEffect, useState } from "react"
// Imports icons for visual representation of data/actions.
import { Key, User, RefreshCw, CircleFadingArrowUp, Podcast, Pencil, SquareChartGantt } from "lucide-react"
import { EditOwnProfileDialog } from "@/components/dashboard/edit-own-profile-dialog"
import Link from "next/link"        // For client-side navigation.
import { LoadingSpinner } from "../layout/loading-spinner"      // Loading indicator.
import { UserDashboardData } from "@/interfaces/user"       // Type definition for the combined user and stats data.
import { fetchWithAuth } from "@/lib/fetchWithAuth"     // Utility for making authenticated API requests.
import { Badge } from "@/components/ui/badge"       // UI component for badges (status/tier).
import { Button } from "@/components/ui/button"     // UI component for buttons.
import { API_BASE_URL } from "@/utils/urls"     // Base URL constant for API endpoints.

/**
 * @function UserDashboard
 * @description Feftches and displays the current user's profile and API usage metrics.
 * 
 * @returns {JSX.Element} The rendered user dashboard. 
 */
export function UserDashboard() {
    // State to store the combined user profile and API usage data.
    const [user, setUser] = useState<UserDashboardData | null>(null)
    // State to track initial loading status.
    const [isLoading, setIsLoading] = useState(true)
    // State to control the visibility of the profile edit dialog.
    const [showEditDialog, setShowEditDialog] = useState(false)

    /**
     * @hook useEffect
     * @description Fetches initial user data (profile, API key) and usage statistics from two different endpoints.
     */
    useEffect(() => {
        const fetchUserData = async () => {
            // Check for user data existence in local storage (basic presence check, not security).
            const userData = localStorage.getItem("user")
            if (!userData) {
                setIsLoading(false)
                return
            }

            try {
                // Fetch user core data (including API key).
                const userResponse = await fetchWithAuth(`${API_BASE_URL}/api/auth/get-api-key`, {
                    method: "GET",
                })

                // Fetch user usage statistics
                const statsResponse = await fetchWithAuth(`${API_BASE_URL}/api/auth/user-stats`, {
                    method: "GET",
                })

                // Combine results into the single user state object.
                setUser({
                    id: userResponse.id,
                    name: userResponse.name,
                    email: userResponse.email,
                    role: userResponse.role,
                    tier: userResponse.tier,
                    isActive: userResponse.isActive,
                    apiKey: userResponse.apiKey,
                    apiKeyExpiresAt: userResponse.apiKeyExpiresAt,
                    createdAt: userResponse.createdAt,
                    requestsUsed: statsResponse.requestsUsed,
                    requestsRemaining: statsResponse.requestsRemaining,
                    resetInSeconds: statsResponse.resetInSeconds,
                })
            } catch (error) {
                console.error("Error fetching user data or stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [])      // Empty dependency array means this runs only once after the initial render.

    // Calculate usage metrics based on fetched data.
    const requestsUsed = user?.requestsUsed ?? 0;
    const requestsRemaining = user?.requestsRemaining ?? 0;
    const requestsLimit = requestsUsed + requestsRemaining;     // Total requests available in the cycle.

    // Calculate the percentage of the limit that has been used.
    const usedPercentage = requestsLimit > 0 ? (requestsUsed / requestsLimit) * 100 : 0;

    // Determine the color class for the usage badge based on the percentage used.
    let badgeClass = "bg-green-500/10 text-green-400 border border-green-400/30";

    if (usedPercentage >= 80) {
        badgeClass = "bg-red-500/10 text-red-400 border border-red-400/30";
    } else if (usedPercentage >= 50) {
        badgeClass = "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30";
    }

    /**
     * @async
     * @function handleRenewApiKey
     * @description Sends a request to the backend to generate a new API key for the user.
     * Updates the local state with the new key upon success.
     */
    const handleRenewApiKey = async () => {
        try {
            const data = await fetchWithAuth(`${API_BASE_URL}/api/apiKey/renew-api-key`, {
                method: "POST"
            })
            if (data?.apiKey) {
                // Update the state with the new API key, preserving other user data.
                setUser((prev) => (prev ? { ...prev, apiKey: data.apiKey } : null))
            }
        } catch (error) {
            console.error("Error renewing API Key:", error)
        }
    }

    // Display centered loading spinner during the initial fetch.
    if (isLoading) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        )
    }

    // Display message if user data could not be loaded.
    if (!user) {
        return <div className="text-center text-white">User not found</div>
    }

    // --- Component Rendering ---
    return (
        <>
            <div className="container mx-auto px-4 py-20 space-y-10 [font-family:var(--font-poppins)]">

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">Your Profile</h1>
                </div>

                {/* Main Information Grid */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* 1. Account Information Card */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                                <User className="h-5 w-5 text-[#66b497]" />
                                Account Information
                            </h2>
                            {/* Edit Profile Button */}
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setShowEditDialog(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/70">Name</p>
                                <p className="text-lg text-white">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Email</p>
                                <p className="text-lg text-white">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-6 flex-wrap">
                                <div>
                                    <p className="text-sm text-white/70">Tier</p>
                                    <Badge className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50">
                                        {user.tier}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-white/70">Status</p>
                                    <Badge className={user.isActive
                                        ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                        : "bg-red-500/10 text-red-500 border border-red-500/40"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. API Key Card */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                        <div>
                            <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                                <Key className="h-5 w-5 text-[#66b497]" />
                                API Key
                            </h2>
                            <p className="text-white/70 mt-1 text-sm">Use this key to access the API</p>
                        </div>

                        {/* Display API Key (with monospace font and break-all for long strings) */}
                        <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white break-all">
                            {user.apiKey}
                        </div>

                        {/* Display API Key Expiration Date/Time */}
                        <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white/80 break-all">
                            {user.apiKeyExpiresAt ? new Date(user.apiKeyExpiresAt).toLocaleString() : "N/A"}
                        </div>

                        {/* Renew API Key Button */}
                        <Button onClick={handleRenewApiKey} variant="outline" className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all">
                            <RefreshCw className="mr-2 h-4 w-4 text-[#66b497]" />
                            Renovate API Key
                        </Button>
                    </div>
                </div>

                {/* API Usage Statistics Card */}
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                            <SquareChartGantt className="h-5 w-5 text-[#66b497]" />
                            API Usage
                        </h2>
                    </div>

                    {/* Usage Percentage Badge (dynamically styled based on usage) */}
                    <Badge className={`absolute top-4 right-4 ${badgeClass}`}>
                        {usedPercentage.toFixed(1)}% used
                    </Badge>

                    <div className="space-y-4">
                        <div className="text-sm text-white mt-1 space-y-1">
                            <p>Requests Used: <strong>{requestsUsed}</strong></p>
                            <p>Requests Remaining: <strong>{requestsRemaining}</strong></p>
                            <p>
                                Reset on:{" "}
                                {/* Calculate reset time by adding `resetInSeconds` to the current time */}
                                {user.resetInSeconds !== null
                                    ? <strong>{new Date(Date.now() + user.resetInSeconds * 1000).toLocaleString()}</strong>
                                    : <span className="text-white/50">∞</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subscription Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Link href="/subscription" className="w-full">
                        <Button variant="main" className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all">
                            <Podcast className="mr-2 h-4 w-4 text-white" />
                            My Subscription Plan
                        </Button>
                    </Link>
                    <Link href="/subscription/plans" className="w-full">
                        <Button variant="main" className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all">
                            <CircleFadingArrowUp className="mr-2 h-4 w-4 text-white" />
                            Upgrade My Plan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Edit Profile Dialog (Conditionally rendered) */}
            {showEditDialog && user && (
                <EditOwnProfileDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    user={{ id: user.id, name: user.name, email: user.email }}
                    onUserUpdated={() => window.location.reload()}
                />
            )}
        </>
    )
}
