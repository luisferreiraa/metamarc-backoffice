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
        <nav className="bg-black border-b border-white/10 shadow-sm [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Branding + Badges */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                            className="font-bold text-xl text-[#66b497] hover:text-[#88d4bb] transition-colors"
                        >
                            Metamarc API
                        </Link>

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
                    </div>

                    {/* Right-side actions */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-white/80">Hi, {user.name}</span>

                        {/* Admin Only */}
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

                        {/* All Users */}
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