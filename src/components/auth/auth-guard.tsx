"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: "ADMIN" | "CLIENT"
    fallbackPath?: string
}

export function AuthGuard({ children, requiredRole, fallbackPath = "/" }: AuthGuardProps) {
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            if (!token || !userStr) {
                // Não autenticado
                router.push("/")
                return
            }

            try {
                const user = JSON.parse(userStr)

                // Verificar se o role é necessário e se o utilizador tem o role correto
                if (requiredRole && user.role !== requiredRole) {
                    // Utilizador não tem permissão
                    if (user.role == "CLIENT") {
                        router.push("/dashboard")
                    } else {
                        router.push("/")
                    }
                    return
                }

                // Salvar role nos cookies para o middleware
                document.cookie = `token=${token}; path=/`
                document.cookie = `userRole=${user.role}; path=/`

                setIsAuthorized(true)
            } catch (error) {
                console.error("Error checking for authentication:", error)
                router.push("/")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router, requiredRole])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Checking for permissions...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}