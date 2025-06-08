"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: string[]
    fallback?: React.ReactNode
    mode?: "default" | "silent"
}

export function RoleGuard({ children, allowedRoles, fallback, mode = "default" }: RoleGuardProps) {
    const [hasPermission, setHasPermission] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkRole = () => {
            const userStr = localStorage.getItem("user")

            if (!userStr) {
                setHasPermission(false)
                setIsLoading(false)
                return
            }

            try {
                const user = JSON.parse(userStr)
                const hasRole = allowedRoles.includes(user.role)
                setHasPermission(hasRole)
            } catch (error) {
                console.error("Error verifying role:", error)
                setHasPermission(false)
            } finally {
                setIsLoading(false)
            }
        }

        checkRole()
    }, [allowedRoles])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!hasPermission) {
        if (mode === "silent") {
            return null
        }
        return fallback || <div>You don't have permission to access this content.</div>
    }

    return <>{children}</>
}