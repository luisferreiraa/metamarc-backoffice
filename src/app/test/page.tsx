"use client"

import { ChatBoxFixed } from "../../components/chat/chat-box-fixed"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatTestPage() {
    const [showChat, setShowChat] = useState(false)
    const [currentUserId, setCurrentUserId] = useState("")
    const [withUserId, setWithUserId] = useState("admin")
    const [withUserName, setWithUserName] = useState("Support")

    useEffect(() => {
        // Simular um ID de usuário baseado no token ou gerar um aleatório
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setCurrentUserId(payload.userId || "user-" + Math.random().toString(36).substr(2, 9))
            } catch {
                setCurrentUserId("user-" + Math.random().toString(36).substr(2, 9))
            }
        } else {
            setCurrentUserId("user-" + Math.random().toString(36).substr(2, 9))
        }
    }, [])

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-center">Chat Test</h1>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Chat Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Your User ID</label>
                        <Input value={currentUserId} onChange={(e) => setCurrentUserId(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Chat with User ID</label>
                        <Input value={withUserId} onChange={(e) => setWithUserId(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Chat with User Name</label>
                        <Input value={withUserName} onChange={(e) => setWithUserName(e.target.value)} />
                    </div>
                    <Button onClick={() => setShowChat(!showChat)} className="w-full">
                        {showChat ? "Hide Chat" : "Show Chat"}
                    </Button>
                </CardContent>
            </Card>

            {showChat && currentUserId && (
                <ChatBoxFixed withUserId={withUserId} withUserName={withUserName} currentUserId={currentUserId} />
            )}

            <div className="text-center text-sm text-gray-500 space-y-2">
                <p>Make sure you have a valid JWT token in localStorage</p>
                <p>Current User ID: {currentUserId}</p>
                <p>
                    Chatting with: {withUserId} ({withUserName})
                </p>
            </div>
        </div>
    )
}
