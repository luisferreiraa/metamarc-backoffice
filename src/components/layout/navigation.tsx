"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, LogOut, Shield, LucideUser, Menu, X } from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"
import { usePathname } from "next/navigation"

interface UserType {
    id: string
    name: string
    email: string
    role: string
    tier: string
}

export function Navigation() {
    const [user, setUser] = useState<UserType | null>(null)
    const [hasUnread, setHasUnread] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const ws = useRef<WebSocket | null>(null)
    const pathname = usePathname()

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

    useEffect(() => {
        if (!user?.id) return

        const socket = new WebSocket("wss://91.98.29.248:3000")

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: "auth",
                userId: user.id
            }))
        }

        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data)
                if (pathname !== "/admin/chats") {
                    setHasUnread(true)
                }
            } catch (err) {
                console.error("Invalid WebSocket message [Navigation]", err)
            }
        }

        socket.onclose = () => {
            console.log("WebSocket disconnected [Navigation]")
        }

        ws.current = socket
        return () => socket.close()
    }, [user?.id, pathname])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.href = "/"
    }

    if (!user) return null

    return (
        <nav className="bg-black border-b border-white/10 shadow-sm [font-family:var(--font-poppins)] sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Branding */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                            className="font-bold text-xl text-[#66b497] hover:text-[#88d4bb] transition-colors"
                        >
                            Metamarc API
                        </Link>

                        {/* Badges desktop */}
                        <div className="hidden md:flex items-center space-x-2">
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

                    {/* Mobile menu toggle */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen
                                ? <X className="h-5 w-5 text-[#66b497]" />
                                : <Menu className="h-5 w-5 text-[#66b497]" />}
                        </Button>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm text-white/80">Hi, {user.name}</span>

                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-all">
                                    <Shield className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Dashboard
                                </Button>
                            </Link>
                        </RoleGuard>

                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-all">
                                <LucideUser className="mr-2 h-4 w-4 text-[#66b497]" />
                                User Profile
                            </Button>
                        </Link>

                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin/chats">
                                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 transition-all">
                                    <MessageCircle className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Messages
                                    {hasUnread && (
                                        <>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                        </>
                                    )}
                                </Button>
                            </Link>
                        </RoleGuard>

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

                {/* Mobile navigation */}
                {isMenuOpen && (
                    <div className="md:hidden flex flex-col space-y-4 py-4 border-t border-white/10">
                        <span className="text-sm text-white/80">Hi, {user.name}</span>

                        {/* ✅ Badges no mobile */}
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

                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm" className="w-full text-white hover:bg-white/10 transition-all">
                                    <Shield className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Dashboard
                                </Button>
                            </Link>
                        </RoleGuard>

                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="ghost" size="sm" className="w-full text-white hover:bg-white/10 transition-all">
                                <LucideUser className="mr-2 h-4 w-4 text-[#66b497]" />
                                User Profile
                            </Button>
                        </Link>

                        <RoleGuard allowedRoles={["ADMIN"]} mode="silent">
                            <Link href="/admin/chats" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm" className="relative w-full text-white hover:bg-white/10 transition-all">
                                    <MessageCircle className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Messages
                                    {hasUnread && (
                                        <>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                        </>
                                    )}
                                </Button>
                            </Link>
                        </RoleGuard>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsMenuOpen(false)
                                handleLogout()
                            }}
                            className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-[#66b497]" />
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )

}
