"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Database, Zap, Code2 } from "lucide-react"

export function Features() {
    const features = [
        {
            icon: Database,
            title: "All fields and subfields",
            description: "Retrieve exact specifications in JSON/XML format for every UNIMARC field and subfield.",
        },
        {
            icon: CheckCircle,
            title: "Critical metadata",
            description: "Check repeatability, mandatory status, and scope at a glance without manual lookups.",
        },
        {
            icon: Code2,
            title: "Machine-readable clarity",
            description: "Perfect for developers building cataloging tools, validators, or training datasets.",
        },
    ]

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#CCC1D4] mb-4">Get Programmatic Access to:</h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Integrate UNIMARC rules directly into your workflows—no manual lookups required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-2 border-gray-100 hover:border-[#705085] transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-[#FCEEF0] rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-[#E88596]" />
                                </div>
                                <CardTitle className="text-xl text-slate-900">✅ {feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-slate-600 text-base leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-800 font-semibold">
                            🔌 Integrate UNIMARC rules directly into your workflows—no manual lookups required.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}