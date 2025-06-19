"use client"

type LoadingSpinnerProps = {
    message?: string
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black [font-family:var(--font-poppins)]">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#66b497] border-solid mb-4"></div>
                <p className="text-white/70">{message}</p>
            </div>
        </div>
    )
}
