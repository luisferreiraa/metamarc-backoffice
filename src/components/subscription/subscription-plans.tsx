'use client'

import { useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"

const TIERS = [
    {
        name: 'PRO',
        price: '€9.99',
        features: ['10,000 requests/mês', 'Metadados completos', 'Suporte por email'],
        priceId: 'price_1Rb0e5RpvzFUjHn4tlTCWD2y'
    },
    {
        name: 'PREMIUM',
        price: '€99.99',
        features: ['100,000 requests/mês', 'Prioridade no processamento', 'Suporte prioritário'],
        priceId: 'price_1Rb0eNRpvzFUjHn4C5iXBZQf'
    },
    {
        name: 'ENTERPRISE',
        price: 'Contacte-nos',
        features: ['Requests ilimitados', 'Suporte dedicado', 'API dedicada'],
        priceId: 'price_1Rb0eeRpvzFUjHn4bQnl3swX'
    }
]

export default function SubscriptionPlans() {
    const [loading, setLoading] = useState(false)
    const [selectedTier, setSelectedTier] = useState('')
    const router = useRouter()

    const handleSubscribe = async (tier: string) => {
        setLoading(true)
        try {
            const response = await axios.post('/api/subscribe', { tier })
            window.location.href = response.data.url // Redireciona para o checkout do Stripe
        } catch (error) {
            console.error('Subscription error:', error)
            alert('Ocorreu um erro ao processar sua subscrição')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Escolha seu Plano</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TIERS.map((tier) => (
                    <div key={tier.name} className="border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">{tier.name}</h2>
                        <p className="text-2xl font-bold my-4">{tier.price}</p>
                        <ul className="space-y-2 mb-6">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(tier.name)}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Processando...' : 'Assinar'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}