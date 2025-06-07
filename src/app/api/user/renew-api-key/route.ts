import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
        }

        // Aqui você faria a chamada para sua API real
        const response = await fetch(`${process.env.API_BASE_URL}/apiKey/renew-api-key`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            return NextResponse.json({ message: "Erro ao renovar API Key" }, { status: response.status })
        }

        const data = await response.json()

        return NextResponse.json({
            apiKey: data.apiKey,
        })
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}