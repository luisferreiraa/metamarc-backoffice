"use client"

import type { ReactNode } from "react"
import { Navigation } from "./navigation"
import { Footer } from "../landing/sections/footer"
import { DashboardFooter } from "../dashboard/dashboard-footer"

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Navigation />
            <div className="container mx-auto px-4 py-8 flex-grow">
                {children}
            </div>
            <div className="mt-16">
                <DashboardFooter />
            </div>
        </div>
    )
}