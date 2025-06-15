"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative bg-black py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight [font-family:var(--font-poppins)]">
                                UNIMARC Made{" "}
                                <span className="text-[#66b497] relative [font-family:var(--font-poppins)]">
                                    Simple
                                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#66b497] rounded"></div>
                                </span>
                            </h1>
                            <p className="mt-5 text-lg text-white leading-relaxed [font-family:var(--font-poppins)]">
                                Instantly Access Bibliographic & Holdings Manuals via API
                            </p>
                        </div>

                        <p className="text-slate-700 leading-relaxed text-white">
                            Tired of digging through dense PDFs or static documents to find UNIMARC field definitions? Say hello to a
                            smarter way—programmatic access to the complete UNIMARC Bibliographic and Holdings Manuals, delivered via
                            a lightweight, easy-to-use API.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button variant="main" className="px-8 py-6 [font-family:var(--font-poppins)]">
                                    Try free
                                </Button>
                            </Link>
                            <Button variant="outline" className="px-8 py-6 [font-family:var(--font-poppins)]">
                                Contact sales
                            </Button>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-white">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Free Tier Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>JSON/XML Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full h-[400px] lg:h-[500px]">
                        <Image
                            src="/images/unimarc-hero.png"
                            alt="Unimarc Illustration"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}