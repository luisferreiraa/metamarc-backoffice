// src/app/admin/page.tsx
"use client"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ChatBox } from "@/components/chat/chat-box"
import { useAuth } from "@/app/hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"

interface UserSummary {
    id: string
    name: string
    email: string
}

export default function AdminPage() {
    const { user, isAuthenticated } = useAuth("ADMIN")
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
    const [users, setUsers] = useState<UserSummary[]>([])

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

        fetchUsersWithMessages()
    }, [])

    if (!isAuthenticated || !user) return <p>Unauthorized</p>

    return (
        <AuthGuard requiredRole="ADMIN">
            <AdminDashboard />
        </AuthGuard>
    )
}