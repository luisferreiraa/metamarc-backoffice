// src/app/admin/users/page.tsx
import { UsersManagement } from "@/components/admin/users/users-management"
import { AuthGuard } from "@/components/auth/auth-guard"
import { getUsers } from "@/lib/actions/user-actions"

export default async function AdminUsersPage() {
    const { data: initialUsers } = await getUsers()

    return (
        <AuthGuard requiredRole="ADMIN">
            <UsersManagement initialUsers={initialUsers} />
        </AuthGuard>
    )
}