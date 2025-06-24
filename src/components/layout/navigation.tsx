// src/components/layout/navigation.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, LogOut, Shield, LucideUser } from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"
import axios from "axios"

// Interface para tipagem dos dados do user
interface UserType {
    id: string
    name: string
    email: string
    role: string
    tier: string
}

// Component para navegação principal
export function Navigation() {
    // Estado para armazenar dados do user
    const [user, setUser] = useState<UserType | null>(null)
    const [hasUnread, setHasUnread] = useState(false)

    // Efeito que roda quando o component é montado
    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                // Tenta parsear os dados do usuário do localStorage
                setUser(JSON.parse(userStr))
            } catch (error) {
                console.error("Error loading user data:", error)
            }
        }
    }, [])      // Array de dependências vazio = executa apenas no mount

    // Polling para verificar novas mensagens
    useEffect(() => {
        if (!user) return

        const interval = setInterval(async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get("http://89.28.236.11:3000/api/chat/unread", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setHasUnread(res.data?.hasUnread || false)
            } catch (error) {
                console.error("Error fetching unread status:", error)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [user])

    // Função para lidar com logout
    const handleLogout = () => {
        // Remove itens do localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // Limpa cookies relacionados à autenticação
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

        // Redireciona para a página inicial
        window.location.href = "/"
    }

    // Se não houver usuário, não renderiza nada
    if (!user) return null

    return (
        <nav className="bg-black border-b border-white/10 shadow-sm [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                {/* Container principal flexível */}
                <div className="flex items-center justify-between h-16">
                    {/* Lado esquerdo - Branding e badges */}
                    <div className="flex items-center space-x-4">
                        {/* Logo/Link principal - muda conforme role */}
                        <Link
                            href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                            className="font-bold text-xl text-[#66b497] hover:text-[#88d4bb] transition-colors"
                        >
                            Metamarc API
                        </Link>

                        {/* Badges de role e tier */}
                        <div className="flex items-center space-x-2">
                            {/* Badge de role (ADMIN/USER) */}
                            <Badge
                                variant={user.role === "ADMIN" ? "default" : "secondary"}
                                className={user.role === "ADMIN"
                                    ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                    : "bg-white/10 text-white/80 border border-white/20"}
                            >
                                {user.role}
                            </Badge>
                            {/* Badge de tier (PREMIUM/FREE) */}
                            <Badge
                                variant={user.tier === "PREMIUM" ? "default" : "outline"}
                                className={user.tier === "PREMIUM"
                                    ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                    : "bg-white/10 text-white/80 border border-white/20"}
                            >
                                {user.tier}
                            </Badge>
                        </div>
                    </div>

                    {/* Lado direito - Ações e navegação */}
                    <div className="flex items-center space-x-4">
                        {/* Saudação personalizada */}
                        <span className="text-sm text-white/80">Hi, {user.name}</span>

                        {/* Botão Admin - visível apenas para ADMINS */}
                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/10 transition-all"
                                >
                                    <Shield className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Admin
                                </Button>
                            </Link>
                        </RoleGuard>

                        {/* Botão Dashboard - visível para todos */}
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/10 transition-all"
                            >
                                <LucideUser className="mr-2 h-4 w-4 text-[#66b497]" />
                                Dashboard
                            </Button>
                        </Link>

                        {/* Botão de Chat - visível apenas para ADMINS */}
                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin/chats">
                                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 transition-all">
                                    <MessageCircle className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Chats

                                    {hasUnread && (
                                        <>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                        </>
                                    )}
                                </Button>
                            </Link>
                        </RoleGuard>

                        {/* Botão de Logout */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="border border-white/10 text-white hover:border-[#66b497] transition-all"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-[#66b497]" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )

}