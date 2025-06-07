import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        console.log("Tentando fazer login para:", email)

        // Fazer chamada para sua API real
        const apiResponse = await fetch(`http://89.28.236.11:3000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        console.log("Status da resposta da API:", apiResponse.status)

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ message: "Erro de autenticação" }))
            console.log("Erro da API:", errorData)
            return NextResponse.json(
                { message: errorData.message || "Credenciais inválidas" },
                { status: apiResponse.status },
            )
        }

        const data = await apiResponse.json()
        console.log("Login bem-sucedido para:", email)

        return NextResponse.json({
            token: data.token,
            user: data.user,
        })
    } catch (error) {
        console.error("Erro no login:", error)
        return NextResponse.json(
            { message: "Erro interno do servidor. Verifique se a API está funcionando." },
            { status: 500 },
        )
    }
}