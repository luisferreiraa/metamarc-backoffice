import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  // Se já estiver autenticado, redirecionar para o dashboard
  // Esta lógica é implementada pelo sistema de auth

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">API Backoffice</h2>
          <p className="mt-2 text-sm text-gray-600">Login to access the dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
