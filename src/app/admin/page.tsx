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

            <div className="flex mt-4 h-[70vh]">

                {/* Sidebar com utilizadores */}
                <div className="w-64 bg-[#1a1a1a] border border-white/10 p-4 rounded text-white mr-4 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 text-[#66b497]">Active Chats</h2>

                    {users.length === 0 ? (
                        <p className="text-white/70">No active chats.</p>
                    ) : (
                        users.map((u) => (
                            <button
                                key={u.id}
                                className={`block w-full text-left mb-2 px-3 py-2 rounded hover:bg-[#2a2a2a] ${selectedUser?.id === u.id ? "bg-[#66b497] text-black" : "bg-[#111111] text-white"}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                {u.name} <br />
                                <span className="text-xs text-white/50">{u.email}</span>
                            </button>
                        ))
                    )}
                </div>

                {/* Área do chat */}
                <div className="flex-grow">
                    {selectedUser?.id ? (
                        <ChatBox
                            withUserId={selectedUser.id}
                            withUserName={selectedUser.name}
                            currentUserId={user.id}
                        />
                    ) : (
                        <p className="text-white">Select a chat to view conversation.</p>
                    )}
                </div>
            </div>
        </AuthGuard>
    )
}