// app/api/subscription/status/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const backendUrl = `${process.env.BACKEND_URL}/subscription/status`

        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': request.headers.get('Authorization') || ''
            }
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