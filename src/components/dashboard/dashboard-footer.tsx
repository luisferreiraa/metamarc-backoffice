// src/components/dashboard/dashboard-footer.tsx
"use client"

export function DashboardFooter() {
    return (
        <footer className="bg-black text-white py-16 [font-family:var(--font-poppins)]">
            <div className="container mx-auto px-4">
                <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© 2025 Metamarc API — Built by developers for the community.</p>
                    <p className="mt-1">
                        This is an independent project and is not officially affiliated with any organization.
                    </p>
                </div>
            </div>
        </footer>
    )
}
