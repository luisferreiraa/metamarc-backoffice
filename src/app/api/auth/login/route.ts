// src/app/api/auth/login/route.ts

// Sugestões:
// - Validação de Entrada, antes de fazer a requisição
// - Variáveis de Ambiente, usar .env para a URL da API
// - Implementar limitação de tentativas
// - Usar biblioteca como Winston para logs em produção
// - Definir interfaces para request/response

import { type NextRequest, NextResponse } from "next/server"

// Define uma rota POST para o endpoint /api/login
export async function POST(request: NextRequest) {
    try {
        // Extrai email e password do corpo da requisição
        const { email, password } = await request.json()

        // Log para debug (apenas em desenvolvimento)
        console.log("Tentando fazer login para:", email)

        // Fazer uma chamada para a API de autenticação externa
        const apiResponse = await fetch(`http://89.28.236.11:3000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",     // Indica que estamos a enviar JSON
            },
            body: JSON.stringify({ email, password }),      // Converte os dados para JSON
        })

        // Log do status de resposta
        console.log("Status da resposta da API:", apiResponse.status)

        // Se a resposta não for OK (status fora do 200-299)
        if (!apiResponse.ok) {
            // Tenta extrair dados de erro da resposta
            const errorData = await apiResponse.json().catch(() => ({ message: "Erro de autenticação" }))

            // Log do erro
            console.log("Erro da API:", errorData)

            // Retorna uma resposta JSON com a mensagem de erro
            return NextResponse.json(
                { message: errorData.message || "Credenciais inválidas" },      // Mensagem padrão se não houver
                { status: apiResponse.status },     // Mantém o mesmo status code da API
            )
        }

        // Se a autenticação foi bem-sucedida, extrai os dados
        const data = await apiResponse.json()
        console.log("Login bem-sucedido para:", email)

        // Retorna os dados do user e token
        return NextResponse.json({
            token: data.token,      // JWT para autenticação
            user: data.user,        // Dados do user autenticado
        })

    } catch (error) {
        // Captura qualquer erro inesperado
        console.error("Erro no login:", error)

        // Retorna uma resposta de erro genérico
        return NextResponse.json(
            { message: "Erro interno do servidor. Verifique se a API está funcionando." },
            { status: 500 },
        )
    }
}