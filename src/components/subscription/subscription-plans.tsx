// src/components/subscription/subscription-plans.tsx

/**
 * @fileoverview This component renders a list of available subscription plans (tiers),
 * displays the user's current plan, and handles the subscription process initiation
 * by redirecting the user to the Stripe checkout page.
 */

"use client"

import { useEffect, useState } from "react"
import axios from 'axios'       // Used for making the POST request to initiate Stripe checkout.
import { useRouter } from "next/navigation"     // Hook for programmatic routing.
import Link from "next/link"        // For declarative navigation (Back button).
import { Button } from "../ui/button"       // UI component for action buttons.
// Imports icons for visual representation of tiers/actions.
import { ArrowLeft, CheckCircle2, Crown, Rocket, Star } from "lucide-react"
import { LoadingSpinner } from "../layout/loading-spinner"      // Loading indicator component.
import { fetchTiers } from "@/lib/fetchTiers"       // Utility function to fetch tier/product data from Stripe.
import { Tier } from "@/interfaces/stripe-tier"     // Type definition for a single tier object.
import { UserData } from "@/interfaces/user-data"       // Type definition for basic user data needed here.
import { fetchWithAuth } from "@/lib/fetchWithAuth"     // Utility for making authenticated API requests.
import { API_BASE_URL } from "@/utils/urls"     // Base URL constant for API endpoints.

/**
 * @function SubscriptionPlans
 * @description Fetches subscription tiers and the current user's plan, then displays them
 * in a grid layout, allowing the user to initiate a subscription process.
 *
 * @returns {JSX.Element} The rendered subscription plans page.
 */
export default function SubscriptionPlans() {
    // State to track if the subscription initiation process is ongoing (for button disabled state).
    const [loading, setLoading] = useState(false)
    // State to track if the current user data is being fetched.
    const [userLoading, setUserLoading] = useState(true)
    // State to track if the subscription tiers data is being fetched.
    const [tiersLoading, setTiersLoading] = useState(true)
    // State to potentially store the currently selected tier (not directly used in `handleSubscribe`).
    const [selectedTier, setSelectedTier] = useState('')
    // State to store the current user's relevant data (ID and current tier).
    const [user, setUser] = useState<UserData | null>(null)
    // State to store the list of available subscription tiers.
    const [tiers, setTiers] = useState<Tier[]>([])
    // Router instance for navigation.
    const router = useRouter()

    /**
     * @hook useEffect
     * @description Fetches both the available tiers and the current user's subscription status on mount.
     */
    useEffect(() => {
        const loadTiers = async () => {
            const tiersData = await fetchTiers()
            if (tiersData) setTiers(tiersData)
            setTiersLoading(false)
        }

        /**
         * @async
         * @function fetchUserData
         * @description Fetches the current user's ID and active tier to identify the current plan.
         */
        const fetchUserData = async () => {
            const userData = localStorage.getItem("user")

            if (!userData) {
                setUserLoading(false)
                return
            }

            try {
                // Fetch authenticated user data, including the current tier.
                const apiData = await fetchWithAuth(`${API_BASE_URL}/api/auth/get-api-key`)

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
    }, [])      // Runs only once on component mount.


    /**
     * @async
     * @function handleSubscribe
     * @description Initiates the subscription checkout process for the specified tier.
     * It calls the backend API which communicates with Stripe, and then redirects the user
     * to the Stripe checkout URL.
     *
     * @param {string} tier - The name of the subscription tier to subscribe to.
     */
    const handleSubscribe = async (tier: string) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('User not authenticated.')
            }

            console.log('Initializing subscription for tier:', tier)

            // API call to the local backend endpoint responsible for creating the Stripe session.
            const response = await axios.post(
                '/api/subscription/subscribe',
                { tier },       // Payload contains the selected tier name.
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`      // Sends the auth token.
                    }
                }
            )

            console.log('API response:', response.data)

            // If successful, the response contains the Stripe checkout URL.
            if (response.data.url) {
                // Redirects the user to the Stripe hosted checkout page.
                window.location.href = response.data.url
            } else {
                throw new Error('Checkout URL not received.')
            }
        } catch (error) {
            console.error('Error in subscription:', error)
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('Session expired. Please log in again.')
                router.push('/login')
            } else {
                alert(error instanceof Error ? error.message : 'Error processing payment.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Display loading spinner while either user data or tiers data is being fetched.
    if (userLoading || tiersLoading) {
        return (
            <LoadingSpinner message="Loading..." />
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-20 space-y-6 [font-family:var(--font-poppins)] bg-black">

                {/* Header Section */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            {/* Back button */}
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

                {/* Subscription Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tierObj) => {
                        const product = tierObj.product
                        const price = tierObj.prices[0]
                        // Check if this plan matches the user's current tier.
                        const isCurrentPlan = user?.tier === product.name

                        return (
                            <div
                                key={product.id}
                                className="flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-4 transition-all duration-300"
                            >
                                <div>
                                    {/* Display different icons based on the product name */}
                                    {product.name === "PRO" && (
                                        <Rocket className="h-10 w-10 text-[#66b497]" />
                                    )}
                                    {product.name === "PREMIUM" && (
                                        <Star className="h-10 w-10 text-[#66b497]" />
                                    )}
                                    {product.name === "ENTERPRISE" && (
                                        <Crown className="h-10 w-10 text-[#66b497]" />
                                    )}

                                    <div className="flex items-center mt-5">
                                        <h2 className="text-xl text-white font-semibold [font-family:var(--font-poppins)]">
                                            {product.name}
                                        </h2>
                                        {/* Badge indicating the current active plan */}
                                        {isCurrentPlan && (
                                            <span className="ml-auto bg-[#66b497]/10 text-[#66b497] text-xs border border-[#66b497]/50 px-2 py-0.5 rounded">
                                                Your Plan
                                            </span>
                                        )}
                                    </div>

                                    {/* Price Display */}
                                    <div className="text-3xl font-bold text-[#66b497] mb-4 [font-family:var(--font-poppins)]">
                                        {/* Price is converted from cents to Euros/dollars */}
                                        {price ? `€${(price.unit_amount / 100).toFixed(2)}/mo` : "No price"}
                                    </div>

                                    {/* Features List */}
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
                                </div>

                                {/* Subscription Action Button */}
                                <Button
                                    onClick={() => handleSubscribe(product.name)}
                                    disabled={loading || isCurrentPlan}
                                    className={`w-full border border-white/10 text-white hover:border-[#66b497] transition-all ${isCurrentPlan
                                        ? "bg-white/10 text-white cursor-not-allowed"
                                        : "bg-[#66b497] text-black hover:bg-[#5aa88b] disabled:bg-white/20"
                                        }`}
                                >
                                    {/* Dynamic button text based on state and tier name */}
                                    {loading
                                        ? "Processing..."
                                        : isCurrentPlan
                                            ? "Your Plan"
                                            : product.name === "ENTERPRISE"
                                                ? "Contact Us"
                                                : "Subscribe"}
                                </Button>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
