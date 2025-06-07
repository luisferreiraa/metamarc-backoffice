import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        console.log("Tentando registrar usuário:", email)

        // Fazer chamada para sua API real
        const apiResponse = await fetch(`http://89.28.236.11:3000/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })

        console.log("Status da resposta da API:", apiResponse.status)

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ message: "Erro ao criar conta" }))
            console.log("Erro da API:", errorData)
            return NextResponse.json({ message: errorData.message || "Erro ao criar conta" }, { status: apiResponse.status })
        }

        const data = await apiResponse.json()
        console.log("Registro bem-sucedido para:", email)

        return NextResponse.json({
            message: "Conta criada com sucesso",
            user: data.user,
        })
    } catch (error) {
        console.error("Erro no registro:", error)
        return NextResponse.json(
            { message: "Erro interno do servidor. Verifique se a API está funcionando." },
            { status: 500 },
        )
    }
}