import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full space-y-8">
                <RegisterForm />
            </div>
        </div>
    )
}