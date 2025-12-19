// src/app/api/auth/register/route.ts

// Sugestões:
// - Validação de Dados antes da chamada à API
// - Segurança Avançada, validar formato do email
// - Variáveis de Ambiente
// - Tipagem Forte

import { type NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/utils/urls"

// Define o endpoint POST para registo de users
export async function POST(request: NextRequest) {
    try {
        // Extração dos dados do corpo da requisição
        const { name, email, password } = await request.json()
        console.log("Trying to register user:", email)       // Log para debug

        // Chamada para a API externa de registo
        const apiResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",     // Define o tipo de conteúdo
            },
            body: JSON.stringify({ name, email, password }),        // Converte para JSON
        })

        console.log("API response status:", apiResponse.status)       // Log do status

        // Tratamento de respostas de erro
        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({
                message: "Error creating account"      // Fallback para mensagem padrão
            }))
            console.log("API error:", errorData)

            // Retorna erro com mesma mensagem e status da API
            return NextResponse.json({ message: errorData.message || "Error creating account" }, { status: apiResponse.status })
        }

        // Processamento de sucesso
        const data = await apiResponse.json()
        console.log("User registered successfully:", email)

        // Retorna resposta de sucesso padronizada
        return NextResponse.json({
            message: "Account created successfully",        // Mensagem amigável
            user: data.user,        // Dados do user criado
        })

    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Registration error:", error)
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 },
        )
    }
}