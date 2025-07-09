"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export function FAQ() {
    const faqs = [
        {
            question: "Is this the official UNIMARC API?",
            answer:
                "No, this is an independent project aimed at enhancing accessibility for developers and librarians worldwide.",
        },
        {
            question: "Is there a free tier?",
            answer: "Absolutely. Free access is available for low-volume users, with premium options for heavy usage and enterprise needs.",
        },
        {
            question: "Can I request specific features?",
            answer: "Certainly. Beta users will help shape the roadmap. We're commited to community-driven development!",
        },
        {
            question: "What formats are supported?",
            answer:
                "The API returns data in JSON by default, with XML support also available. CSV exports for bulk operations are under consideration.",
        },
        {
            question: "How accurate is the data?",
            answer:
                "Data is sourced directly from official UNIMARC manuals, ensuring ongoing accuracy and completeness.",
        },
        {
            question: "Is the API available?",
            answer:
                "Yes, the UNIMARC API is live and ready to use. Start building today and gain instant access to the complete bibliographic and holdings manuals via a simple, developer-friendly interface.",
        },
    ]

    return (
        <section id="faq" className="py-20 bg-black text-white [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-[#66b497]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="h-8 w-8 text-[#66b497]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 [font-family:var(--font-poppins)]">FAQ</h2>
                    <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto [font-family:var(--font-poppins)]">
                        Common questions about the Metamarc API project.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="bg-zinc-900 border border-zinc-800 hover:border-[#66b497] transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white flex items-start space-x-2">
                                        <span className="text-[#66b497] font-bold">❓</span>
                                        <span>{faq.question}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                                        {faq.answer}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
