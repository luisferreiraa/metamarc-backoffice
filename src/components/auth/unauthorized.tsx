"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface UnauthorizedProps {
    message?: string
    showBackButton?: boolean
}

export function Unauthorized({ message = "You don't have permission to access this page.", showBackButton = true, }: UnauthorizedProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-red-600">Access Denied</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                {showBackButton && (
                    <CardContent className="text-center">
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}