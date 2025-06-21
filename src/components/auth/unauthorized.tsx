// src/components/auth/unauthorized.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Definição dos props
interface UnauthorizedProps {
    message?: string        // Mensagem opcional a exibir
    showBackButton?: boolean        // Controla se o botão voltar será exibido
}

// Component que mostra uma página de acesso negado
export function Unauthorized({
    message = "You don't have permission to access this page.",
    showBackButton = true,
}: UnauthorizedProps) {
    return (
        // Container que ocupa o ecrã todo, centraliza vertical e horizontalmente
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Cartão que contém o aviso de acesso negado */}
            <Card className="w-full max-w-md">
                {/* Cabeçalho do cartão com ícone, título e descrição */}
                <CardHeader className="text-center">
                    {/* Círculo com ícone de escudo (representa proteção/restrição) */}
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    {/* Título do cartão (em vermelho) */}
                    <CardTitle className="text-red-600">Access Denied</CardTitle>
                    {/* Mensagem descritiva personalizada ou default */}
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                {/* Se showBackButton for true, mostra botão de retorno */}
                {showBackButton && (
                    <CardContent className="text-center">
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}