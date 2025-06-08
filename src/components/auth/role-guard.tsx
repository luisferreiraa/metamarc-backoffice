"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: string[]
    fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
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
        return fallback || <div>You don't have permission to access this content.</div>
    }

    return <>{children}</>
}