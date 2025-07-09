// src/app/admin/users/page.tsx
import { UsersManagement } from "@/components/admin/users/users-management"
import { AuthGuard } from "@/components/auth/auth-guard"
import { getUsers } from "@/lib/actions/user-actions"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
    const { data: initialUsers } = await getUsers({ page: 1, limit: 10 })

    return (
        <AuthGuard requiredRole="ADMIN">
            <UsersManagement initialUsers={initialUsers} />
        </AuthGuard>
    )
}