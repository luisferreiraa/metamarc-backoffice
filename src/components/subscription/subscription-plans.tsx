'use client'

import { useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const TIERS = [
    {
        name: 'PRO',
        price: '€9.99',
        features: ['10,000 requests/mês', 'Metadados completos', 'Suporte por email'],
        priceId: 'price_1Rb0e5RpvzFUjHn4tlTCWD2y'
    },
    {
        name: 'PREMIUM',
        price: '€99.00',
        features: ['100,000 requests/mês', 'Prioridade no processamento', 'Suporte prioritário'],
        priceId: 'price_1Rb0eNRpvzFUjHn4C5iXBZQf'
    },
    {
        name: 'ENTERPRISE',
        price: 'Contact us',
        features: ['Requests ilimitados', 'Suporte dedicado', 'API dedicada'],
        priceId: 'price_1Rb0eeRpvzFUjHn4bQnl3swX'
    }
]

interface UserData {
    id: string
    tier: string
}

export default function SubscriptionPlans() {
    const [loading, setLoading] = useState(false)
    const [selectedTier, setSelectedTier] = useState('')
    const [user, setUser] = useState<UserData | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token")
            const userData = localStorage.getItem("user")

            if (!token || !userData) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch("http://89.28.236.11:3000/api/auth/get-api-key", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const apiData = await response.json()
                    /* const parsedUser = JSON.parse(userData) */

                    // Combina os dados do localStorage com os dados do backend
                    setUser({
                        id: apiData.id,
                        tier: apiData.tier,
                    })
                } else {
                    console.error("Failed to fetch API key")
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }

            setLoading(false)
        }

        fetchUserData()
    }, [])

    const handleSubscribe = async (tier: string) => {
        setLoading(true);
        try {
            // 1. Obter o token JWT (ajuste conforme seu sistema de autenticação)
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            console.log('Iniciando assinatura para tier:', tier)

            // 2. Fazer a requisição com o token no header
            const response = await axios.post(
                '/api/subscription/subscribe',
                { tier },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Resposta da API:', response.data)

            // 3. Redirecionar para o checkout do Stripe
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('URL de checkout não recebida');
            }

        } catch (error) {
            console.error('Erro na subscrição:', error);

            // Tratamento específico para erro 401
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
            } else {
                alert(error instanceof Error ? error.message : 'Erro ao processar pagamento');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)] bg-black">
                {/* Título e Ações */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                            Select your plan
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TIERS.map((tier, index) => {
                        const isCurrentPlan = user?.tier === tier.name

                        return (
                            <Card
                                key={index}
                                className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-colors"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl text-white mb-2 [font-family:var(--font-poppins)]">
                                        {tier.name}
                                    </CardTitle>
                                    <div className="text-3xl font-bold text-[#66b497] [font-family:var(--font-poppins)]">
                                        {tier.price}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3 my-4">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-white/80 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-[#66b497] mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handleSubscribe(tier.name)}
                                        disabled={loading || isCurrentPlan}
                                        className={`w-full mt-2 py-2 rounded transition-all
                        ${isCurrentPlan
                                                ? "bg-white/10 text-white cursor-not-allowed"
                                                : "bg-[#66b497] text-black hover:bg-[#5aa88b] disabled:bg-white/20"
                                            }`}
                                    >
                                        {loading
                                            ? "Processing..."
                                            : isCurrentPlan
                                                ? "Your plan"
                                                : tier.name === "ENTERPRISE"
                                                    ? "Contact us"
                                                    : "Subscribe"}
                                    </button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}