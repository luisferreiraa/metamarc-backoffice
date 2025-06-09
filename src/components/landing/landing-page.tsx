"use client"

import { Hero } from "./sections/hero"
import { Features } from "./sections/features"
import { WhoNeedsThis } from "./sections/who-needs-this"
import { ApiPreview } from "./sections/api-preview"
import { Waitlist } from "./sections/waitlist"
import { FAQ } from "./sections/faq"
import { Footer } from "./sections/footer"
import { Navigation } from "./sections/navigation"

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <Hero />
            <Features />
            <WhoNeedsThis />
            <ApiPreview />
            <Waitlist />
            <FAQ />
            <Footer />
        </div>
    )
}