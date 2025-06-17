// app/api/subscription/subscribe/route.ts
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        // 1. Obter token CORRETAMENTE
        const token = request.cookies.get('authToken')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { error: 'Token de autenticação não encontrado' },
                { status: 401 }
            )
        }

        // 2. Ler corpo da requisição
        const { tier } = await request.json()

        // 3. Configurar chamada ao backend
        const backendUrl = "http://89.28.236.11:3000/subscription/subscribe"
        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Origin': request.nextUrl.origin // Adiciona origem para CORS
            },
            body: JSON.stringify({ tier })
        })

        // 4. Tratar resposta
        if (!backendResponse.ok) {
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