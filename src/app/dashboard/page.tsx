// src/app/dashboard/page.tsx
"use client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ChatBox } from "@/components/chat/chat-box"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { useAuth } from "../hooks/use-auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessageCircle } from "lucide-react"
import { UserStripeProfile } from "@/components/admin/user-stripe-profile"
import { API_BASE_URL } from "@/utils/urls"

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth()
    const [adminId, setAdminId] = useState<string>("")
    const [chatOpen, setChatOpen] = useState(false)

    useEffect(() => {
        const fetchAdminId = async () => {
            const token = localStorage.getItem("token")
            if (!token) return

            try {
                const res = await axios.get(`${API_BASE_URL}/api/chat/admin-id`, {
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
            <DashboardLayout>
                <UserDashboard />
                <UserStripeProfile title="My Subscription & Payments" />

                {(user.tier === "PREMIUM" || user.tier === "ENTERPRISE") && adminId && (
                    <>
                        {/* Botão Flutuante */}
                        <button
                            onClick={() => setChatOpen((prev) => !prev)}
                            className="fixed bottom-6 right-6 w-14 h-14 bg-[#66b497] hover:bg-[#579d85] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
                        >
                            <MessageCircle className="text-white w-7 h-7" />
                        </button>

                        {/* ChatBox flutuante */}
                        {chatOpen && (
                            <div className="fixed bottom-28 right-6 w-[400px] max-w-[95%] bg-[#1a1a1a] flex flex-col z-50 transition-all duration-300">

                                {/* Conteúdo do Chat ocupa todo o espaço */}
                                <div className="flex-1 flex flex-col">
                                    <ChatBox withUserId={adminId} withUserName="Us" currentUserId={user.id} />
                                </div>

                            </div>
                        )}
                    </>
                )}
            </DashboardLayout>
        </AuthGuard>
    )
}