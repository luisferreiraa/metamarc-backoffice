// src/components/admin/user-profile.tsx
"use client"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "../layout/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Mail, UserRoundCheck, CalendarDays, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "../layout/dashboard-layout"
import Link from "next/link"

// Interface para representar os dados o utilizdor
interface User {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: string
    createdAt: string
}

// Componente principal para usar em /app/admin/users/[id]
export function UserProfile() {
    const [user, setUser] = useState<User | null>(null)     // Estado para guardar os dados do utilizador
    const [loading, setLoading] = useState(true)        // Estado para controlar o loading
    const { id } = useParams()      // Hook do Next.js para obter o ID da URL

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get(`http://89.28.236.11:3000/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(res.data)
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return (
            <div className="text-white text-center mt-10">
                User not found.
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">

            {/* Título e Botão Voltar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                            Back
                        </Button>
                    </Link>

                    <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                        {user.name}
                    </h1>
                </div>
            </div>

            {/* Card com os detalhes do utilizador */}
            <Card className="bg-[#1a1a1a] border border-white/10 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-white [font-family:var(--font-poppins)]">User Profile</CardTitle>
                    <CardDescription className="text-white/70">Detailed user information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    {/* Nome */}
                    <div className="flex items-center space-x-2">
                        <UserRoundCheck className="h-5 w-5 text-[#66b497]" />
                        <span className="text-white text-lg">{user.name}</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-[#66b497]" />
                        <span className="text-white">{user.email}</span>
                    </div>

                    {/* Badges de Role e Tier */}
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                            className={user.role === "ADMIN"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.role}
                        </Badge>

                        <Badge
                            variant={user.tier === "PREMIUM" ? "default" : "outline"}
                            className={user.tier === "PREMIUM"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.tier}
                        </Badge>
                    </div>

                    {/* Estado de Atividade */}
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-[#66b497]" />
                        <span className={user.isActive === "1" ? "text-green-500" : "text-red-500"}>
                            {user.isActive === "1" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Data de Criação */}
                    <div className="flex items-center space-x-2">
                        <CalendarDays className="h-5 w-5 text-[#66b497]" />
                        <span className="text-white">
                            Created at: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}