"use client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ChatBox } from "@/components/chat/chat-box"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { useAuth } from "../hooks/use-auth"

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated || !user) return <p>Unauthorized</p>

    return (
        <AuthGuard>
            <UserDashboard />

            {(user.tier === "PREMIUM" || user.tier === "ENTERPRISE") && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Chat with Support</h2>
                    <ChatBox withUserId="admin" currentUserId={user.id} />
                </div>
            )}
        </AuthGuard>
    )
}