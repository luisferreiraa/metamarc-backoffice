// src/components/admin/user-profile.tsx

/**
 * @fileoverview This component displays the detailed profile information for a single user
 * within the Admin dashboard, fetching the user data based on the ID provided in the URL parameters.
 */

"use client"

import { useParams } from "next/navigation"     // Hook to access dynamic route parameters (e.g., user ID).
import { useEffect, useState } from "react"
import { LoadingSpinner } from "../layout/loading-spinner"
// Imports UI components.
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Imports icons for display.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Mail, UserRoundCheck, CalendarDays, ArrowLeft, UserCircle2 } from "lucide-react"
import { DashboardLayout } from "../layout/dashboard-layout"        // Main dashboard layout structure (though only applied implicitly via parent or used for fallback).
import Link from "next/link"        // For navigation.
import { fetchWithAuth } from "@/lib/fetchWithAuth"     // Utility for making authenticated API requests.
import type { UserProfile as UserProfileType } from "@/interfaces/user"     // Imports the type definition for the user profile data.

/**
 * @function UserProfile
 * @description Fetches and displays the detailed profile of a specific user.
 *
 * @returns {JSX.Element} The rendered user profile page or a loading/not found message.
 */
export function UserProfile() {
    // State to hold the fetched user data.
    const [user, setUser] = useState<UserProfileType | null>(null)
    // State to manage the loading status.
    const [loading, setLoading] = useState(true)
    // Extracts the dynamic route parameter 'id' (the user ID).
    const { id } = useParams()

    /**
     * @hook useEffect
     * @description Fetches user data from the API when the component mounts or the `id` changes.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // API call to fetch user profile using the authenticated utility.
                const data = await fetchWithAuth(`http://89.28.236.11:3000/api/admin/users/${id}`, {
                    method: "GET",
                })
                // Assuming the API returns the user object directly.
                if (data) setUser(data)
                else console.error("Failed to fetch user or no data returned")
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])        // Dependency array ensures fetch runs when the ID parameter is available/changes.

    // Display loading spinner while data is being fetched.
    if (loading) {
        return <LoadingSpinner message="Loading user profile..." />
    }

    // Display "User not found" if fetching completed but no user data was set.
    if (!user) {
        return (
            <DashboardLayout>
                <div className="text-white text-center mt-20 text-xl">User not found.</div>
            </DashboardLayout>
        )
    }

    // Main content wrapper
    return (
        <div className="container mx-auto px-4 py-20 space-y-8 font-[family-name:var(--font-poppins)]">

            {/* Header and Back Button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        {/* Button to navigate back to the users list */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="border border-white/10 text-white hover:border-[#66b497] transition-all duration-300"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 text-[#66b497]" />
                            Back
                        </Button>
                    </Link>

                    {/* User's Name as Main Title */}
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{user.name}</h1>
                </div>
            </div>

            {/* User Details Card */}
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-[#66b497]/50 transition-all duration-300 group">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Icon for User Profile */}
                            <div className="p-2 bg-[#66b497]/10 rounded-lg group-hover:bg-[#66b497]/20 transition-colors">
                                <UserCircle2 className="h-6 w-6 text-[#66b497]" />
                            </div>
                            <div>
                                <CardTitle className="text-white group-hover:text-[#66b497] transition-colors">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="text-white/70">Detailed user information</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Card Content with Key Information */}
                <CardContent className="space-y-4 pt-0">

                    {/* 1. Email */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Email:</span>
                        </div>
                        <span className="text-white/80">{user.email}</span>
                    </div>

                    {/* 2. Role */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Role:</span>
                        </div>
                        {/* Role Badge - styled differently for ADMIN */}
                        <Badge
                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                            className={user.role === "ADMIN"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.role}
                        </Badge>
                    </div>

                    {/* 3. Tier */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <UserRoundCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Tier:</span>
                        </div>
                        {/* Tier Badge - styled differently for PREMIUM */}
                        <Badge
                            variant={user.tier === "PREMIUM" ? "default" : "outline"}
                            className={user.tier === "PREMIUM"
                                ? "bg-[#66b497]/10 text-[#66b497] border border-[#66b497]/50"
                                : "bg-white/10 text-white/80 border border-white/20"}
                        >
                            {user.tier}
                        </Badge>
                    </div>

                    {/* 4. Status (isActive) */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Status:</span>
                        </div>
                        {/* Displays Active/Inactive status with color coding. Note: `user.isActive` is treated as a string "1" or "0" based on usage */}
                        <span className={user.isActive === "1" ? "text-green-500" : "text-red-500"}>
                            {user.isActive === "1" ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* 5. Creation Date */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#66b497]" />
                            <span className="text-white">Created at:</span>
                        </div>
                        {/* Formats and displays the creation date */}
                        <span className="text-white/80">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
