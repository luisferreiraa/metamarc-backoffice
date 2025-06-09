"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export function Waitlist() {
    const [email, setEmail] = useState("")
    const [useCase, setUseCase] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubmitted(true)
        setIsLoading(false)
    }

    if (isSubmitted) {
        return (
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <Card className="border-2 border-green-200 bg-green-50">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-800 mb-4">You're on the list!</h3>
                                <p className="text-green-700 mb-6">
                                    Thanks for joining our waitlist. We'll notify you as soon as the API is ready for beta testing.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/register">
                                        <Button>Create Account Now</Button>
                                    </Link>
                                    <Button variant="outline">Share with Colleagues</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Rocket className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            🚀 Coming Soon: Subscribe for Early Access!
                        </h2>
                        <p className="text-xl text-slate-600 mb-2">
                            Be the first to try the API when it launches. Get updates, use cases, and exclusive beta access.
                        </p>
                        <p className="text-lg text-slate-500">📩 Drop your email below to join the waitlist!</p>
                    </div>

                    <Card className="border-2 border-blue-200 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center space-x-2">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <span>Join the Waitlist</span>
                            </CardTitle>
                            <CardDescription>(We respect your privacy. No spam, just UNIMARC magic.)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="text-center"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="useCase">What's your use case? (Optional)</Label>
                                    <Select value={useCase} onValueChange={setUseCase}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your primary use case" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cataloging">Library Cataloging</SelectItem>
                                            <SelectItem value="development">Software Development</SelectItem>
                                            <SelectItem value="research">Academic Research</SelectItem>
                                            <SelectItem value="migration">Data Migration</SelectItem>
                                            <SelectItem value="validation">Data Validation</SelectItem>
                                            <SelectItem value="education">Education/Training</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Joining..." : "Join Waitlist"}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-slate-600 mb-4">Already have an account?</p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/" className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register" className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}