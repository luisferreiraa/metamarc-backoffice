// src/components/auth/login-form.tsx
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const data = await response.json()

                // Armazenar token e dados do usuário
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Redirecionar baseado no role
                if (data.user.role === "ADMIN") {
                    window.location.href = "/admin"
                } else {
                    window.location.href = "/dashboard"
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
                setError(errorData.message || "Login error")
            }
        } catch (err) {
            console.error("Connection error:", err)
            setError("Connection error. Please check if the server is running and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <Card className="bg-[#1a1a1a] border border-white/10 w-full max-w-md text-white [font-family:var(--font-poppins)] shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-semibold text-[#66b497]">Login</CardTitle>
                <CardDescription className="text-sm text-white/70">
                    Enter your credentials to access the system
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                    {error && (
                        <Alert variant="destructive" className="border border-red-500 bg-red-500/10 text-white">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-5 mt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>

                    <p className="text-sm text-center text-white/70">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#66b497] hover:underline hover:text-[#80cbb1] transition-colors">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
