"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Mail } from "lucide-react"
import { useParams } from "next/navigation"
import { LoadingSpinner } from "../layout/loading-spinner"

interface StripeCustomer {
    email: string
    name: string
}

interface Subscription {
    id: string
    status: string
    current_period_end: number
    cancel_at_period_end: boolean
}

interface Invoice {
    id: string
    amount_paid: number
    status: string
    created: number
    hosted_invoice_url: string
}

interface PaymentMethod {
    id: string
    card?: {
        brand?: string
        last4?: string
        exp_month?: number
        exp_year?: number
    }
}

interface StripeData {
    customer: StripeCustomer
    subscriptions: Subscription[]
    invoices: Invoice[]
    paymentMethods: PaymentMethod[]
}

export function UserStripeProfile() {
    const [stripeData, setStripeData] = useState<StripeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const { id } = useParams()

    useEffect(() => {
        async function fetchStripeData() {
            try {
                setLoading(true)

                const token = localStorage.getItem('token')
                const res = await fetch(`http://89.28.236.11:3000/api/admin/users/stripe/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (res.status === 404) {
                    setStripeData(null)
                    setError("")
                } else if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.statusText}`)
                } else {
                    const data = await res.json()
                    setStripeData(data)
                    setError("")
                }
            } catch (err: any) {
                setError(err.message || "Error fetching Stripe data")
            } finally {
                setLoading(false)
            }
        }

        fetchStripeData()
    }, [id])

    if (loading) return <LoadingSpinner />
    if (error) return <p className="text-red-500">{error}</p>

    const activeSubscription = stripeData?.subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
    )

    return (
        <div className="container mx-auto px-4 space-y-6 [font-family:var(--font-poppins)]">

            {/* Título */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                    Subscription & Payment Info
                </h1>
            </div>

            {/* Card Stripe Details */}
            <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-xl shadow-lg space-y-6 transition-all duration-300">

                {/* Customer Info */}
                <div className="space-y-2">
                    <h3 className="text-white text-xl font-semibold mb-2">Customer</h3>
                    {stripeData ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5 text-[#66b497]" />
                                <span className="text-white">{stripeData.customer.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-[#66b497]" />
                                <span className="text-white">{stripeData.customer.email}</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-white">No Stripe information available</p>
                    )}
                </div>

                {/* Subscription */}
                <div className="space-y-2">
                    <h3 className="text-white text-xl font-semibold mb-2">Subscription</h3>
                    {stripeData && activeSubscription ? (
                        <div className="space-y-1">
                            <Badge
                                variant="default"
                                className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                            >
                                Status: {activeSubscription.status}
                            </Badge>
                            <p className="text-white">
                                Period ends: {new Date(activeSubscription.current_period_end * 1000).toLocaleDateString()}
                            </p>
                            <p className="text-white">
                                Cancel at period end: {activeSubscription.cancel_at_period_end ? "Yes" : "No"}
                            </p>
                        </div>
                    ) : (
                        <p className="text-white">No active subscription</p>
                    )}
                </div>

                {/* Recent Payments */}
                <div className="space-y-2">
                    <h3 className="text-white text-xl font-semibold mb-2">Recent Payments</h3>
                    {stripeData && stripeData.invoices.length > 0 ? (
                        <ul className="space-y-2">
                            {stripeData.invoices.map((invoice) => (
                                <li key={invoice.id} className="text-white border-b border-white/10 pb-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <strong>Amount:</strong> €{(invoice.amount_paid / 100).toFixed(2)}{" "}
                                            <span className="text-white/70">({invoice.status})</span>
                                        </div>
                                        <a
                                            href={invoice.hosted_invoice_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#66b497] hover:underline"
                                        >
                                            View Invoice
                                        </a>
                                    </div>
                                    <div className="text-white/70 text-sm">
                                        Date: {new Date(invoice.created * 1000).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">No payments found</p>
                    )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                    <h3 className="text-white text-xl font-semibold mb-2">Payment Methods</h3>
                    {stripeData && stripeData.paymentMethods.length > 0 ? (
                        <ul className="space-y-2">
                            {stripeData.paymentMethods.map((pm) => (
                                <li
                                    key={pm.id}
                                    className="flex items-center justify-between border-b border-white/10 pb-2 text-white"
                                >
                                    <div className="flex items-center space-x-3">
                                        <CreditCard className="w-5 h-5 text-[#66b497]" />
                                        <span>
                                            {(pm.card?.brand?.toUpperCase() || "UNKNOWN")} **** **** **** {pm.card?.last4 || "----"}
                                        </span>
                                    </div>
                                    <div>
                                        Exp: {pm.card?.exp_month || "--"}/{pm.card?.exp_year || "--"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white">No payment methods saved</p>
                    )}
                </div>

            </div>
        </div>
    )
}
