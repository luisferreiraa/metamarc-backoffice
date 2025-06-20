'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
            const token = localStorage.getItem('token')
            if (!token) return console.error('No token found.')

            try {
                const response = await axios.get('http://89.28.236.11:3000/api/subscription/subscription/status', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setStatus(response.data)
            } catch (error) {
                console.error('Error fetching subscription status:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStatus()
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
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
                            My Subscription Plan
                        </h1>
                    </div>
                </div>

                {/* Card */}
                <div className="flex items-center justify-center">
                    <Card className="w-full bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white [font-family:var(--font-poppins)]">
                                Subscription Details
                            </CardTitle>
                            <CardDescription className="text-white/70">
                                Information about your current plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 text-white/90">
                            {loading ? (
                                <p className="text-white/70">Loading...</p>
                            ) : status ? (
                                <>
                                    <div>
                                        <h2 className="font-semibold">Current Plan</h2>
                                        <p className="text-xl">{status.tier}</p>
                                        <p className={status.isActive ? "text-green-500" : "text-red-500"}>
                                            {status.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">Renews at</h2>
                                        <p>{status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : "N/A"}</p>
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">API Key Expires at</h2>
                                        <p>{status.apiKeyExpiresAt ? new Date(status.apiKeyExpiresAt).toLocaleDateString() : "N/A"}</p>
                                    </div>

                                    <Button
                                        onClick={() => router.push("/subscription/upgrade")}
                                        className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-all"
                                    >
                                        Change Plan
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-white/70">
                                    <p className="mb-4">You don't have an active subscription</p>
                                    <Button
                                        onClick={() => router.push("/subscription/plans")}
                                        className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-all"
                                    >
                                        View Plans
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}