// src/components/subscription/subscription-plans.tsx
"use client"

import { useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { LoadingSpinner } from "../layout/loading-spinner"
import { fetchTiers } from "@/lib/fetchTiers"
import { Tier } from "@/interfaces/stripe-tier"
import { UserData } from "@/interfaces/user-data"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

export default function SubscriptionPlans() {
    const [loading, setLoading] = useState(false)       // Estado geral de carregamento
    const [userLoading, setUserLoading] = useState(true)  // Estado de carregamento dos dados do utilizador
    const [tiersLoading, setTiersLoading] = useState(true)  // Estado de carregamento dos planos
    const [selectedTier, setSelectedTier] = useState('')        // Plano selecionado atualmente
    const [user, setUser] = useState<UserData | null>(null)     // Dados do utilizador
    const [tiers, setTiers] = useState<Tier[]>([])      // Array de planos disponíveis
    const router = useRouter()      // Router do Next.js para navegação

    // Busca dados quando o componente é montado
    useEffect(() => {
        const loadTiers = async () => {
            const tiersData = await fetchTiers()
            if (tiersData) setTiers(tiersData)
            setTiersLoading(false)
        }

        const fetchUserData = async () => {
            const userData = localStorage.getItem("user")

            if (!userData) {
                setUserLoading(false)
                return
            }

            try {
                const apiData = await fetchWithAuth("http://89.28.236.11:3000/api/auth/get-api-key")

                setUser({
                    id: apiData.id,
                    tier: apiData.tier,
                })

            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setUserLoading(false)
            }
        }

        loadTiers()
        fetchUserData()
    }, [])

    // Função para lidar com a assinatura de um plano
    const handleSubscribe = async (tier: string) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('Usuário não autenticado')
            }

            console.log('Iniciando assinatura para tier:', tier)

            // Envia requisição para a API de assinatura
            const response = await axios.post(
                '/api/subscription/subscribe',
                { tier },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            console.log('Resposta da API:', response.data)

            // Se a API retornar uma URL, redireciona para o checkout
            if (response.data.url) {
                window.location.href = response.data.url
            } else {
                throw new Error('URL de checkout não recebida')
            }
        } catch (error) {
            console.error('Erro na subscrição:', error)
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.')
                router.push('/login')
            } else {
                alert(error instanceof Error ? error.message : 'Erro ao processar pagamento')
            }
        } finally {
            setLoading(false)
        }
    }

    // Enquanto dados não estiverem prontos
    if (userLoading || tiersLoading) {
        return (
            <LoadingSpinner message="Loading..." />
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)] bg-black">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            {/* Botão para voltar ao dashboard */}
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

                {/* Grid dos planos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {Array.isArray(tiers) && tiers.map((tierObj) => {
                        const product = tierObj.product
                        const price = tierObj.prices[0]  // Assume que sempre tem pelo menos 1 preço
                        const isCurrentPlan = user?.tier === product.name       // Verifica se é o plano atual

                        return (
                            <Card
                                key={product.id}
                                className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-colors"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl text-white mb-2 [font-family:var(--font-poppins)]">
                                        {product.name}
                                    </CardTitle>
                                    <div className="text-3xl font-bold text-[#66b497] [font-family:var(--font-poppins)]">
                                        {price
                                            ? `€${(price.unit_amount / 100).toFixed(2)}/mo`
                                            : "No price"}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    {/* Lista de features do plano */}
                                    <ul className="space-y-3 my-4">
                                        {product.metadata?.features
                                            ? product.metadata.features.split(";").map((feature, idx) => (
                                                <li key={`${feature.trim()}-${idx}`} className="flex items-center text-white/80 text-sm">
                                                    <CheckCircle2 className="h-4 w-4 text-[#66b497] mr-2" />
                                                    {feature.trim()}
                                                </li>
                                            ))
                                            : <li className="text-white/80 text-sm">No features available</li>
                                        }
                                    </ul>

                                    {/* Botão de assinatura */}
                                    <button
                                        onClick={() => handleSubscribe(product.name)}
                                        disabled={loading || isCurrentPlan}
                                        className={`w-full mt-2 py-2 rounded transition-all ${isCurrentPlan
                                            ? "bg-white/10 text-white cursor-not-allowed"
                                            : "bg-[#66b497] text-black hover:bg-[#5aa88b] disabled:bg-white/20"
                                            }`}
                                    >
                                        {loading
                                            ? "Processing..."
                                            : isCurrentPlan
                                                ? "Your plan"
                                                : product.name === "ENTERPRISE"
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
