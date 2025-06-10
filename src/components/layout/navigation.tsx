"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, LucideUser } from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"

interface UserType {
    id: string
    name: string
    email: string
    role: string
    tier: string
}

export function Navigation() {
    const [user, setUser] = useState<UserType | null>(null)

    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                setUser(JSON.parse(userStr))
            } catch (error) {
                console.error("Error loading user data:", error)
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        // Limpar cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.href = "/"
    }

    if (!user) return null

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="font-bold text-xl text-[#705085]">
                            Metamarc API
                        </Link>

                        <div className="flex items-center space-x-2">
                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                            <Badge variant={user.tier === "PREMIUM" ? "default" : "outline"}>{user.tier}</Badge>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Olá, {user.name}</span>

                        {/* Menu para Admins */}
                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Admin
                                </Button>
                            </Link>
                        </RoleGuard>

                        {/* Menu para todos os usuários */}
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <LucideUser className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>

                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav >
    )
}