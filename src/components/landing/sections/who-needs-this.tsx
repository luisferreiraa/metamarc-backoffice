"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Code, Archive, GraduationCap } from "lucide-react"

export function WhoNeedsThis() {
    const audiences = [
        {
            icon: Users,
            title: "Librarians & Catalogers",
            description: "Speed up metadata creation and validation with instant field lookups.",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: Code,
            title: "Software Developers",
            description: "Build UNIMARC-compliant tools faster with programmatic access to specifications.",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Archive,
            title: "Digital Archivists",
            description: "Ensure consistency in legacy data migrations and digital preservation projects.",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: GraduationCap,
            title: "Library Science Students",
            description: "Learn UNIMARC structures programmatically and build practical skills.",
            color: "bg-orange-100 text-orange-600",
        },
    ]

    return (
        <section id="who-needs" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Who Needs This?</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        From librarians to developers, our API serves everyone working with UNIMARC data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {audiences.map((audience, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className={`w-16 h-16 ${audience.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                                >
                                    <audience.icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-lg text-slate-900">{audience.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-slate-600 leading-relaxed">{audience.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}