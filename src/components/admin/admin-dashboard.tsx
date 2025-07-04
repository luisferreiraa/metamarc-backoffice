// src/components/admin/admin-dashboard.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
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
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"
import type { Stats } from "@/interfaces/stats"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

// Component principal do dashboard
export function AdminDashboard() {
    // Estado que guarda os dados recebidos do backend
    const [stats, setStats] = useState<Stats | null>(null)
    // Estado que indica se os dados ainda estão a ser carregados
    const [isLoading, setIsLoading] = useState(true)
    // Estado para refresh manual
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Função assíncrona que vai buscar os dados ao backend (com useCallback)
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
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    // Função para refresh manual
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchStats()
    }

    // Executa a função fetchStats() uma vez que o component é montado
    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    // Calcula percentagens para melhor visualização
    const getPercentage = (value: number, total: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0
    }

    // Enquanto os dados estão a ser carregados, mostra o spinner de loading
    if (isLoading) {
        return <LoadingSpinner message="Loading admin dashboard..." />
    }

    const totalUsers = stats?.totalUsers || 0
    const activeUsers = stats?.activeUsers || 0
    const inactiveUsers = stats?.inactiveUsers || 0
    const payingUsers = stats?.payingUsers || 0

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">
                {/* Header com ações */}
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
                            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Cards com estatísticas dos utilizadores - Melhorados */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Users */}
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

                    {/* Active Users */}
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
                                <span className="text-xs text-white/60">{getPercentage(activeUsers, totalUsers)}% of total</span>
                                <TrendingUp className="h-3 w-3 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inactive Users */}
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
                                <span className="text-xs text-white/60">{getPercentage(inactiveUsers, totalUsers)}% of total</span>
                                <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs px-1 py-0">
                                    Monitor
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Paying Users */}
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
                                <span className="text-xs text-white/60">{getPercentage(payingUsers, totalUsers)}% conversion</span>
                                <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs px-1 py-0">
                                    Revenue
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                        <Badge variant="outline" className="border-white/20 text-white/60">
                            Management Tools
                        </Badge>
                    </div>

                    {/* Secção de navegação para páginas administrativas - Melhorada */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Users Management */}
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

                        {/* Tiers Management */}
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

                        {/* System Logs */}
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

                        {/* Health Check */}
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

                        {/* Analytics - Novo card */}
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

                        {/* Settings - Novo card */}
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
