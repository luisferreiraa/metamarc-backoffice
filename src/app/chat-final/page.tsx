"use client"

import { ChatBoxFinal } from "../../components/chat/chat-box-final"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ChatFinalPage() {
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
            <h1 className="text-3xl font-bold text-center">Chat Final Test</h1>

            <Alert>
                <AlertDescription>
                    <strong>Diagnóstico:</strong> A mensagem está sendo enviada com sucesso via HTTP, mas não está chegando via
                    WebSocket. Isso indica que o problema está no backend - provavelmente na publicação Redis ou no listener do
                    WebSocket.
                </AlertDescription>
            </Alert>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Chat Configuration</CardTitle>
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
                <ChatBoxFinal withUserId={withUserId} withUserName={withUserName} currentUserId={currentUserId} />
            )}

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Próximos Passos para Corrigir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <strong>1. Verificar o backend:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>A mensagem está sendo salva no banco de dados?</li>
                            <li>O Redis está publicando a mensagem no canal correto?</li>
                            <li>O listener Redis está funcionando?</li>
                        </ul>
                    </div>
                    <div>
                        <strong>2. Verificar logs do servidor:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Logs da API de envio de mensagem</li>
                            <li>Logs do Redis pub/sub</li>
                            <li>Logs do WebSocket server</li>
                        </ul>
                    </div>
                    <div>
                        <strong>3. Testar Redis manualmente:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Conectar ao Redis e verificar se as mensagens estão sendo publicadas</li>
                            <li>Verificar se o padrão do canal está correto</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
