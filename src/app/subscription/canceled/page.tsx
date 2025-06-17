// app/subscription/canceled/page.tsx
export default function CanceledPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Pagamento Cancelado</h1>
            <p className="text-lg mb-8">
                Você cancelou o processo de subscrição. Se foi um erro, você pode tentar novamente.
            </p>
            <a
                href="/subscription/plans"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                Ver Planos Novamente
            </a>
        </div>
    )
}