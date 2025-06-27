"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "../layout/loading-spinner"

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: "ADMIN" | "CLIENT"
    fallbackPath?: string
}

export function AuthGuard({ children, requiredRole, fallbackPath = "/" }: AuthGuardProps) {
    const [isChecking, setIsChecking] = useState(true)
    const [isAllowed, setIsAllowed] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            if (!token || !userStr) {
                router.push(fallbackPath)
                return
            }

            try {
                const user = JSON.parse(userStr)

                if (requiredRole && user.role !== requiredRole) {
                    router.push(fallbackPath)
                    return
                }

                // Define cookies para o middleware, se necessário
                document.cookie = `token=${token}; path=/`
                document.cookie = `userRole=${user.role}; path=/`

                setIsAllowed(true)
            } catch (err) {
                console.error("Invalid user data:", err)
                router.push(fallbackPath)
            } finally {
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [requiredRole, fallbackPath, router])

    if (isChecking) {
        return <LoadingSpinner message="Checking permissions..." />
    }

    if (!isAllowed) {
        // Enquanto redireciona, não mostra nada
        return null
    }

    return <>{children}</>
}