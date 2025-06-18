// app/subscription/success/page.tsx
'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    if (!sessionId) return

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Subscrição Bem-sucedida!</h1>
            <p className="text-lg mb-8">
                Obrigado por assinar nosso serviço. Sua subscrição foi ativada com sucesso.
            </p>
            <a
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                Ir para o Dashboard
            </a>
        </div>
    )
}