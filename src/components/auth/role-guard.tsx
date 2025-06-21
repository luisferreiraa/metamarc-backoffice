// src/components/auth/role-guard.tsx

// Sugestões:
// - Usar cookies ou contextos para maior segurança ou sincronização global
// - Combinar com AuthGuard para garantir login + role
// - Externalizar a função de checkUserRole para reutilizar noutros componentes

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "../layout/loading-spinner"

// Props aceites pelo component
interface RoleGuardProps {
    children: React.ReactNode       // Conteúdo protegido
    allowedRoles: string[]      // Lista de roles permitidos
    fallback?: React.ReactNode      // Elemento a renderizar caso o utilizador não tenha permissão
    mode?: "default" | "silent"     // Modo de fallback: "default" mostra mensagem, "silent" mostra nada
}

// Component que protege conteúdo com base no role do utilizador
export function RoleGuard({ children, allowedRoles, fallback, mode = "default" }: RoleGuardProps) {
    const [hasPermission, setHasPermission] = useState(false)       // Estado que indica se o user tem permissão
    const [isLoading, setIsLoading] = useState(true)        // Estado que indica se o componente ainda está a verificar permissões

    // Quando o component monta, verifica se o utilizador tem o role necessário
    useEffect(() => {
        const checkRole = () => {
            const userStr = localStorage.getItem("user")        // Lê os dados do utilizador

            if (!userStr) {
                // Se não houver user armazenado, não lê permissão
                setHasPermission(false)
                setIsLoading(false)
                return
            }

            try {
                const user = JSON.parse(userStr)        // Convertea string para objeto
                const hasRole = allowedRoles.includes(user.role)        // Verifica se o role do user está na lista permitida
                setHasPermission(hasRole)       // Atualiza o estado com base nisso
            } catch (error) {
                // Se o erro ocorre ao fazer parse, considera como sem permissão
                console.error("Error verifying role:", error)
                setHasPermission(false)
            } finally {
                // Fim do loading
                setIsLoading(false)
            }
        }

        checkRole()
    }, [allowedRoles])      // Executa sempre que a lista de roles permitidos muda

    // Enquanto está a carregar, mostra loading spinner
    if (isLoading) {
        return <LoadingSpinner />
    }

    // Se o user não tiver permissão
    if (!hasPermission) {
        // Modo silencioso: não renderiza nada
        if (mode === "silent") {
            return null
        }
        // Se houver fallback, mostra-o. Caso contrário, mostra mensagem default
        return fallback || <div>You don't have permission to access this content.</div>
    }

    // Se o user tem permissão, renderiza o conteúdo
    return <>{children}</>
}