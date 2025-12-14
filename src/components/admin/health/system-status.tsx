// src/components/admin/health/system-status.tsx

/**
 * @fileoverview This file defines a React component for the Admin
 * dashboard that allows a user to manually run a health check against the backend API
 * and displays the status and response. It uses client-side rendering hooks.
 */

"use client"        // Next.js directive indicating this is a client-side component.

import { useEffect, useState } from "react"
// Imports UI components from a custom library and Shadcn UI.
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getToken } from "@/lib/actions/log-actions"        // Utility function to retrieve the authentication token.

/**
 * @function SystemStatusCheck
 * @description A client-side component providing a UI and logic to test the API's health.
 * 
 * @returns {JSX.Element} The rendered system status check interface.
 */
export function SystemStatusCheck() {

    // State hook to store the result message from the health check (success or error).
    const [result, setResult] = useState<string | null>(null)
    // State hook to manage the loading state of the check button.
    const [isLoading, setIsLoading] = useState(false)
    // State hook to store the timestamp of the last executed check.
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    /**
     * @hook useEffect
     * @description Runs the health check automatically once when the component mounts.
     */
    useEffect(() => {
        handleHealthCheck()
    }, [])      // Empty dependency array ensures it runs only on mount.

    /**
     * @async
     * @function handleHealthCheck
     * @description Executes the asynchronous API call to the health check endpoint.
     */
    const handleHealthCheck = async () => {
        const token = getToken()        // Retrieves the JWT token for authorization.
        setIsLoading(true)
        setResult(null)

        try {
            // Performs a GET request to the specific health endpoint.
            const response = await fetch("http://89.28.236.11:3000/api/admin/health", {
                method: "GET",
                headers: {
                    // Includes the JWT token in the Authorization header.
                    Authorization: `Bearer ${token}`,
                },
            })

            // Checks if the HTTP status code is in the 200-209 range.
            if (response.ok) {
                const data = await response.json()
                setResult(`✅ API is functional. Response: ${JSON.stringify(data, null, 2)}`)
            } else {
                // Sets an error message if the API returns a non-OK status.
                setResult(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (error) {
            // Sets an error message for connection issues.
            setResult(`❌ Connection error: ${error}`)
        } finally {
            // Resets loading state and records the check time regardless of outcome.
            setIsLoading(false)
            setLastChecked(new Date())
        }
    }

    // Renders the component UI.
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            {/* Back button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="border border-white/10 text-white hover:border-[#66b497] transition-all"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2 text-[#66b497]" />
                                Back
                            </Button>
                        </Link>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            System Health Check
                        </h2>
                    </div>

                    {/* Status Tool Badge */}
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                        Status Tool
                    </Badge>
                </div>

                {/* Health Check Card */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-white">API Connection Test</CardTitle>
                            <CardDescription className="text-white/70">
                                Verify if your backend API is responsive.
                            </CardDescription>
                        </div>
                        <div className="p-2 bg-[#66b497]/10 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-[#66b497]" />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Run Check Button */}
                            <Button
                                onClick={handleHealthCheck}
                                disabled={isLoading}
                                className="bg-[#66b497] text-black hover:bg-[#5aa88b] transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        {/* Loading state with spinning icon */}
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        {/* Default state */}
                                        <ShieldCheck className="h-4 w-4 mr-2" />
                                        Run Health Check
                                    </>
                                )}
                            </Button>

                            {/* Last Checked Timestamp */}
                            {lastChecked && (
                                <span className="text-sm text-white/60">
                                    Last checked: {lastChecked.toLocaleTimeString()}
                                </span>
                            )}
                        </div>

                        {/* Result Display Alert */}
                        {result && (
                            <Alert className="bg-white/5 border border-white/10 text-white">
                                <AlertDescription>
                                    {/* Displays the result (success/error message) in a monospaced format */}
                                    <pre className="whitespace-pre-wrap text-sm [font-family:monospace] text-white/90">
                                        {result}
                                    </pre>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
