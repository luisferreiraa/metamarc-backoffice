import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Register to access the system</p>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
}