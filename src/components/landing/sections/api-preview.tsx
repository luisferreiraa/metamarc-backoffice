"use client"

import { Button } from "@/components/ui/button"
import { Copy, Code } from "lucide-react"

export function ApiPreview() {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <section id="api-preview" className="bg-black py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 [font-family:var(--font-poppins)]">
                        Preview the <span className="text-[#66b497]">Metamarc API</span>
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-white/80 max-w-3xl mx-auto [font-family:var(--font-poppins)]">
                        A real look into the request and response structure. Fast, clear, and developer-friendly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 text-white font-mono">
                    {/* Request */}
                    <div className="bg-[#111] p-6 rounded-2xl relative border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-[#66b497]" />
                                <h3 className="text-white text-sm font-semibold tracking-wide uppercase [font-family:var(--font-poppins)]">
                                    API Request
                                </h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white"
                                onClick={() =>
                                    copyToClipboard("curl -X GET 'https://api.unimarc.dev/fields/245'")
                                }
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <pre className="text-[#66b497] whitespace-pre-wrap text-sm leading-relaxed">
                            {`curl -X GET \\
  'https://api.unimarc.dev/fields/245'`}
                        </pre>
                    </div>

                    {/* Response */}
                    <div className="bg-[#111] p-6 rounded-2xl relative border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-[#66b497]" />
                                <h3 className="text-white text-sm font-semibold tracking-wide uppercase [font-family:var(--font-poppins)]">
                                    API Response
                                </h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white"
                                onClick={() =>
                                    copyToClipboard(`{
  "tag": "245",
  "name": "Title and Statement of Responsibility",
  "repeatable": false,
  "mandatory": true,
  "subfields": [
    {
      "code": "a",
      "name": "Title",
      "repeatable": false,
      "mandatory": true
    },
    {
      "code": "b",
      "name": "Remainder of title",
      "repeatable": false,
      "mandatory": false
    }
  ]
}`)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <pre className="whitespace-pre-wrap text-white text-sm leading-relaxed">
                            {`{
  "tag": "245",
  "name": "Title and Statement of Responsibility",
  "repeatable": false,
  "mandatory": true,
  "subfields": [
    {
      "code": "a",
      "name": "Title",
      "repeatable": false,
      "mandatory": true
    },
    {
      "code": "b",
      "name": "Remainder of title",
      "repeatable": false,
      "mandatory": false
    }
  ]
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    )
}
