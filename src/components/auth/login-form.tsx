// src/ components/auth/login-form.tsx

/**
 * @fileoverview This component renders the client-side login form, handles form submission,
 * communicates with the authentication API, stores the authentication token and user data
 * in local storage upon success, and redirects the user based on their role.
 */

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"        // For navigation to the registration page.
// Imports various UI components (shadcn/ui style).
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Imports icons for loading and error states.
import { AlertCircle, Loader2 } from "lucide-react"

/**
 * @function LoginForm
 * @description Handles user login via email and password submission.
 *
 * @returns {JSX.Element} The rendered login form card.
 */
export function LoginForm() {
    // State to track if the submission is in progress.
    const [isLoading, setIsLoading] = useState(false)
    // State to store and display error messages.
    const [error, setError] = useState("")
    // State to store form input values (email and password).
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    /**
     * @async
     * @function handleSubmit
     * @description Handles the form submission event, sends credentials to the API,
     * processes the response, and manages local storage/redirection.
     *
     * @param {React.FormEvent} e - The form event object.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()      // Prevents default form submission behavior (page reload).
        setIsLoading(true)
        setError("")

        try {

            // 1. API Call to Login Endpoint
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),     // Sends email and password.
            })

            // 2. Handle Successful Login (HTTP status 200-299)
            if (response.ok) {
                const data = await response.json()

                // Store token and user data (including role) securely in local storage.
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                // Redirect based on user role.
                if (data.user.role === "ADMIN") {
                    window.location.href = "/admin"     // Redirect to admin dashboard.
                } else {
                    window.location.href = "/dashboard"     // Redirect to client dashboard.
                }
            } else {

                // 3. Handle Login Failure (e.g., 401 Unauthorized, 400 Bad Request)
                // Attempts to parse error message from the response body, falling back to a generic message.
                const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
                setError(errorData.message || "Login error")
            }
        } catch (err) {

            // 4. Handle Network/Connection Errors (e.g., server unreachable)
            console.error("Connection error:", err)
            setError("Connection error. Please check if the server is running and try again.")
        } finally {
            setIsLoading(false)     // Stops the loading indicator.
        }
    }

    /**
     * @function handleChange
     * @description Updates the `formData` state whenever an input field changes.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,        // Uses input's `name` attribute to update the corresponding state key.
        }))
    }

    // --- Component Rendering ---
    return (
        <Card className="bg-[#1a1a1a] border border-white/10 w-full max-w-md text-white [font-family:var(--font-poppins)] shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-semibold text-[#66b497]">Login</CardTitle>
                <CardDescription className="text-sm text-white/70">
                    Enter your credentials to access the system
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                    {error && (
                        <Alert variant="destructive" className="border border-red-500 bg-red-500/10 text-white">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-5 mt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>

                    <p className="text-sm text-center text-white/70">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[#66b497] hover:underline hover:text-[#80cbb1] transition-colors">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
