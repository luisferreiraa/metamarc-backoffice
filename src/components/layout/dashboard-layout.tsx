"use client"

import type { ReactNode } from "react"
import { Navigation } from "./navigation"

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    )
}