// src/components/auth/register-form.tsx

// Sugestões:
// - Adicionar validação de força da password
// - Mostrar regras (mínimo 8 caracteres, número, etc)
// - Habilitar feedback em tempo real ao escrever
// - Evitar múltiplos registos com o mesmo email

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

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)       // Estado para loading
    const [error, setError] = useState("")      // Estado para mensagens de erro
    const [success, setSuccess] = useState(false)       // Estado para confirmação de sucesso
    const [formData, setFormData] = useState({      // Estado do form
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    // Função que trata o submit do form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()      // Previne reload da página
        setIsLoading(true)
        setError("")        // Limpa erros anteriores

        // Validação simples de passwords
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match")
            setIsLoading(false)
            return
        }

        try {
            // Chamada à API de registo
            const response = await fetch("http://89.28.236.11:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Envia apenas os campos necessários para o backend
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            if (response.ok) {
                // Se correr bem, mostra mensagem de sucesso
                setSuccess(true)
            } else {
                // Caso contrário, tenta extrair a mensagem de erro
                const errorData = await response.json()
                setError(errorData.message || "Error creating account")
            }
        } catch (err) {
            // Erros de rede
            setError("Connection error. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Atualiza o estado do formulário à medida que o utilizador escreve
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    // Se a criação da conta foi bem sucedida, mostra cartão de confirmação
    if (success) {
        return (
            <Card className="w-full max-w-md [font-family:var(--font-poppins)]">
                <CardHeader>
                    <CardTitle>Account created successfully!</CardTitle>
                    <CardDescription>Your account has been successfully created. Please log in to continue.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button className="w-full bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors">Go to Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    }

    // Formulário de registo
    return (
        <Card className="bg-[#1a1a1a] border border-white/10 w-full max-w-md text-white [font-family:var(--font-poppins)] shadow-xl">
            {/* Cabeçalho com título e descrição */}
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-semibold text-[#66b497]">Create Account</CardTitle>
                <CardDescription className="text-sm text-white/70">Fill in the details to create your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                    {error && (
                        <Alert variant="destructive" className="border border-red-500 bg-red-500/10 text-white">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Campo: Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>

                    {/* Campo: Email */}
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

                    {/* Campo: Password */}
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

                    {/* Campo: Confirmar Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>
                </CardContent>

                {/* Rodapé com botão e link para login */}
                <CardFooter className="flex flex-col space-y-5 mt-4">
                    <Button type="submit" className="w-full bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>

                    <div className="text-center text-sm text-white/70">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#66b497] hover:underline hover:text-[#80cbb1] transition-colors">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

