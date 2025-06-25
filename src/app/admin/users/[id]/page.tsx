// src/app/admin/users/[id]
import { UserProfile } from "@/components/admin/user-profile"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function UserPage() {

    return (
        <AuthGuard requiredRole="ADMIN">
            <UserProfile />
        </AuthGuard>
    )
}