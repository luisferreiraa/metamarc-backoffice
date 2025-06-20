// src/components/auth/auth-guard.tsx

// Sugestões:
// - Tornar o guard mais seguro com JWT decoding/ expiração
// - Usar autenticação server-side (middleware + cookies HttpOnly)
// - Implementar fallback visual melhorado para UX

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "../layout/loading-spinner"

// Interface que define as props que o component AuthGuard aceita
interface AuthGuardProps {
    children: React.ReactNode       // Elementos filhos que serão renderizados se autorizado
    requiredRole?: "ADMIN" | "CLIENT"       // Role opcional que pode ser exigido para aceder à página
    fallbackPath?: string       // Caminho para redirecionamento se acesso negado
}

// Component que protege rotas com base na autenticação e permissões
export function AuthGuard({ children, requiredRole, fallbackPath = "/" }: AuthGuardProps) {
    const [isAuthorized, setIsAuthorized] = useState(false)     // Indica se o user está autorizado
    const [isLoading, setIsLoading] = useState(true)        // Indica se ainda está a verificar permissões
    const router = useRouter()      // Hook para navegação/ redirect

    useEffect(() => {
        // Função que verifica a autenticação e o role do utilizador
        const checkAuth = () => {
            const token = localStorage.getItem("token")     // Obtém o token do localStorage
            const userStr = localStorage.getItem("user")        // Obtém os dados do user (em string JSON)

            if (!token || !userStr) {
                // Se não houver token ou user, redireciona para a homepage
                router.push("/")
                return
            }

            try {
                const user = JSON.parse(userStr)        // Tenta fazer o parse do user

                // Se for necessário um role específico e o utilizador não tiver esse role
                if (requiredRole && user.role !== requiredRole) {
                    // Redireciona o CLIENT para o dashboard
                    if (user.role == "CLIENT") {
                        router.push("/dashboard")
                    } else {
                        // Se não for CLIENT, volta à homepage
                        router.push("/")
                    }
                    return
                }

                // Se chegou aqui, está autenticado e autorizado
                // Armazena token e role nos cookies (para o middleware)
                document.cookie = `token=${token}; path=/`
                document.cookie = `userRole=${user.role}; path=/`

                setIsAuthorized(true)       // Marca como autorizado
            } catch (error) {
                // Se houver um erro ao fazer parse do user, redireciona
                console.error("Error checking for authentication:", error)
                router.push("/")
            } finally {
                // Em qualquer caso, termina o carregamento
                setIsLoading(false)
            }
        }

        // Executa a verificação logo que o component monta
        checkAuth()
    }, [router, requiredRole])

    // Enquanto estiver a verificar permissões, mostra spinner de carregamento
    if (isLoading) {
        return (
            <LoadingSpinner message="Checking for permissions..." />
        )
    }

    // Se o utilizador não estiver autorizado, mostra mensagem de acesso negado
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                    <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    // Se autorizado, renderiza os elementos filhos (children)
    return <>{children}</>
}