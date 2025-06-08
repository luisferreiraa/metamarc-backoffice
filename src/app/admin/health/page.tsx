import { SystemStatusCheck } from "@/components/admin/system-status";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function SystemStatusPage() {
    return (
        <AuthGuard requiredRole="ADMIN">
            <SystemStatusCheck />
        </AuthGuard>
    )
}