"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestApiPage() {
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const testApiConnection = async () => {
        setIsLoading(true)
        setResult("")

        try {
            // Testar conexão direta com a API
            const response = await fetch("http://89.28.236.11:3000/api/health", {
                method: "GET",
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Teste de Conexão com a API</CardTitle>
                    <CardDescription>Verificar se a API está respondendo corretamente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button onClick={testApiConnection} disabled={isLoading}>
                            Testar Health Check
                        </Button>
                        <Button onClick={testLoginEndpoint} disabled={isLoading} variant="outline">
                            Testar Login
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
    )
}
