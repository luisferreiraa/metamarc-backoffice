// src/components/subscription/subscription-plans.tsx
'use client'

import { useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// Array que contém os planos de subscrição disponíveis
const TIERS = [
    {
        name: 'PRO',
        price: '€9.99/mo',
        features: [
            'Everything in FREE plus:',
            'List available languages for translations',
            'Limit of 5.000 requests per month',
            'Access to language-related endpoints',
            'Priority email support'
        ],
        priceId: 'price_1Rb0e5RpvzFUjHn4tlTCWD2y'       // ID do preço no Stripe
    },
    {
        name: 'PREMIUM',
        price: '€29.99/mo',
        features: [
            'Everything in PRO plus:',
            'Limit of 50.000 requests per month',
            'Automatic API Key renewal',
            'Early access to new features',
            'Technical support via email and chat'
        ],
        priceId: 'price_1Rb0eNRpvzFUjHn4C5iXBZQf'
    },
    {
        name: 'ENTERPRISE',
        price: 'Contact us',
        features: [
            'Everything in PREMIUM plus:',
            'Unlimited requests',
            '99.9% SLA uptime guarantee',
            'Personalized technical consultancy',
            '24/7 technical support'
        ],
        priceId: 'price_1Rb0eeRpvzFUjHn4bQnl3swX'
    }
]

// Interface para tipagem dos dados do user
interface UserData {
    id: string
    tier: string
}

// Component principal de seleção de planos
export default function SubscriptionPlans() {
    const [loading, setLoading] = useState(false)       // Controla estado de loading
    const [selectedTier, setSelectedTier] = useState('')        // Plano selecionado
    const [user, setUser] = useState<UserData | null>(null)     // Dados do user
    const router = useRouter()      // Hook para navegação

    // Efeito que roda quando o component é montado
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token")
            const userData = localStorage.getItem("user")

            // Se não houver token ou dados do user, interrompe
            if (!token || !userData) {
                setLoading(false)
                return
            }

            try {
                // Busca dados na API
                const response = await fetch("http://89.28.236.11:3000/api/auth/get-api-key", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const apiData = await response.json()

                    // Atualiza estado com dados do user
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

    // Função para lidar com subscrição de um plano
    const handleSubscribe = async (tier: string) => {
        setLoading(true);
        try {
            // Obtém o token JWT do localStorage
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            console.log('Iniciando assinatura para tier:', tier)

            // Faz requisição para a API Key
            const response = await axios.post(
                '/api/subscription/subscribe',      // Endpoint da API
                { tier },       // Dados enviados
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`      // Token no header
                    }
                }
            );

            console.log('Resposta da API:', response.data)

            // Se houver URL de checkout, redireciona
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('URL de checkout não recebida');
            }

        } catch (error) {
            console.error('Erro na subscrição:', error);

            // Tratamento específico para erro 401 (não autorizado)
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
                {/* Seção de título e botão de voltar */}
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

                {/* Grid de cards dos planos */}
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
                                    {/* Lista de features do plano */}
                                    <ul className="space-y-3 my-4">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-white/80 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-[#66b497] mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Botão de ação */}
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