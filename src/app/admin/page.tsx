"use client"

import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/app/hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { LoadingSpinner } from "@/components/layout/loading-spinner"

interface UserSummary {
    id: string
    name: string
    email: string
}

export default function AdminPage() {
    const { user, isAuthenticated } = useAuth()
    const [users, setUsers] = useState<UserSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsersWithMessages = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get("http://89.28.236.11:3000/api/chat/active-users", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsers(res.data)
            } catch (error) {
                console.error("Error fetching active chat users:", error)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated && user?.role === "ADMIN") {
            fetchUsersWithMessages()
        }
    }, [isAuthenticated, user?.role])

    return (
        <AuthGuard requiredRole="ADMIN" fallbackPath="/dashboard">
            {loading ? <LoadingSpinner message="Loading users..." /> : <AdminDashboard />}
        </AuthGuard>
    )
}