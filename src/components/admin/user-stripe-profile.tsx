// src/components/admin/user-stripe-profile.tsx

/**
 * @fileoverview This component is designed to fetch and display detailed Stripe (payment and subscription)
 * information for a specific user, intended for use within the Admin dashboard. It uses an Accordion
 * for collapsible content display.
 */

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"     // Hook to access dynamic route parameters (e.g., user ID from URL).
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LoadingSpinner } from "../layout/loading-spinner"
import { CreditCard, Mail, CalendarDays, DollarSign, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StripeData, UserStripeProfileProps } from "@/interfaces/stripe"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { API_BASE_URL } from "@/utils/urls"

export function UserStripeProfile({ userId, title }: UserStripeProfileProps) {
    const [stripeData, setStripeData] = useState<StripeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const params = useParams()

    useEffect(() => {
        async function fetchStripeData() {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem("token")
                if (!token) {
                    setError("No token found")
                    setLoading(false)
                    return
                }

                const payload = JSON.parse(atob(token.split(".")[1]))
                const resolvedId = userId || params.id || payload?.userId

                if (!resolvedId) {
                    setError("User ID not found")
                    setLoading(false)
                    return
                }

                const data = await fetchWithAuth(`${API_BASE_URL}/api/admin/users/stripe/${resolvedId}`, {
                    method: "GET",
                })

                if (data?.error) {
                    setError(data.error)
                    setStripeData(null)
                } else {
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
    }, [userId, params.id])

    if (loading) return <LoadingSpinner message="Loading Stripe data..." />
    if (error) return <p className="text-red-500">{error}</p>

    const activeSubscription = stripeData?.subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
    )

    const periodEndDate = activeSubscription
        ? new Date(activeSubscription.current_period_end * 1000)
        : stripeData
            ? new Date(new Date(stripeData.customer.created).getTime() + 30 * 24 * 60 * 60 * 1000)
            : null

    return (
        <div className="container mx-auto px-4 space-y-8 font-[family-name:var(--font-poppins)]">
            <Accordion type="single" collapsible>
                <AccordionItem value="stripe">
                    <AccordionTrigger className="flex items-center justify-between bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 p-4 rounded-xl cursor-pointer hover:border-[#66b497]/50 transition-all duration-300 group">
                        <h1 className="text-xl font-semibold text-white group-hover:text-[#66b497] transition-colors">
                            {title ?? "Subscription & Payment Info"}
                        </h1>
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 p-6 rounded-xl shadow-lg space-y-8 mt-5">

                            <div className="space-y-4 border-b border-white/10 pb-4">
                                <h3 className="text-white text-xl font-semibold mb-2">Customer</h3>
                                {stripeData ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-4 w-4 text-[#66b497]" />
                                            <span className="text-white">{stripeData.customer.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-[#66b497]" />
                                            <span className="text-white">{stripeData.customer.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white">No Stripe information available</p>
                                )}
                            </div>

                            <div className="space-y-4 border-b border-white/10 pb-4">
                                <h3 className="text-white text-xl font-semibold mb-2">Subscription</h3>
                                {activeSubscription ? (
                                    <div className="space-y-2">
                                        <Badge className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50">
                                            Status: {activeSubscription.status}
                                        </Badge>
                                        <div className="flex items-center gap-3 text-white">
                                            <CalendarDays className="h-4 w-4 text-[#66b497]" />
                                            Period ends: {new Date(activeSubscription.current_period_end * 1000).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-3 text-white">
                                            <ShieldCheck className="h-4 w-4 text-[#66b497]" />
                                            Cancel at period end: {activeSubscription.cancel_at_period_end ? "Yes" : "No"}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white">No active subscription</p>
                                )}
                            </div>

                            <div className="space-y-4 border-b border-white/10 pb-4">
                                <h3 className="text-white text-xl font-semibold mb-2">Recent Payments</h3>
                                {stripeData?.invoices.length ? (
                                    <ul className="space-y-3">
                                        {stripeData.invoices.map((invoice) => (
                                            <li key={invoice.id} className="border border-white/10 rounded-lg p-4 flex justify-between items-center hover:border-[#66b497]/50 transition-all">
                                                <div>
                                                    <div className="text-white font-medium">
                                                        Amount: €{(invoice.amount_paid / 100).toFixed(2)}
                                                    </div>
                                                    <div className="text-white/70 text-sm">
                                                        {invoice.status} | {new Date(invoice.created * 1000).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <a
                                                    href={invoice.hosted_invoice_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#66b497] hover:underline text-sm"
                                                >
                                                    View Invoice
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-white">No payments found</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-white text-xl font-semibold mb-2">Payment Methods</h3>
                                {stripeData?.paymentMethods.length ? (
                                    <ul className="space-y-3">
                                        {stripeData.paymentMethods.map((pm) => (
                                            <li key={pm.id} className="border border-white/10 rounded-lg p-4 flex justify-between items-center hover:border-[#66b497]/50 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="h-4 w-4 text-[#66b497]" />
                                                    <span className="text-white">
                                                        {(pm.card?.brand?.toUpperCase() || "UNKNOWN")} **** {pm.card?.last4 || "----"}
                                                    </span>
                                                </div>
                                                <div className="text-white/70 text-sm">
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
