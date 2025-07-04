// src/app/admin/users/[id]

"use client"
import { useParams } from "next/navigation"
import { UserProfile } from "@/components/admin/user-profile"
import { UserStripeProfile } from "@/components/admin/user-stripe-profile"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function UserPage() {

    const params = useParams()
    const id = params.id as string

    return (
        <AuthGuard requiredRole="ADMIN">
            <DashboardLayout>
                <UserProfile />
                <UserStripeProfile userId={id} />
            </DashboardLayout>
        </AuthGuard>
    )
}