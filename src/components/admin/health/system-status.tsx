// src/components/admin/health/system-status.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "../../layout/loading-spinner"
import { getToken } from "@/lib/actions/log-actions"

// Componente principal para verificação do status do sistema
export function SystemStatusCheck() {

    const [result, setResult] = useState<string | null>(null)       // Armazena o resultado da verificação
    const [isLoading, setIsLoading] = useState(false)       // Controla o estado do carregamento
    const [lastChecked, setLastChecked] = useState<Date | null>(null)       // Armazena quando foi a última verificação

    // Executa o health check automaticamente ao carregar o componente
    useEffect(() => {
        handleHealthCheck()
    }, [])      // Array de dependências vazio = executa apenas no mount

    // Função assíncrona para lidar com o health check
    const handleHealthCheck = async () => {
        const token = getToken()        // Obtém o token de autenticação
        setIsLoading(true)      // Ativa o estado do carregamento
        setResult(null)     // Limpa resultados anteriores

        try {
            // Faz a requisição para o endpoint da API
            const response = await fetch("http://89.28.236.11:3000/api/admin/health", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,       // Inclui o token no header
                },
            })

            if (response.ok) {
                // Se a resposta for OK, processa os dados
                const data = await response.json()
                setResult(`✅ API is functional. Response: ${JSON.stringify(data, null, 2)}`)
            } else {
                // Se houver erro na resposta, mostra o status
                setResult(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (error) {
            // Captura erros de conexão
            setResult(`❌ Connection error: ${error}`)
        } finally {
            // Executa sempre, caso seja sucesso ou falhe
            setIsLoading(false)     // Desativa o loading
            setLastChecked(new Date())      // Atualiza o timestamp da última verificação
        }
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Botão de voltar */}
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        {/* Título da página */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            System Health Check
                        </h2>
                    </div>

                    {/* Badge indicativo */}
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                        Status Tool
                    </Badge>
                </div>

                {/* Card principal com o teste de conexão */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-white">API Connection Test</CardTitle>
                            <CardDescription className="text-white/70">
                                Verify if your backend API is responsive.
                            </CardDescription>
                        </div>
                        {/* Ícone decorativo */}
                        <div className="p-2 bg-[#66b497]/10 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-[#66b497]" />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Secção de Botões */}
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Botão principal para executar o teste */}
                            <Button
                                onClick={handleHealthCheck}
                                disabled={isLoading}
                                className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                        Run Health Check
                                    </>
                                )}
                            </Button>

                            {/* Exibe quando foi a última verificação */}
                            {lastChecked && (
                                <span className="text-sm text-white/60">
                                    Last checked: {lastChecked.toLocaleTimeString()}
                                </span>
                            )}
                        </div>

                        {/* Exibe os resultados do teste */}
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
        </DashboardLayout>
    )
}
