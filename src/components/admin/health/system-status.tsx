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

export function SystemStatusCheck() {

    const [result, setResult] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    useEffect(() => {
        // Faz o teste automático ao carregar a página
        handleHealthCheck()
    }, [])

    const handleHealthCheck = async () => {
        /* const token = localStorage.getItem("token") */
        const token = getToken()
        setIsLoading(true)
        setResult(null)

        try {
            const response = await fetch("http://89.28.236.11:3000/api/admin/health", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setResult(`✅ API is functional. Response: ${JSON.stringify(data, null, 2)}`)
            } else {
                setResult(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (error) {
            setResult(`❌ Connection error: ${error}`)
        } finally {
            setIsLoading(false)
            setLastChecked(new Date())
        }
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            System Health Check
                        </h2>
                    </div>

                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                        Status Tool
                    </Badge>
                </div>

                {/* Card de Status */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-white">API Connection Test</CardTitle>
                            <CardDescription className="text-white/70">
                                Verify if your backend API is responsive.
                            </CardDescription>
                        </div>
                        <div className="p-2 bg-[#66b497]/10 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-[#66b497]" />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Botões */}
                        <div className="flex items-center gap-4 flex-wrap">
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

                            {lastChecked && (
                                <span className="text-sm text-white/60">
                                    Last checked: {lastChecked.toLocaleTimeString()}
                                </span>
                            )}
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
        </DashboardLayout>
    )
}
