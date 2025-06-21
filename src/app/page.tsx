// src/app/page.tsx

// Sugestões:
// - Pode usar middleware ou getServerSideProps para verificação adicional
// - Poderia usar framer-motion para animações mais elaboradas
// - Adicionar fallback caso o redirecionamento demore
// - Adicionar logs para debug em desenvolvimento

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  // Obtém o objeto router para manipulação de navegação
  const router = useRouter()

  // Efeito que executa quando o component é montado
  useEffect(() => {
    // Verifica se existe token de autenticação no localStorage
    const token = localStorage.getItem("token")
    // Obtém os dados do user armazenados
    const userStr = localStorage.getItem("user")

    // Se existir token e dados do user
    if (token && userStr) {
      try {
        // Tenta converter os dados do user de string para objeto
        const user = JSON.parse(userStr)

        // Redireciona com base no role do user
        if (user.role === "ADMIN") {
          router.push("/admin")   // Administradores vão para /admin
        } else {
          router.push("/dashboard")   // Os outros vão para /dashboard
        }
      } catch (error) {

        // Se houver erro na conversão, redireciona para landing page
        router.push("/landing")
      }
    } else {
      // Se não estiver logado, redireciona para landing page
      router.push("/landing")
    }
  }, [router])    // Dependência: router (executa quando router muda)

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Spinner de carregamento visual */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}
