// src/components/dashboard/user-dashboard.tsx
"use client"

import { useEffect, useState } from "react"
import { Key, User, RefreshCw, CircleFadingArrowUp, Podcast, Pencil, SquareChartGantt } from "lucide-react"
import { EditOwnProfileDialog } from "@/components/dashboard/edit-own-profile-dialog"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"
import { UserDashboardData } from "@/interfaces/user"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function UserDashboard() {
    const [user, setUser] = useState<UserDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showEditDialog, setShowEditDialog] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = localStorage.getItem("user")
            if (!userData) {
                setIsLoading(false)
                return
            }

            try {
                const apiData = await fetchWithAuth("http://89.28.236.11:3000/api/auth/get-api-key", {
                    method: "GET"
                })

                setUser({
                    id: apiData.id,
                    name: apiData.name,
                    email: apiData.email,
                    role: apiData.role,
                    tier: apiData.tier,
                    isActive: apiData.isActive,
                    apiKey: apiData.apiKey,
                    apiKeyExpiresAt: apiData.apiKeyExpiresAt,
                    createdAt: apiData.createdAt,
                    requestsUsed: apiData.requestsUsed,
                    requestsRemaining: apiData.requestsRemaining,
                    resetInSeconds: apiData.resetInSeconds
                })
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const requestsUsed = user?.requestsUsed ?? 0;
    const requestsRemaining = user?.requestsRemaining ?? 0;
    const requestsLimit = requestsUsed + requestsRemaining;

    const usedPercentage = requestsLimit > 0 ? (requestsUsed / requestsLimit) * 100 : 0;

    // Define a cor com base na percentagem
    let badgeClass = "bg-green-500/10 text-green-400 border border-green-400/30";

    if (usedPercentage >= 80) {
        badgeClass = "bg-red-500/10 text-red-400 border border-red-400/30";
    } else if (usedPercentage >= 50) {
        badgeClass = "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30";
    }

    const handleRenewApiKey = async () => {
        try {
            const data = await fetchWithAuth("http://89.28.236.11:3000/api/apiKey/renew-api-key", {
                method: "POST"
            })
            if (data?.apiKey) {
                setUser((prev) => (prev ? { ...prev, apiKey: data.apiKey } : null))
            }
        } catch (error) {
            console.error("Error renewing API Key:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        )
    }

    if (!user) {
        return <div className="text-center text-white">User not found</div>
    }

    return (
        <>
            <div className="container mx-auto px-4 py-20 space-y-10 [font-family:var(--font-poppins)]">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">Your Profile</h1>
                </div>

                {/* Grid dos Cards */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Card Informações da Conta */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                                <User className="h-5 w-5 text-[#66b497]" />
                                Account Information
                            </h2>
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

                    {/* Card API Key */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                        <div>
                            <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                                <Key className="h-5 w-5 text-[#66b497]" />
                                API Key
                            </h2>
                            <p className="text-white/70 mt-1 text-sm">Use this key to access the API</p>
                        </div>

                        <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white break-all">
                            {user.apiKey}
                        </div>

                        <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white/80 break-all">
                            {user.apiKeyExpiresAt ? new Date(user.apiKeyExpiresAt).toLocaleString() : "N/A"}
                        </div>

                        <Button onClick={handleRenewApiKey} variant="outline" className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all">
                            <RefreshCw className="mr-2 h-4 w-4 text-[#66b497]" />
                            Renovate API Key
                        </Button>
                    </div>
                </div>

                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl text-white flex items-center gap-2 font-semibold">
                            <SquareChartGantt className="h-5 w-5 text-[#66b497]" />
                            API Usage
                        </h2>
                    </div>

                    {/* Badge no canto superior direito */}
                    <Badge className={`absolute top-4 right-4 ${badgeClass}`}>
                        {usedPercentage.toFixed(1)}% used
                    </Badge>

                    <div className="space-y-4">
                        <div className="text-sm text-white mt-1 space-y-1">
                            <p>Requests Used: <strong>{requestsUsed}</strong></p>
                            <p>Requests Remaining: <strong>{requestsRemaining}</strong></p>
                            <p>
                                Reset on:{" "}
                                {user.resetInSeconds !== null
                                    ? <strong>{new Date(Date.now() + user.resetInSeconds * 1000).toLocaleString()}</strong>
                                    : <span className="text-white/50">∞</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ações de Subscrição */}
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
