// src/app/subscription/page.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AuthGuard } from '@/components/auth/auth-guard'
import SubscriptionDetails from '@/components/subscription/subscription-details'
import { API_BASE_URL } from '@/utils/urls'

interface SubscriptionStatus {
    tier: string
    isActive: boolean
    expiresAt: Date | null
    apiKeyExpiresAt: Date | null
}

export default function SubscriptionPage() {
    const [status, setStatus] = useState<SubscriptionStatus | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStatus = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await axios.get(`${API_BASE_URL}/api/subscription/subscription/status`, {
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

    return (
        <AuthGuard>
            <DashboardLayout>
                {loading ? <LoadingSpinner /> : <SubscriptionDetails status={status} />}
            </DashboardLayout>
        </AuthGuard>
    )
}