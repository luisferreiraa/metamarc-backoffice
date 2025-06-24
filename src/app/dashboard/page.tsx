"use client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ChatBox } from "@/components/chat/chat-box"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { useAuth } from "../hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth()
    const [adminId, setAdminId] = useState<string>("")

    useEffect(() => {
        const fetchAdminId = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get("http://89.28.236.11:3000/api/chat/admin-id", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setAdminId(res.data.id)
            } catch (err) {
                console.error("Failed to fetch admin ID", err)
            }
        }

        fetchAdminId()
    }, [])

    if (!isAuthenticated || !user) return <p>Unauthorized</p>

    return (
        <AuthGuard>
            <UserDashboard />

            {(user.tier === "PREMIUM" || user.tier === "ENTERPRISE") && adminId && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Chat with Support</h2>
                    <ChatBox withUserId={adminId} currentUserId={user.id} />
                </div>
            )}
        </AuthGuard>
    )
}