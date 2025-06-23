"use client"

import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pricingTiers = [
    {
        name: "FREE",
        price: "€0",
        description: "Perfect for personal projects, testing and explorations.",
        features: [
            'Fetch fields by type',
            'Fetch a specific field by type and tag',
            'Validate tags',
            'List available tags',
            'Limit of 100 requests per month',
            'Basic email support'
        ],
    },
    {
        name: "PRO",
        price: '€9.99/mo',
        description: "For developers building production tools.",
        features: [
            'Everything in FREE plus:',
            'List available languages for translations',
            'Limit of 5.000 requests per month',
            'Access to language-related endpoints',
            'Priority email support'
        ],
    },
    {
        name: "PREMIUM",
        price: "€29.99/mo",
        description: "Designed for teams and advanced integrations.",
        features: [
            'Everything in PRO plus:',
            'Limit of 50.000 requests per month',
            'Automatic API Key renewal',
            'Early access to new features',
            'Technical support via email and chat'
        ],
    },
    {
        name: "ENTERPRISE",
        price: "Contact us",
        description: "Custom SLAs, volume pricing, and private hosting options available.",
        features: [
            'Everything in PREMIUM plus:',
            'Unlimited requests',
            '99.9% SLA uptime guarantee',
            'Personalized technical consultancy',
            '24/7 technical support'
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
