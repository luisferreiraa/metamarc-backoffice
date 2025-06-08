import { SystemLogsManagement } from "@/components/admin/system-logs"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminLogsPage() {
    return (
        <AuthGuard requiredRole="ADMIN">
            <SystemLogsManagement />
        </AuthGuard>
    )
}