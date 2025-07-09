// app/subscription/success/page.tsx
'use client'

import { Suspense } from 'react'
import SuccessContent from './success-content'

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}