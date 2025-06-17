// app/api/subscribe/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { tier } = await request.json()
        const backendUrl = `${process.env.BACKEND_URL}/subscribe`

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': request.headers.get('Authorization') || ''
            },
            body: JSON.stringify({ tier })
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: data.error }, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}