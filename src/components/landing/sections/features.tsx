"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CheckCircle, Database, Zap, Code2 } from "lucide-react"

export function Features() {
    const features = [
        {
            icon: Database,
            title: "All fields and subfields",
            description:
                "Retrieve exact specifications in JSON/XML format for every UNIMARC field and subfield.",
        },
        {
            icon: CheckCircle,
            title: "Critical metadata",
            description:
                "Check repeatability, mandatory status, and scope at a glance without manual lookups.",
        },
        {
            icon: Code2,
            title: "Machine-readable clarity",
            description:
                "Perfect for developers building cataloging tools, validators, or training datasets.",
        },
    ]

    return (
        <section id="features" className="py-20 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 [font-family:var(--font-poppins)]">
                        Get Programmatic Access to:
                    </h2>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto [font-family:var(--font-poppins)]">
                        Integrate UNIMARC rules directly into your workflows - no manual
                        lookups required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-[#0e0e0e] border border-white/10 hover:border-[#66b497] transition duration-300 group"
                        >
                            <CardHeader className="flex flex-col items-start gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6 text-[#66b497]" />
                                </div>
                                <CardTitle className="text-xl text-white">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/80 text-base leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-4 bg-[#1a1a1a] rounded-full border border-white/10 text-white text-sm">
                        <Zap className="h-5 w-5 text-[#66b497]" />
                        <span>
                            Instantly access the complete UNIMARC Bibliographic and Holdings Formats.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
