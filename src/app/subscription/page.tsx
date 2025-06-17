// app/subscription/page.tsx
'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface SubscriptionStatus {
    tier: string
    isActive: boolean
    expiresAt: Date | null
    apiKeyExpiresAt: Date | null
}

export default function SubscriptionPage() {
    const [status, setStatus] = useState<SubscriptionStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get('/api/subscription/status')
                setStatus(response.data)
            } catch (error) {
                console.error('Error fetching subscription status:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStatus()
    }, [])

    if (loading) return <div className="text-center py-12">Carregando...</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Minha Subscrição</h1>

            {status ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Plano Atual</h2>
                        <p className="text-2xl">{status.tier}</p>
                        <p className={status.isActive ? 'text-green-600' : 'text-red-600'}>
                            {status.isActive ? 'Ativo' : 'Inativo'}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Próxima Renovação</h2>
                        <p>{status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">API Key Expira em</h2>
                        <p>{status.apiKeyExpiresAt ? new Date(status.apiKeyExpiresAt).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <button
                        onClick={() => router.push('/subscription/upgrade')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Alterar Plano
                    </button>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="mb-4">Você não tem uma subscrição ativa</p>
                    <button
                        onClick={() => router.push('/subscription/plans')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Ver Planos
                    </button>
                </div>
            )}
        </div>
    )
}