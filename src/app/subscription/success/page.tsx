// app/subscription/success/page.tsx
'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    /* useEffect(() => {
        if (sessionId) {
            // Você pode enviar o sessionId para seu backend para confirmar o pagamento
            axios.post('/api/subscription/confirm', { sessionId })
                .catch(error => console.error('Confirmation error:', error))
        }
    }, [sessionId]) */

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