"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Activity, Shield, TrendingUp, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"

interface Stats {
    totalUsers: number,
    activeUsers: number,
    inactiveUsers: number,
    byTier: Record<string, number>,
    byRole: Record<string, number>
}

export function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://89.28.236.11:3000/api/admin/users/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data.data)
            }
        } catch (error) {
            console.error("Error loading stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <LoadingSpinner message="Loading admin dashboard..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Admin Panel
                    </h2>
                </div>

                {/* Estatísticas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-[#66b497]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">
                                Active Users
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-[#66b497]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.activeUsers || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">
                                Inactive Users
                            </CardTitle>
                            <Shield className="h-4 w-4 text-[#66b497]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.inactiveUsers || 0}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">
                                Premium Users
                            </CardTitle>
                            <Activity className="h-4 w-4 text-[#66b497]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.premiumUsers || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Menu de Navegação */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/users">
                        <Card className="bg-[#1a1a1a] border border-white/10 hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Users className="h-5 w-5" />
                                    Users Management
                                </CardTitle>
                                <CardDescription className="text-white/70">View, create, update, and delete users</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/admin/logs">
                        <Card className="bg-[#1a1a1a] border border-white/10 hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Activity className="h-5 w-5" />
                                    System Logs
                                </CardTitle>
                                <CardDescription className="text-white/70">View system activity and audit logs</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/admin/health">
                        <Card className="bg-[#1a1a1a] border border-white/10 hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Shield className="h-5 w-5" />
                                    Health Check
                                </CardTitle>
                                <CardDescription className="text-white/70">Check system backend health status</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}