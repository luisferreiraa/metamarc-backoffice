import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    // Se já estiver autenticado, redirecionar para o dashboard
    // Esta lógica é implementada pelo sistema de auth

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full space-y-8">
                <LoginForm />
            </div>
        </div>
    )
}