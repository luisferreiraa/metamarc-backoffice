import { UsersManagement } from "@/components/admin/users-management"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminUsersPage() {
    return (
        <AuthGuard requiredRole="ADMIN">
            <UsersManagement />
        </AuthGuard>
    )
}