"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function SystemStatusCheck() {
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">System Status Check</h1>
                    </div>
                </div>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>API Connection Test</CardTitle>
                        <CardDescription>Check if the API is responding correctly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Button onClick={testApiConnection} disabled={isLoading}>
                                Test Health Check
                            </Button>
                            <Button onClick={testLoginEndpoint} disabled={isLoading} variant="outline">
                                Test Login
                            </Button>
                        </div>

                        {result && (
                            <Alert>
                                <AlertDescription>
                                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
