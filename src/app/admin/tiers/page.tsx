import { TiersManagement } from "@/components/admin/tiers/tiers-management";
import { AuthGuard } from "@/components/auth/auth-guard";
import { getTiers } from "@/lib/actions/tier-actions";

export const dynamic = "force-dynamic"

export default async function TiersPage() {

    const initialTiers = await getTiers()

    return (
        <AuthGuard requiredRole="ADMIN" fallbackPath="/dashboard">
            <TiersManagement initialTiers={initialTiers} />
        </AuthGuard>
    )
}