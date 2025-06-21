// src/app/hooks/useAuth.ts
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
}

export function useAuth(requiredRole?: string) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            if (!token || !userStr) {
                setIsAuthenticated(false)
                setIsLoading(false)
                return
            }

            try {
                const userData = JSON.parse(userStr)
                setUser(userData)
                setIsAuthenticated(true)

                // Verificar role se necessário
                if (requiredRole && userData.role !== requiredRole) {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error("Error verifying authentication:", error)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [requiredRole])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setUser(null)
        setIsAuthenticated(false)
        router.push("/")
    }

    const hasRole = (role: string) => {
        return user?.role === role
    }

    const isAdmin = () => {
        return user?.role === "ADMIN"
    }

    const isClient = () => {
        return user?.role === "CLIENT"
    }

    return {
        user,
        isLoading,
        isAuthenticated,
        logout,
        hasRole,
        isAdmin,
        isClient,
    }
}