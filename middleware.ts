import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Rotas que precisam de autenticação
    const protectedRoutes = ["/dashboard", "/admin"]
    const adminOnlyRoutes = ["/admin"]

    const { pathname } = request.nextUrl

    // Verificar se é uma rota protegida
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route))

    if (isProtectedRoute) {
        // Verificar se tem token 
        const token = request.cookies.get("token")?.value

        if (!token) {
            // Redirecionar para login se não tiver token
            return NextResponse.redirect(new URL("/", request.url))
        }

        // Para toras de admin, verificar role
        if (isAdminRoute) {
            const userRole = request.cookies.get("userRole")?.value

            if (userRole !== "ADMIN") {
                // Redirecionar para dashboard se não for admin
                return NextResponse.redirect(new URL("/dashboard", request.url))
            }
        }
    }

    return NextResponse.next()
}