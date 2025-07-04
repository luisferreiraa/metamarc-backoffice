// src/components/admin/user-profile.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "../layout/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Mail, UserRoundCheck, CalendarDays, ArrowLeft, UserCircle2 } from "lucide-react"
import { DashboardLayout } from "../layout/dashboard-layout"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import type { UserProfile as UserProfileType } from "@/interfaces/user"

export function UserProfile() {
    const [user, setUser] = useState<UserProfileType | null>(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await fetchWithAuth(`http://89.28.236.11:3000/api/admin/users/${id}`, {
                    method: "GET",
                })
                if (data) setUser(data)
                else console.error("Failed to fetch user or no data returned")
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])

    if (loading) {
        return <LoadingSpinner message="Loading user profile..." />
    }

    if (!user) {
        return (
            <DashboardLayout>
                <div className="text-white text-center mt-20 text-xl">User not found.</div>
            </DashboardLayout>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">

            {/* Header com botão voltar e nome */}
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

                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{user.name}</h1>
                </div>
            </div>

            {/* Card principal com detalhes do utilizador */}
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300 group">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#66b497]/10 rounded-lg group-hover:bg-[#66b497]/20 transition-colors">
                                <UserCircle2 className="h-6 w-6 text-[#66b497]" />
                            </div>
                            <div>
                                <CardTitle className="text-white group-hover:text-[#66b497] transition-colors">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="text-white/70">Detailed user information</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">

                    {/* Email */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Email:</span>
                        </div>
                        <span className="text-white/80">{user.email}</span>
                    </div>

                    {/* Role */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Role:</span>
                        </div>
                        <Badge
                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                            className={user.role === "ADMIN"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.role}
                        </Badge>
                    </div>

                    {/* Tier */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <UserRoundCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Tier:</span>
                        </div>
                        <Badge
                            variant={user.tier === "PREMIUM" ? "default" : "outline"}
                            className={user.tier === "PREMIUM"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.tier}
                        </Badge>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Status:</span>
                        </div>
                        <span className={user.isActive === "1" ? "text-green-500" : "text-red-500"}>
                            {user.isActive === "1" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Data de criação */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Created at:</span>
                        </div>
                        <span className="text-white/80">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
