// src/components/subscription/subscription-details.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Podcast, CircleFadingArrowUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Props {
    status: {
        tier: string
        isActive: boolean
        expiresAt: Date | null
        apiKeyExpiresAt: Date | null
    } | null
}

export default function SubscriptionDetails({ status }: Props) {
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-20 space-y-10 [font-family:var(--font-poppins)]">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-white/10 text-white hover:border-[#66b497] transition-all"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                        My Subscription Plan
                    </h1>
                </div>
            </div>

            {/* Subscription Card */}
            <div className="flex items-center justify-center">
                <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 rounded-xl p-6 space-y-6 transition-all duration-300">

                    <div className="space-y-2">
                        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
                            <Podcast className="h-5 w-5 text-[#66b497]" />
                            Subscription Details
                        </h2>
                        <p className="text-white/70 text-sm">
                            Information about your current plan
                        </p>
                    </div>

                    <div className="space-y-4 text-white/90">
                        {status ? (
                            <>
                                <div>
                                    <p className="text-sm text-white/70">Current Plan</p>
                                    <Badge className="bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50">
                                        {status.tier}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-white/70">Status</p>
                                    <Badge className={status.isActive
                                        ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                        : "bg-red-500/10 text-red-500 border border-red-500/40"}>
                                        {status.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-white/70">Renews At</p>
                                    <p className="text-lg">
                                        {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-white/70">API Key Expires At</p>
                                    <p className="text-lg">
                                        {status.apiKeyExpiresAt ? new Date(status.apiKeyExpiresAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => router.push("/subscription/plans")}
                                    className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all"
                                >
                                    <CircleFadingArrowUp className="mr-2 h-4 w-4 text-[#66b497]" />
                                    Change Plan
                                </Button>
                            </>
                        ) : (
                            <div className="text-center text-white/70 space-y-4">
                                <p>You don't have an active subscription</p>
                                <Button
                                    onClick={() => router.push("/subscription/plans")}
                                    className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all"
                                >
                                    <CircleFadingArrowUp className="mr-2 h-4 w-4 text-[#66b497]" />
                                    View Plans
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
