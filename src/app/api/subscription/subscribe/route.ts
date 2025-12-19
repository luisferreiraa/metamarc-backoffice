// app/api/subscription/subscribe/route.ts

import { type NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/utils/urls'

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
                { error: 'Authentication token not found' },
                { status: 401 }     // Unauthorized
            )
        }

        // Validação dos dados
        const { tier } = await request.json()

        // Integração com backend
        const backendUrl = `${API_BASE_URL}/api/subscription/subscribe`

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
            console.error('Backend error:', errorText)

            return NextResponse.json(
                { error: 'Communication with subscription service failed' },
                { status: 502 }
            )
        }

        return NextResponse.json(await backendResponse.json())

    } catch (error) {
        console.error('Internal server error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}