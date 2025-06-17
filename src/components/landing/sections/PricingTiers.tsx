"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pricingTiers = [
    {
        name: "FREE",
        price: "$0",
        description: "Perfect for personal projects, testing and explorations.",
        features: [
            "100 requests/day",
            "Community support",
            "Basic UNIMARC fields",
        ],
    },
    {
        name: "PRO",
        price: "$19/mo",
        description: "For developers building production tools.",
        features: [
            "10,000 requests/month",
            "Priority email support",
            "Extended UNIMARC fields",
            "Rate limiting dashboard",
        ],
    },
    {
        name: "PREMIUM",
        price: "$99/mo",
        description: "Designed for teams and advanced integrations.",
        features: [
            "100,000 requests/month",
            "Dedicated support channel",
            "Real-time field updates",
            "Usage analytics",
            "CSV & XML export",
        ],
    },
    {
        name: "ENTERPRISE",
        price: "Custom",
        description: "Custom SLAs, volume pricing, and private hosting options available.",
        features: [
            "Unlimited access",
            "24/7 SLA-backed support",
            "On-premise or private cloud",
            "Custom endpoints",
            "Integration consulting",
        ],
    },
]

export function PricingTiers() {
    return (
        <section id="pricing" className="py-20 bg-black text-white [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pricing</h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Transparent plans tailored to mee the needs of every project stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {pricingTiers.map((tier, index) => (
                        <Card key={index} className="bg-zinc-900 border border-zinc-800 hover:border-[#66b497] transition-colors">
                            <CardHeader>
                                <CardTitle className="text-xl text-white mb-2">{tier.name}</CardTitle>
                                <div className="text-3xl font-bold text-[#66b497]">{tier.price}</div>
                                <p className="text-gray-400 mt-2 text-sm">{tier.description}</p>
                            </CardHeader>
                            <CardContent className="mt-4">
                                <ul className="space-y-3">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-300 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-[#66b497] mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
