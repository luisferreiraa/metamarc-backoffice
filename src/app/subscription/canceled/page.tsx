import { Button } from "@/components/ui/button";
import { ArrowLeft, Link, XCircle } from "lucide-react";

// app/subscription/canceled/page.tsx
export default function CanceledPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-lg p-8 max-w-md text-center space-y-6 [font-family:var(--font-poppins)]">

                <XCircle className="h-16 w-16 text-red mx-auto mb-4" />

                <h1 className="text-3xl lg:text-3xl font-bold text-white">
                    Payment Canceled!
                </h1>

                <p className="text-white/70 text-base">
                    You canceled the subscription process. If it was a mistake, try again.
                </p>

                <Link href="/subscription/plans">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                        Back to Subscription Plans
                    </Button>
                </Link>
            </div>
        </div>
    )
}