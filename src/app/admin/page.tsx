// src/app/admin/page.tsx
"use client"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/app/hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/layout/loading-spinner"

interface UserSummary {
    id: string
    name: string
    email: string
}

export default function AdminPage() {
    const { user, isAuthenticated } = useAuth("ADMIN")
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
    const [users, setUsers] = useState<UserSummary[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated === false) {
            // User já confirmou não estar autenticado, redireciona
            router.push("/dashboard")
            return
        }

        if (isAuthenticated && user) {
            if (user.role !== "ADMIN") {
                router.push("/dashboard")
            } else {
                setLoading(false)
            }
        }
    }, [isAuthenticated, user, router])

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
            }
        }

        if (!loading && user?.role === "ADMIN") {
            fetchUsersWithMessages()
        }
    }, [loading, user?.role])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <AuthGuard requiredRole="ADMIN">
            <AdminDashboard />
        </AuthGuard>
    )
}