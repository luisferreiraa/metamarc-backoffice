"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export function FAQ() {
    const faqs = [
        {
            question: "Is this the official UNIMARC API?",
            answer:
                "No—this is an independent project making the manuals more accessible to developers and librarians worldwide.",
        },
        {
            question: "Will there be a free tier?",
            answer: "Yes! Free access for low-volume users + premium tiers for heavy usage and enterprise features.",
        },
        {
            question: "Can I request specific features?",
            answer: "Absolutely. Beta users will help shape the roadmap. We're building this for the community!",
        },
        {
            question: "What formats are supported?",
            answer:
                "The API returns data in JSON by default, with XML support available. We're also considering CSV exports for bulk operations.",
        },
        {
            question: "How accurate is the data?",
            answer:
                "Our data is sourced directly from the official UNIMARC manuals and regularly updated to ensure accuracy and completeness.",
        },
        {
            question: "When will the API be available?",
            answer:
                "We're targeting a beta release in the coming months. Waitlist subscribers will get first access and exclusive updates.",
        },
    ]

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">FAQ</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">Common questions about the UNIMARC API project.</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 flex items-start space-x-2">
                                        <span className="text-blue-600 font-bold">❓</span>
                                        <span>{faq.question}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600 text-base leading-relaxed">{faq.answer}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Card className="bg-slate-50 border-slate-200 max-w-2xl mx-auto">
                        <CardContent className="pt-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Why Wait?</h3>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                Manual lookups are so last century. Automate accuracy with the first API built for UNIMARC's complex
                                specs.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}