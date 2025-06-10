"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code } from "lucide-react"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-slate-50 to-[#FDF6F8] py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#CCC1D4] leading-tight">
                                UNIMARC Made{" "}
                                <span className="text-[#E88596] relative">
                                    Simple
                                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#F7D3DA] rounded"></div>
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Instantly Access Bibliographic & Holdings Manuals via API
                            </p>
                        </div>

                        <p className="text-lg text-slate-700 leading-relaxed">
                            Tired of digging through dense PDFs or static documents to find UNIMARC field definitions? Say hello to a
                            smarter way—programmatic access to the complete UNIMARC Bibliographic and Holdings Manuals, delivered via
                            a lightweight, easy-to-use API.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button variant={"defaultPlum"} size="lg" className="text-lg px-8 py-6">
                                    Try for free
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                View API Docs
                            </Button>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-slate-600">
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

                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-6">
                                <Code className="h-6 w-6 text-[#CCC1D4]" />
                                <span className="font-semibold text-slate-800">API Response Preview</span>
                            </div>
                            <div className="bg-[#705085] rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
                                <div className="text-[#E88596]">GET /api/fields/100</div>
                                <div className="mt-2 text-white">
                                    {`{
  "tag": "100",
  "name": "General Processing Data",
  "repeatable": false,
  "mandatory": true,
  "subfields": [
    {
      "code": "a",
      "name": "General processing data",
      "repeatable": false
    }
  ]
}`}
                                </div>
                            </div>
                        </div>
                        {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-[blue-100] rounded-full opacity-50"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-slate-100 rounded-full opacity-30"></div> */}
                    </div>
                </div>
            </div>
        </section>
    )
}