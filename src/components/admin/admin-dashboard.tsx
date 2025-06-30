// src/components/admin/admin-dashboard.tsx

// Sugestões:
// - Considerar usar useCallback para fetchStats se pretendo reutilizá-la noutros efeitos ou components
// - Para segurança e melhores práticas, o token deve idealmente ser gerido via contexto ou cookies HttpOnly, não localStorage

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Shield, TrendingUp, LogOut, Box } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"
import { Stats } from "@/interfaces/stats"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

// Component principal do dashboard
export function AdminDashboard() {
    // Estado que guarda os dados recebidos do backend
    const [stats, setStats] = useState<Stats | null>(null)
    // Estado que indica se os dados ainda estão a ser carregados
    const [isLoading, setIsLoading] = useState(true)

    // Executa a função fetchStats() uma vez que o component é montado
    useEffect(() => {
        fetchStats()
    }, [])

    // Função assíncrona que vai buscar os dados ao backend
    const fetchStats = async () => {
        try {
            const data = await fetchWithAuth("http://89.28.236.11:3000/api/admin/users/stats")

            if (data?.data) {
                setStats(data.data)
            }
        } catch (error) {
            console.error("Error loading stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Enquanto os dados estão a ser carregados, mostra o spinner de loading
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

                {/* Card com estatísticas dos utilizadores */}
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

                    {/* Utilizadores ativos */}
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

                    {/* Utilizadores inativos */}
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

                    {/* Utilizadores pagos */}
                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">
                                Paying Users
                            </CardTitle>
                            <Activity className="h-4 w-4 text-[#66b497]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.payingUsers || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secção de navegação para páginas administrativas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Link para gestão de utilizadores */}
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

                    {/* Link para gestão dos tiers no stripe */}
                    <Link href="/admin/tiers">
                        <Card className="bg-[#1a1a1a] border border-white/10 hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Box className="h-5 w-5" />
                                    Tiers Management
                                </CardTitle>
                                <CardDescription className="text-white/70">View, create, update, and delete tiers</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Link para logs do sistema */}
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

                    {/* Link para verificar o estado de saúde da API/backend */}
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