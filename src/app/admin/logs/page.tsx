import { LogsManagement } from "@/components/admin/logs/logs-management"
import { AuthGuard } from "@/components/auth/auth-guard"
import { getLogs } from "@/lib/actions/log-actions"

export const dynamic = "force-dynamic"

export default async function AdminLogsPage() {
    const initialData = await getLogs({ page: 1, limit: 10 })
    return (
        <AuthGuard requiredRole="ADMIN">
            <LogsManagement initialLogs={initialData.data} initialMeta={initialData.meta} />
        </AuthGuard>
    )
}