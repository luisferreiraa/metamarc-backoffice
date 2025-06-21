import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// Define a função middleware que será executada em cada requisição
export function middleware(request: NextRequest) {
    // Lista de rotas que requerem autenticação
    const protectedRoutes = ["/dashboard", "/admin"]

    // Lista de rotas exclusivas para administradores
    const adminOnlyRoutes = ["/admin"]

    // Extrai o pathname da URL (caminho da requisição)
    const { pathname } = request.nextUrl

    // Verifica se a rota atual está nas rotas protegidas
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Verifica se a rota atual é exclusiva para admin
    const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route))

    // Se for uma rota protegida
    if (isProtectedRoute) {
        // Obtém o token JWT dos cookies
        const token = request.cookies.get("token")?.value

        // Se não houver token, redireciona para a página inicial (login)
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url))
        }

        // Se for uma rota de admin
        if (isAdminRoute) {
            // Obtém a role do usuário dos cookies
            const userRole = request.cookies.get("userRole")?.value

            // Se não for admin, redireciona para o dashboard
            if (userRole !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", request.url))
            }
        }
    }

    // Se todas as verificações passarem, continua com a requisição
    return NextResponse.next()
}