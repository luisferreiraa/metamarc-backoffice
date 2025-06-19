"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se já está logado
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        // Redirecionar baseado no role
        if (user.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } catch (error) {
        // Se houver erro, redirecionar para landing
        router.push("/landing")
      }
    } else {
      // Se não estiver logado, mostrar landing page
      router.push("/landing")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}
