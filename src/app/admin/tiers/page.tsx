import { TiersManagement } from "@/components/admin/tiers-management";
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTiers } from "@/lib/actions/tier-actions";

export default async function TiersPage() {

    const initialTiers = await getTiers()

    return (
        <AuthGuard requiredRole="ADMIN" fallbackPath="/dashboard">
            <TiersManagement initialTiers={initialTiers} />
        </AuthGuard>
    )
}