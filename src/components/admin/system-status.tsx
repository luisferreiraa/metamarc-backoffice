"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LoadingSpinner } from "../layout/loading-spinner"

export function SystemStatusCheck() {
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Simular carregamento da página
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false)
        }, 1000) // ou 1500ms se quiseres um delay mais visível

        return () => clearTimeout(timeout)
    }, [])

    const testApiConnection = async () => {

        const token = localStorage.getItem("token")

        setIsLoading(true)
        setResult("")

        try {
            // Testar conexão direta com a API
            const response = await fetch("http://89.28.236.11:3000/api/admin/health", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (response.ok) {
                const data = await response.json()
                setResult(`✅ API está funcionando! Resposta: ${JSON.stringify(data, null, 2)}`)
            } else {
                setResult(`❌ API retornou erro ${response.status}: ${response.statusText}`)
            }
        } catch (error) {
            setResult(`❌ Erro de conexão: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    const testLoginEndpoint = async () => {

        setIsLoading(true)
        setResult("")

        try {
            // Testar endpoint de login através da nossa API interna
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "test@example.com",
                    password: "123456",
                }),
            })

            const data = await response.json()
            setResult(`Status: ${response.status}\nResposta: ${JSON.stringify(data, null, 2)}`)
        } catch (error) {
            setResult(`❌ Erro: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <LoadingSpinner message="Loading health check..." />
        )
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-6 bg-black">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white [font-family:var(--font-poppins)]">
                            System Status Check
                        </h1>
                    </div>
                </div>

                {/* Card de Testes */}
                <div className="flex items-center justify-center">
                    <Card className="w-full bg-[#1a1a1a] border border-white/10 hover:border-[#66b497] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white [font-family:var(--font-poppins)]">
                                API Connection Test
                            </CardTitle>
                            <CardDescription className="text-white/70">
                                Check if the API is responding correctly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Botões */}
                            <div className="flex gap-4 flex-wrap">
                                <Button
                                    onClick={testApiConnection}
                                    disabled={isLoading}
                                    className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-all"
                                >
                                    Test Health Check
                                </Button>
                                <Button
                                    onClick={testLoginEndpoint}
                                    disabled={isLoading}
                                    variant="outline"
                                    className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                                >
                                    Test Login
                                </Button>
                            </div>

                            {/* Resultado */}
                            {result && (
                                <Alert className="bg-white/5 border border-white/10 text-white">
                                    <AlertDescription>
                                        <pre className="whitespace-pre-wrap text-sm [font-family:monospace] text-white/90">
                                            {result}
                                        </pre>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )

}
