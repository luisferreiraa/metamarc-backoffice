// src/components/auth/auth-guard.tsx

/**
 * @fileoverview This component acts as a higher-order component (HOC) or a wrapper
 * to protect routes by checking the user's authentication status and, optionally,
 * their role before rendering the protected content.
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"     // Hook for programmatic navigation.
import { LoadingSpinner } from "../layout/loading-spinner"      // Loading indicator component.

/**
 * @interface AuthGuardProps
 * @description Defines the properties accepted by the AuthGuard component.
 * 
 * @property {React.ReactNode} children - The content (components/pages) to be protected.
 * @property {"ADMIN" | "CLIENT"} [requiredRole] - The specific role required to access the content. If omitted, only authentication is checked.
 * @property {string} [fallbackPath="/"] - The path to redirect the user to if authentication or role check fails.
 */
interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: "ADMIN" | "CLIENT"
    fallbackPath?: string
}

/**
 * @function AuthGuard
 * @description A component that checks authentication status and user role.
 * Renders protected content (`children`) only if checks pass, otherwise redirects.
 *
 * @param {AuthGuardProps} props - The component properties.
 * @returns {JSX.Element | null} The protected content, a loading spinner, or null (before redirect).
 */
export function AuthGuard({ children, requiredRole, fallbackPath = "/" }: AuthGuardProps) {
    // State to track if the authentication check is currently running.
    const [isChecking, setIsChecking] = useState(true)
    // State to track if the user is authorized (authenticated and has the correct role).
    const [isAllowed, setIsAllowed] = useState(false)
    // Router instance for redirection.
    const router = useRouter()

    /**
     * @hook useEffect
     * @description Performs the authentication and authorization checks on component mount.
     */
    useEffect(() => {
        const checkAuth = () => {
            // Retrieve token and user data from local storage.
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            // 1. Basic Authentication Check: If no token or user data, redirect.
            if (!token || !userStr) {
                setIsAllowed(false)
                setIsChecking(false)
                router.push(fallbackPath)
                return
            }

            try {
                // Parse user data to check role
                const user = JSON.parse(userStr)

                // 2. Role-based Authorization Check: If 
                if (requiredRole && user.role !== requiredRole) {
                    setIsAllowed(false)
                    setIsChecking(false)
                    router.push(fallbackPath)
                    return
                }

                // 3. Success: Set cookies for server-side access (e.g., in API routes or middleware) and allow access.
                // Note: Setting cookies via `document.cookie` is a client-side mechanism and might not be ideal for secure, server-rendered routes without further integration.
                document.cookie = `token=${token}; path=/`
                document.cookie = `userRole=${user.role}; path=/`

                setIsAllowed(true)
            } catch (err) {
                // 4. Error Handling: Invalid stored user data (e.g., non-JSON).
                console.error("Invalid user data:", err)
                setIsAllowed(false)
                router.push(fallbackPath)       // Redirect on parse error.
            } finally {
                // Mark checking as complete regardless of outcome.
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [requiredRole, fallbackPath, router])        // Dependencies ensure check runs if requirements change.

    // Display loading spinner while checking authorization.
    if (isChecking) {
        return <LoadingSpinner message="Checking permissions..." />
    }

    // If checking is complete and user is not allowed, render nothing (the redirect should have occurred).
    if (!isAllowed) {
        return null
    }

    // If checking is complete and user is allowed, render the protected content.
    return <>{children}</>
}