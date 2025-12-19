// src/components/admin/admin-dashboard.tsx

/**
 * @fileoverview This component defines the main Admin Dashboard interface.
 * It fetches and displays key statistics (stats) about the platform (users, activity, revenue)
 * and provides quick navigation links to management areas.
 */

"use client"

import { useCallback, useEffect, useState } from "react"
// Imports UI components (Card, Badge, Button, Icons)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Users,
    Activity,
    Shield,
    TrendingUp,
    Box,
    RefreshCw,
    ArrowUpRight,
    UserCheck,
    UserX,
    CreditCard,
    Calendar,
    BarChart3,
    Settings,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"      // Main dashboard layout structure.
import Link from "next/link"        // For navigation to other admin pages.
import { LoadingSpinner } from "../layout/loading-spinner"      // Loading indicator component.
import type { Stats } from "@/interfaces/stats"     // Imports the type definition for statistics data.
import { fetchWithAuth } from "@/lib/fetchWithAuth"     // Utility for making authenticated API requests.

/**
 * @function AdminDashboard
 * @description The main component for the Admin Dashboard. Manages fetching and displaying platform statistics.
 *
 * @returns {JSX.Element} The rendered dashboard content.
 */
export function AdminDashboard() {
    // State to store the fetched statistics data.
    const [stats, setStats] = useState<Stats | null>(null)

    // State to indicate the initial loading status (first data fetch).
    const [isLoading, setIsLoading] = useState(true)

    // State to indicate if a manual refresh is in progress.
    const [isRefreshing, setIsRefreshing] = useState(false)

    /**
     * @async
     * @function fetchStats
     * @description Fetches the platform statistics from the backend API endpoint.
     * Uses `fetchWithAuth` for secure communication. Memoized with `useCallback`.
     */
    const fetchStats = useCallback(async () => {
        try {
            const data = await fetchWithAuth("http://89.28.236.11:3000/api/admin/users/stats", {
                method: "GET",
            })

            if (data?.data) {
                setStats(data.data)
            }
        } catch (error) {
            console.error("Error loading stats:", error)
        } finally {
            // Ensure loading and refreshing states are reset regardless of success/failure.
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])      // Dependencies: none, so created once.

    /**
     * @async
     * @function handleRefresh
     * @description Initiates a manual data refresh by setting the refreshing state and calling `fetchStats`.
     */
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchStats()
    }

    /**
     * @hook useEffect
     * @description Runs once on component mount to fetch the initial statistics data.
     */
    useEffect(() => {
        fetchStats()
    }, [fetchStats])        // Dependency array includes `fetchStats` (which is stable due to `useCallback`).

    /**
     * @function getPercentage
     * @description Calculates the percentage of a value relative to a total, handling division by zero.
     *
     * @param {number} value - The numerator.
     * @param {number} total - The denominator (total).
     * @returns {number} The calculated percentage, rounded to the nearest integer.
     */
    const getPercentage = (value: number, total: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0
    }

    // Displays a full-screen loading spinner while the initial data is being fetched.
    if (isLoading) {
        return <LoadingSpinner message="Loading admin dashboard..." />
    }

    // Destructure stats or default to 0 to prevent errors if stats is null.
    const totalUsers = stats?.totalUsers || 0
    const activeUsers = stats?.activeUsers || 0
    const inactiveUsers = stats?.inactiveUsers || 0
    const payingUsers = stats?.payingUsers || 0

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">
                {/* Dashboard Header and Refresh Button */}
                <div className="flex items-center justify-between">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard</h2>
                        <p className="text-white/60">Monitor and manage your platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-[#66b497]/50 text-[#66b497] bg-[#66b497]/10">
                            Live Data
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                        >
                            {/* Refresh icon with spinning animation when refreshing */}
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Total Users Card */}
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
                                <div className="text-2xl font-bold text-white mt-1">{totalUsers}</div>
                            </div>
                            <div className="p-2 bg-[#66b497]/10 rounded-lg group-hover:bg-[#66b497]/20 transition-colors">
                                <Users className="h-5 w-5 text-[#66b497]" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center text-xs text-white/60">
                                <Calendar className="h-3 w-3 mr-1" />
                                Updated just now
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Active Users Card */}
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-sm font-medium text-white/80">Active Users</CardTitle>
                                <div className="text-2xl font-bold text-green-400 mt-1">{activeUsers}</div>
                            </div>
                            <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                                <UserCheck className="h-5 w-5 text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                                {/* Displays percentage of active users out of total users */}
                                <span className="text-xs text-white/60">{getPercentage(activeUsers, totalUsers)}% of total</span>
                                <TrendingUp className="h-3 w-3 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Inactive Users Card */}
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-red-500/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-sm font-medium text-white/80">Inactive Users</CardTitle>
                                <div className="text-2xl font-bold text-red-400 mt-1">{inactiveUsers}</div>
                            </div>
                            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                <UserX className="h-5 w-5 text-red-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                                {/* Displays percentage of inactive users out of total users */}
                                <span className="text-xs text-white/60">{getPercentage(inactiveUsers, totalUsers)}% of total</span>
                                <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs px-1 py-0">
                                    Monitor
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Paying Users Card */}
                    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-sm font-medium text-white/80">Paying Users</CardTitle>
                                <div className="text-2xl font-bold text-blue-400 mt-1">{payingUsers}</div>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                <CreditCard className="h-5 w-5 text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                                {/* Displays percentage of paying users (often interpreted as conversion rate) */}
                                <span className="text-xs text-white/60">{getPercentage(payingUsers, totalUsers)}% conversion</span>
                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs px-1 py-0">
                                    Revenue
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions / Navigation Links */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                        <Badge variant="outline" className="border-white/20 text-white/60">
                            Management Tools
                        </Badge>
                    </div>

                    {/* 1. Users Management Link */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/users" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 hover:shadow-lg hover:shadow-[#66b497]/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-[#66b497]/10 rounded-lg group-hover:bg-[#66b497]/20 transition-colors">
                                            <Users className="h-6 w-6 text-[#66b497]" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-[#66b497] transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-[#66b497] transition-colors">
                                        Users Management
                                    </CardTitle>
                                    <CardDescription className="text-white/70">View, create, update, and delete users</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">{totalUsers} total users</span>
                                        <Badge variant="outline" className="border-[#66b497]/30 text-[#66b497] text-xs">
                                            Manage
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 2. Tiers Management Link */}
                        <Link href="/admin/tiers" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                            <Box className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                                        Tiers Management
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        View, create, update, and delete subscription tiers
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Subscription plans</span>
                                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
                                            Configure
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 3. System Logs Link */}
                        <Link href="/admin/logs" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                                            <Activity className="h-6 w-6 text-orange-400" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-orange-400 transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                                        System Logs
                                    </CardTitle>
                                    <CardDescription className="text-white/70">View system activity and audit logs</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Activity monitoring</span>
                                        <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">
                                            Monitor
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 4. Health Check Link */}
                        <Link href="/admin/health" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                                            <Shield className="h-6 w-6 text-green-400" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-green-400 transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-green-400 transition-colors">
                                        Health Check
                                    </CardTitle>
                                    <CardDescription className="text-white/70">Check system backend health status</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">System status</span>
                                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                                            Healthy
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 5. Analytics Link */}
                        <Link href="/admin/analytics" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                            <BarChart3 className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-cyan-400 transition-colors">Analytics</CardTitle>
                                    <CardDescription className="text-white/70">View detailed analytics and reports</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Data insights</span>
                                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
                                            Insights
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 6. Settings Link */}
                        <Link href="/admin/settings" className="group">
                            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-gray-500/50 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-gray-500/10 rounded-lg group-hover:bg-gray-500/20 transition-colors">
                                            <Settings className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-gray-400 transition-colors" />
                                    </div>
                                    <CardTitle className="text-white group-hover:text-gray-400 transition-colors">Settings</CardTitle>
                                    <CardDescription className="text-white/70">Configure system settings and preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Configuration</span>
                                        <Badge variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
                                            Configure
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
