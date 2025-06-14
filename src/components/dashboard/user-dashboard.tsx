"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, User, LogOut, RefreshCw } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface UserData {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
    apiKey: string
    apiKeyExpiresAt: string
    createdAt: string
}

export function UserDashboard() {
    const [user, setUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token")
            const userData = localStorage.getItem("user")

            if (!token || !userData) {
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch("http://89.28.236.11:3000/api/auth/get-api-key", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const apiData = await response.json()
                    const parsedUser = JSON.parse(userData)

                    // Combina os dados do localStorage com os dados do backend
                    setUser({
                        ...parsedUser,
                        apiKey: apiData.apiKey,
                        apiKeyExpiresAt: apiData.apiKeyExpiresAt,
                    })
                } else {
                    console.error("Failed to fetch API key")
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }

            setIsLoading(false)
        }

        fetchUserData()
    }, [])

    const handleRenewApiKey = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://89.28.236.11:3000/api/apiKey/renew-api-key", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser((prev) => (prev ? { ...prev, apiKey: data.apiKey } : null))
            }
        } catch (error) {
            console.error("Error renovating API Key:", error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <div>User not found</div>
    }

    console.log(user)

    return (

        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="text-lg">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-lg">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tier</p>
                                    <Badge variant="secondary">{user.tier}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant={user.isActive ? "default" : "destructive"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                API Key
                            </CardTitle>
                            <CardDescription>Use this key to access the API</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">{user.apiKey}</div>
                            <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">{user.apiKeyExpiresAt ? new Date(user.apiKeyExpiresAt).toLocaleString() : "N/A"}</div>
                            <Button onClick={handleRenewApiKey} variant="outline" className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renovate API Key
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}