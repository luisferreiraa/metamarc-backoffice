"use client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ChatBox } from "@/components/chat/chat-box"
import { useAuth } from "@/app/hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChatPanel } from "@/components/chat/chat-panel"
import { API_BASE_URL } from "@/utils/urls"

interface UserSummary {
    id: string
    name: string
    email: string
}

export default function ChatManagementPage() {
    const { user, isAuthenticated } = useAuth("ADMIN")
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)
    const [users, setUsers] = useState<UserSummary[]>([])

    useEffect(() => {
        const fetchUsersWithMessages = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get(`${API_BASE_URL}/api/chat/active-users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsers(res.data)
            } catch (error) {
                console.error("Error fetching active chat users:", error)
            }
        }

        fetchUsersWithMessages()
    }, [])

    if (!isAuthenticated || !user) return <p className="text-white">Unauthorized</p>

    return (
        <AuthGuard requiredRole="ADMIN">
            <DashboardLayout>
                <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)]">

                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">
                            Messages
                        </h1>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex w-full h-[70vh] bg-[#1a1a1a] border border-white/10 rounded shadow-lg overflow-hidden">

                            {/* Sidebar com utilizadores */}
                            <div className="w-64 border-r border-white/10 p-4 overflow-y-auto">
                                <h2 className="text-lg font-bold mb-4 text-[#66b497]">Active Chats</h2>

                                {users.length === 0 ? (
                                    <p className="text-white/70">No active chats.</p>
                                ) : (
                                    users.map((u) => (
                                        <button
                                            key={u.id}
                                            className={`block w-full text-left mb-2 px-3 py-2 rounded hover:bg-[#2a2a2a] ${selectedUser?.id === u.id ? "bg-[#66b497] text-black" : "bg-[#111111] text-white"
                                                }`}
                                            onClick={() => setSelectedUser(u)}
                                        >
                                            {u.name} <br />
                                            <span className="text-xs text-white/50">{u.email}</span>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Área do chat */}
                            <div className="flex-grow flex flex-col h-full">
                                {selectedUser ? (
                                    <ChatPanel
                                        withUserId={selectedUser.id}
                                        withUserName={selectedUser.name}
                                        currentUserId={user.id}
                                    />
                                ) : (
                                    <div className="flex flex-col justify-center items-center h-full text-white">
                                        <h2 className="text-2xl font-semibold mb-4">No Chat Selected</h2>
                                        <p className="text-white/50">Select a conversation to start messaging.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    )
}
