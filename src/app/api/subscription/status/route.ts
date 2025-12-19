// app/api/subscription/status/route.ts

import { NextResponse } from 'next/server'
import { API_BASE_URL } from '@/utils/urls'

// Define o endpoint GET para verificar status de assinatura
export async function GET(request: Request) {
    try {
        // Configuração da URL do backend
        const backendUrl = `${API_BASE_URL}/api/subscription/status`

        // Faz a chamada para a API externa
        const response = await fetch(backendUrl, {
            headers: {
                // Passa o header de autenticação recebido (JWT Token)
                'Authorization': request.headers.get('Authorization') || ''
                // Fallback para string vazia se não houver token
            }
        })

        // Processa a resposta da API
        const data = await response.json()

        // Tratamento de erros da API
        if (!response.ok) {
            return NextResponse.json(
                { error: data.error },      // Retorna o erro específico da API      
                { status: response.status })        // Mantém o mesmo status code
        }

        // Retorno de sucesso
        return NextResponse.json(data)

    } catch (error) {
        // Tratamento de erros inesperados
        return NextResponse.json(
            { error: 'Internal server error' },     // Mensagem genérica
            { status: 500 }     // Internal Server Error
        )
    }
}