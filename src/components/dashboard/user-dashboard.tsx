// src/components/dashboard/user-dasboard.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, User, LogOut, RefreshCw, CircleFadingArrowUp, Podcast } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { LoadingSpinner } from "../layout/loading-spinner"

// Interface que define a estrutura dos dados do user
interface UserData {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
    apiKey: string
    apiKeyExpiresAt: string
    createdAt: string
}

// Component principal do dashboard do user
export function UserDashboard() {
    // Estados para armazenar os dados do user e status de loading
    const [user, setUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Efeito que roda quando o component é montado para buscar os dados do user
    useEffect(() => {
        const fetchUserData = async () => {
            // Obtém token e dados do user do localStorage
            const token = localStorage.getItem("token")
            const userData = localStorage.getItem("user")

            // Se não houver token ou dados, finaliza o loading
            if (!token || !userData) {
                setIsLoading(false)
                return
            }

            try {
                // Faz requisição para a API para obter a API Key
                const response = await fetch("http://89.28.236.11:3000/api/auth/get-api-key", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const apiData = await response.json()

                    // Atualiza o estado com os dados combinados
                    setUser({
                        id: apiData.id,
                        name: apiData.name,
                        email: apiData.email,
                        role: apiData.role,
                        tier: apiData.tier,
                        isActive: apiData.isActive,
                        apiKey: apiData.apiKey,
                        apiKeyExpiresAt: apiData.apiKeyExpiresAt,
                        createdAt: apiData.createdAt
                    })
                } else {
                    console.error("Failed to fetch API key")
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }

            setIsLoading(false)
        }

        fetchUserData()
    }, [])      // Array de dependências vazio = executa apenas no mount

    // Função para renovar a API Key
    const handleRenewApiKey = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://89.28.236.11:3000/api/apiKey/renew-api-key", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                // Atualiza apenas a API Key no estado
                setUser((prev) => (prev ? { ...prev, apiKey: data.apiKey } : null))
            }
        } catch (error) {
            console.error("Error renovating API Key:", error)
        }
    }

    // Função para fazer logout
    const handleLogout = () => {
        // Remove os itens de autenticação do localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        // Redireciona para a página principal
        window.location.href = "/"
    }

    // Exibe loading spinner enquanto os dados são buscados
    if (isLoading) {
        return (
            <div className="bg-black">
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        )
    }

    // Mensagem se não encontrar dados do user
    if (!user) {
        return <div>User not found</div>
    }

    console.log(user)

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                        Dashboard
                    </h1>
                </div>

                {/* Grid com os cards principais */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card de informações da conta */}
                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white [font-family:var(--font-poppins)]">
                                <User className="h-5 w-5 text-[#66b497]" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nome do user */}
                            <div>
                                <p className="text-sm font-medium text-white/70">Name</p>
                                <p className="text-lg text-white">{user.name}</p>
                            </div>
                            {/* Email do user */}
                            <div>
                                <p className="text-sm font-medium text-white/70">Email</p>
                                <p className="text-lg text-white">{user.email}</p>
                            </div>
                            {/* Tier e status */}
                            <div className="flex items-center gap-6 flex-wrap">
                                <div>
                                    <p className="text-sm font-medium text-white/70">Tier</p>
                                    <Badge variant="secondary" className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50">
                                        {user.tier}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/70">Status</p>
                                    <Badge
                                        variant={user.isActive ? "default" : "destructive"}
                                        className={user.isActive
                                            ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                            : "bg-red-500/10 text-red-500 border border-red-500/40"}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card da chave API */}
                    <Card className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white [font-family:var(--font-poppins)]">
                                <Key className="h-5 w-5 text-[#66b497]" />
                                API Key
                            </CardTitle>
                            <CardDescription className="text-white/70">
                                Use this key to access the API
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Card da chave API */}
                            <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white break-all">
                                {user.apiKey}
                            </div>
                            {/* Data de expiração da chave */}
                            <div className="p-3 bg-black border border-white/10 rounded-md font-mono text-sm text-white/80 break-all">
                                {user.apiKeyExpiresAt ? new Date(user.apiKeyExpiresAt).toLocaleString() : "N/A"}
                            </div>
                            {/* Botão para renovar chave */}
                            <Button
                                onClick={handleRenewApiKey}
                                variant="outline"
                                className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <RefreshCw className="mr-2 h-4 w-4 text-[#66b497]" />
                                Renovate API Key
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                {/* Botões de ação */}
                <div className="flex items-center gap-4">
                    {/* Link para página de assinatura */}
                    <Link href="/subscription" className="w-full">
                        <Button
                            variant="main"
                            className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                        >
                            <Podcast className="mr-2 h-4 w-4 text-white" />
                            My Subscription Plan
                        </Button>
                    </Link>
                    {/* Link para upgrade de plano */}
                    <Link href="/subscription/plans" className="w-full">
                        <Button
                            variant="main"
                            className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                        >
                            <CircleFadingArrowUp className="mr-2 h-4 w-4 text-white" />
                            Upgrade My Plan
                        </Button>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )

}