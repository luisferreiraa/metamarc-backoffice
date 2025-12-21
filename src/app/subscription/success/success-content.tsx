// app/subscription/success/success-content.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  if (!sessionId) return null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-lg p-8 max-w-md text-center space-y-6 [font-family:var(--font-poppins)]">

        <CheckCircle2 className="h-16 w-16 text-[#66b497] mx-auto mb-4" />

        <h1 className="text-3xl lg:text-3xl font-bold text-white">
          Subscription confirmed!
        </h1>

        <p className="text-white/70 text-base">
          Thank you for choosing our service. Your subscription has been successfully activated.
        </p>

        <Link href="https://metamarc.online/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}