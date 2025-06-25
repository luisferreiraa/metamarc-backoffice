// src/app/admin/users/[id]
import { UserProfile } from "@/components/admin/user-profile"
import { UserStripeProfile } from "@/components/admin/user-stripe-profile"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function UserPage() {

    return (
        <AuthGuard requiredRole="ADMIN">
            <DashboardLayout>
                <UserProfile />
                <UserStripeProfile />
            </DashboardLayout>
        </AuthGuard>
    )
}