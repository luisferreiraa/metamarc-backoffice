// src/components/auth/login-form.tsx

// Sugestões:
// - Validar email antes do submit
// - Usar cookies HttpOnly em vez de localStorage

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)       // Estado para indicar se está a carregar
    const [error, setError] = useState("")      // Estado para armazenar mensagens de erro
    const [formData, setFormData] = useState({      // Estado do form (email e password)
        email: "",
        password: "",
    })

    // Função chamada quando o form é submetido
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()      // Evita recarregamento da página
        setIsLoading(true)      // Ativa estado de loading
        setError("")        // Limpa erros anteriores

        try {
            // Envia requisição POST para a tora de login da API
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),     // Envia email e password
            })

            if (response.ok) {
                const data = await response.json()

                // Armazenar token e dados do utilizador no localStorage
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Redireciona com base no role
                if (data.user.role === "ADMIN") {
                    window.location.href = "/admin"
                } else {
                    window.location.href = "/dashboard"
                }
            } else {
                // Caso haja erro, tenta obter a mensagem personalizada
                const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
                setError(errorData.message || "Login error")
            }
        } catch (err) {
            // Erro de rede ou falha na ligação
            console.error("Connection error:", err)
            setError("Connection error. Please check if the server is running and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Atualiza o estado do form sempre que o utilizador escreve no input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <Card className="bg-[#1a1a1a] border border-white/10 w-full max-w-md text-white [font-family:var(--font-poppins)] shadow-xl">
            {/* Cabeçalho do cartão */}
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-semibold text-[#66b497]">Login</CardTitle>
                <CardDescription className="text-sm text-white/70">
                    Enter your credentials to access the system
                </CardDescription>
            </CardHeader>

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                    {error && (
                        <Alert variant="destructive" className="border border-red-500 bg-red-500/10 text-white">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Campo de email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>

                    {/* Campo de password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>
                </CardContent>

                {/* Rodapé do cartão (botão e link) */}
                <CardFooter className="flex flex-col space-y-5 mt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors"
                    >
                        {/* Mostra spinner enquanto carrega */}
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>

                    {/* Link para a página de registo */}
                    <p className="text-sm text-center text-white/70">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#66b497] hover:underline hover:text-[#80cbb1] transition-colors">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
