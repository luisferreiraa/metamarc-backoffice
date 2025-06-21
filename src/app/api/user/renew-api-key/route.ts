// src/app/api/user/renew-api-key/route.ts
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        // Extração do token
        // Remove o prefixo 'Bearer ' do header Authorization
        const token = request.headers.get("Authorization")?.replace("Bearer ", "")

        // Validação do token
        if (!token) {
            return NextResponse.json(
                { message: "Token não fornecido" },
                { status: 401 })        // HTTP 401 Unauthorized
        }

        // Chamada para o backend
        // Utiliza variável de ambiente para a URL base
        const response = await fetch(`${process.env.API_BASE_URL}/apiKey/renew-api-key`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,       // Repassa o token
                "Content-Type": "application/json",     // Indica tipo de conteúdo
            },
            // Poderia adicionar:
            // cache: 'no-store' // Para evitar cache
            // signal: AbortSignal.timeout(5000) // Timeout de 5s
        })

        // Tratamento de erros do backend
        if (!response.ok) {
            // Tenta obter mensagem de erro detalhada
            return NextResponse.json(
                { message: "Erro ao renovar API Key" },
                { status: response.status })
        }

        // Mensagem de sucesso
        const data = await response.json()

        return NextResponse.json({
            apiKey: data.apiKey,        // Nova chave API
        })
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}