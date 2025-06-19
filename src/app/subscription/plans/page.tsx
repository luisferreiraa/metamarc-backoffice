// app/subscription/plans/page.tsx
import { Navigation } from '@/components/layout/navigation'
import SubscriptionPlans from '@/components/subscription/subscription-plans' // Ajuste o caminho conforme sua estrutura

export default function PlansPage() {
    return (
        <div>
            <Navigation />
            <SubscriptionPlans />
        </div>

    )
}