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
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
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

            <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">User Chats</h2>

                {users.length === 0 ? (
                    <p>No users with active chats.</p>
                ) : (
                    users.map((u) => (
                        <button
                            key={u.id}
                            className="mr-2 mb-2 border px-4 py-1 rounded bg-gray-200"
                            onClick={() => setSelectedUserId(u.id)}
                        >
                            {u.name} ({u.email})
                        </button>
                    ))
                )}

                {selectedUserId && (
                    <div className="mt-4">
                        <ChatBox withUserId={selectedUserId} currentUserId={user.id} />
                    </div>
                )}
            </div>
        </AuthGuard>
    )
}