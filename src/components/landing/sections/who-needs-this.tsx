"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users, Code, Archive, GraduationCap } from "lucide-react"

export function WhoNeedsThis() {
    const audiences = [
        {
            icon: Users,
            title: "Librarians & Catalogers",
            description: "Speed up metadata creation and validation with instant field lookups.",
            color: "bg-green-500/10 text-green-400",
        },
        {
            icon: Code,
            title: "Software Developers",
            description: "Build UNIMARC-compliant tools faster with programmatic access to specifications.",
            color: "bg-blue-500/10 text-blue-400",
        },
        {
            icon: Archive,
            title: "Digital Archivists",
            description: "Ensure consistency in legacy data migrations and digital preservation projects.",
            color: "bg-purple-500/10 text-purple-400",
        },
        {
            icon: GraduationCap,
            title: "Library Science Students",
            description: "Learn UNIMARC structures programmatically and build practical skills.",
            color: "bg-orange-500/10 text-orange-400",
        },
    ]

    return (
        <section id="who-needs" className="py-20 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 [font-family:var(--font-poppins)]">
                        Who Needs This?
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto [font-family:var(--font-poppins)]">
                        From librarians to developers, our API serves everyone working with UNIMARC data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {audiences.map((audience, index) => (
                        <Card
                            key={index}
                            className="bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300"
                        >
                            <CardHeader className="text-center">
                                <div
                                    className={`w-14 h-14 ${audience.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                                >
                                    <audience.icon className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-white text-lg [font-family:var(--font-poppins)]">
                                    {audience.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-white/70 text-sm leading-relaxed text-center [font-family:var(--font-poppins)]">
                                    {audience.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
