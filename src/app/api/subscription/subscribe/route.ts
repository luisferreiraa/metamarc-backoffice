// app/api/subscription/subscribe/route.ts
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // Autenticação
        // Busca token em cookies ou headers (abordagem defensiva)
        const token = request.cookies.get('authToken')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        // Validação explícita do token
        if (!token) {
            return NextResponse.json(
                { error: 'Token de autenticação não encontrado' },
                { status: 401 }     // Unauthorized
            )
        }

        // Validação dos dados
        const { tier } = await request.json()

        // Integração com backend
        const backendUrl = "http://89.28.236.11:3000/api/subscription/subscribe"

        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,     // Token JWT
                'Content-Type': 'application/json',
                'Origin': request.nextUrl.origin        // Melhoria para CORS
            },
            body: JSON.stringify({ tier })
        })

        // Tratamento da resposta
        if (!backendResponse.ok) {
            // Tenta extrair detalhes do erro
            const errorText = await backendResponse.text()
            console.error('Erro no backend:', errorText)

            return NextResponse.json(
                { error: 'Falha na comunicação com o serviço de assinatura' },
                { status: 502 }
            )
        }

        return NextResponse.json(await backendResponse.json())

    } catch (error) {
        console.error('Erro interno:', error)
        return NextResponse.json(
            { error: 'Ocorreu um erro inesperado' },
            { status: 500 }
        )
    }
}