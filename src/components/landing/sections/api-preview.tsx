"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ApiPreview() {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <section id="api-preview" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">See It In Action</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Clean, structured data that integrates seamlessly with your existing workflows.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Request Example */}
                        <Card className="border-2 border-gray-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Code className="h-5 w-5 text-blue-600" />
                                        <CardTitle className="text-lg">API Request</CardTitle>
                                    </div>
                                    <Badge variant="secondary">GET</Badge>
                                </div>
                                <CardDescription>Simple HTTP requests to get field specifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-900 rounded-lg p-4 relative">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                        onClick={() => copyToClipboard("curl -X GET 'https://api.unimarc.dev/fields/245'")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <code className="text-green-400 text-sm">
                                        <div className="text-blue-300">curl -X GET \</div>
                                        <div className="ml-2">'https://api.unimarc.dev/fields/245'</div>
                                    </code>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Response Example */}
                        <Card className="border-2 border-gray-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Code className="h-5 w-5 text-green-600" />
                                        <CardTitle className="text-lg">API Response</CardTitle>
                                    </div>
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                        JSON
                                    </Badge>
                                </div>
                                <CardDescription>Structured, machine-readable field definitions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-900 rounded-lg p-4 relative overflow-x-auto">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
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
}`)
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <code className="text-white text-sm">
                                        <pre className="whitespace-pre-wrap">{`{
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
}`}</pre>
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-12 text-center">
                        <Card className="bg-blue-50 border-blue-200 max-w-2xl mx-auto">
                            <CardContent className="pt-6">
                                <blockquote className="text-lg text-slate-700 italic mb-4">
                                    "This solves a pain point we've had for years! No more hunting through PDF manuals during cataloging
                                    sessions."
                                </blockquote>
                                <div className="text-sm text-slate-600">
                                    <strong>— Future Beta User</strong>
                                    <div>Senior Cataloging Librarian</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}