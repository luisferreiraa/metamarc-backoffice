import { TiersManagement } from "@/components/admin/tiers-management";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function TiersPage() {
    return (
        <AuthGuard requiredRole="ADMIN" fallbackPath="/dashboard">
            <TiersManagement />
        </AuthGuard>
    )
}