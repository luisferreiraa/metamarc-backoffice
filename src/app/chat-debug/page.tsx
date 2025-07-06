"use client"

import { ChatBoxDebug } from "../../components/chat/chat-box-debug"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatDebugPage() {
    const [showChat, setShowChat] = useState(false)
    const [currentUserId, setCurrentUserId] = useState("")
    const [withUserId, setWithUserId] = useState("admin")
    const [withUserName, setWithUserName] = useState("Support")
    const [token, setToken] = useState("")

    useEffect(() => {
        // Tentar extrair userId do token
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            setToken(storedToken)
            try {
                const payload = JSON.parse(atob(storedToken.split(".")[1]))
                setCurrentUserId(payload.userId || "")
                console.log("Token payload:", payload)
            } catch (error) {
                console.error("Error parsing token:", error)
                setCurrentUserId("user-" + Math.random().toString(36).substr(2, 9))
            }
        } else {
            setCurrentUserId("user-" + Math.random().toString(36).substr(2, 9))
        }
    }, [])

    const saveToken = () => {
        if (token) {
            localStorage.setItem("token", token)
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setCurrentUserId(payload.userId || "")
                console.log("Token saved, payload:", payload)
            } catch (error) {
                console.error("Invalid token format:", error)
            }
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center">Chat Debug Tool</h1>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Chat Configuration & Debug</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Your User ID</label>
                            <Input value={currentUserId} onChange={(e) => setCurrentUserId(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Chat with User ID</label>
                            <Input value={withUserId} onChange={(e) => setWithUserId(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Chat with User Name</label>
                        <Input value={withUserName} onChange={(e) => setWithUserName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">JWT Token</label>
                        <div className="flex gap-2">
                            <Input
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste your JWT token here"
                                type="password"
                            />
                            <Button onClick={saveToken} variant="outline">
                                Save
                            </Button>
                        </div>
                    </div>

                    <Button onClick={() => setShowChat(!showChat)} className="w-full">
                        {showChat ? "Hide Chat" : "Show Chat"}
                    </Button>
                </CardContent>
            </Card>

            {showChat && currentUserId && (
                <ChatBoxDebug withUserId={withUserId} withUserName={withUserName} currentUserId={currentUserId} />
            )}

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <strong>Current User ID:</strong> {currentUserId}
                    </p>
                    <p>
                        <strong>Chatting with:</strong> {withUserId} ({withUserName})
                    </p>
                    <p>
                        <strong>Token present:</strong> {token ? "Yes" : "No"}
                    </p>
                    <p>
                        <strong>Instructions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Make sure you have a valid JWT token</li>
                        <li>Check the debug logs in the chat header</li>
                        <li>Watch the browser console for detailed logs</li>
                        <li>Messages should appear immediately when sent (optimistic update)</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
