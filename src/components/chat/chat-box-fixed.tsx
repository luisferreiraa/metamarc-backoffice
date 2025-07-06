"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface ChatBoxProps {
    withUserId: string
    withUserName: string
    currentUserId: string
}

interface Message {
    from: string
    to: string
    message: string
    timestamp: string
}

export function ChatBoxFixed({ withUserId, withUserName, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [wsConnected, setWsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [isReconnecting, setIsReconnecting] = useState(false)
    const ws = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectAttemptsRef = useRef(0)
    const maxReconnectAttempts = 5
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchHistory = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            return
        }

        try {
            const res = await axios.get(`http://89.28.236.11:3000/api/chat/history/${withUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            })
            setMessages(res.data || [])
            setConnectionError(null)
        } catch (error: any) {
            console.error("Failed to fetch chat history:", error)
            const errorMsg = error.response?.data?.message || error.message || "Failed to load history"
            setConnectionError(errorMsg)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            return
        }

        try {
            await axios.post(
                "http://89.28.236.11:3000/api/chat/send",
                {
                    to: withUserId,
                    message: newMessage.trim(),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                },
            )
            setNewMessage("")
            setConnectionError(null)
        } catch (error: any) {
            console.error("Failed to send message:", error)
            const errorMsg = error.response?.data?.message || error.message || "Failed to send message"
            setConnectionError(errorMsg)

            // Se não estiver conectado via WebSocket, tentar reconectar
            if (!wsConnected) {
                setupWebSocket()
            }
        }
    }

    const setupWebSocket = useCallback(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            return
        }

        // Se já está conectado, não fazer nada
        if (ws.current?.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected")
            return
        }

        // Fechar conexão existente
        if (ws.current) {
            ws.current.close()
            ws.current = null
        }

        setIsReconnecting(true)
        setConnectionError(null)

        try {
            const wsUrl = `ws://89.28.236.11:3000?token=${encodeURIComponent(token)}`
            console.log("Connecting to WebSocket:", wsUrl)

            const socket = new WebSocket(wsUrl)

            // Timeout para conexão (10 segundos)
            const connectionTimeout = setTimeout(() => {
                if (socket.readyState === WebSocket.CONNECTING) {
                    console.log("WebSocket connection timeout")
                    socket.close()
                    setConnectionError("Connection timeout")
                    setIsReconnecting(false)
                }
            }, 10000)

            socket.onopen = () => {
                clearTimeout(connectionTimeout)
                console.log("WebSocket connected successfully")
                setWsConnected(true)
                setIsReconnecting(false)
                setConnectionError(null)
                reconnectAttemptsRef.current = 0
            }

            socket.onmessage = (event) => {
                try {
                    console.log("WebSocket message received:", event.data)
                    const msg = JSON.parse(event.data)

                    // Verificar se a mensagem é para este chat
                    if (
                        (msg.from === withUserId && msg.to === currentUserId) ||
                        (msg.from === currentUserId && msg.to === withUserId)
                    ) {
                        setMessages((prev) => {
                            // Evitar duplicatas
                            const exists = prev.some(
                                (existingMsg) =>
                                    existingMsg.from === msg.from &&
                                    existingMsg.to === msg.to &&
                                    existingMsg.message === msg.message &&
                                    Math.abs(new Date(existingMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000,
                            )

                            if (!exists) {
                                return [...prev, msg]
                            }
                            return prev
                        })
                    }
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err)
                }
            }

            socket.onerror = (error) => {
                clearTimeout(connectionTimeout)
                console.error("WebSocket error:", error)
                setWsConnected(false)
                setIsReconnecting(false)
                setConnectionError("Connection error occurred")
            }

            socket.onclose = (event) => {
                clearTimeout(connectionTimeout)
                console.log("WebSocket closed:", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                })

                setWsConnected(false)
                setIsReconnecting(false)

                // Mapear códigos de erro para mensagens mais claras
                let errorMessage = "Connection closed"
                switch (event.code) {
                    case 1000:
                        errorMessage = "Connection closed normally"
                        break
                    case 1008:
                        errorMessage = "Authentication failed"
                        break
                    case 1011:
                        errorMessage = "Server error"
                        break
                    case 1006:
                        errorMessage = "Connection lost"
                        break
                    default:
                        errorMessage = `Connection closed (${event.code})`
                }

                setConnectionError(errorMessage)

                // Reconectar automaticamente se não foi fechamento normal
                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++
                    const delay = Math.min(2000 * reconnectAttemptsRef.current, 10000)

                    console.log(`Scheduling reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`)

                    reconnectTimeoutRef.current = setTimeout(() => {
                        setupWebSocket()
                    }, delay)
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    setConnectionError("Max reconnection attempts reached")
                }
            }

            ws.current = socket
        } catch (error) {
            console.error("Error creating WebSocket:", error)
            setConnectionError("Failed to create connection")
            setIsReconnecting(false)
        }
    }, [withUserId, currentUserId])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const manualReconnect = () => {
        console.log("Manual reconnection triggered")
        reconnectAttemptsRef.current = 0
        setConnectionError(null)
        setupWebSocket()
    }

    // Cleanup function
    const cleanup = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
        }

        if (ws.current) {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.close(1000, "Component cleanup")
            }
            ws.current = null
        }
    }, [])

    useEffect(() => {
        console.log("ChatBox mounted for user:", withUserId)
        fetchHistory()
        setupWebSocket()

        return cleanup
    }, [withUserId, currentUserId, setupWebSocket, cleanup])

    const getConnectionStatus = () => {
        if (isReconnecting) return { icon: <RefreshCw className="w-4 h-4 animate-spin" />, text: "Reconnecting..." }
        if (wsConnected) return { icon: <Wifi className="w-4 h-4 text-green-500" />, text: "Online" }
        return { icon: <WifiOff className="w-4 h-4 text-red-500" />, text: "Offline" }
    }

    const status = getConnectionStatus()

    return (
        <div className="fixed bottom-28 right-6 w-[400px] max-w-[95%] h-[500px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300">
            <Card className="bg-[#1a1a1a] border border-white/10 w-full h-full text-white shadow-xl flex flex-col">
                {/* Header */}
                <CardHeader className="space-y-1 text-center pb-3">
                    <CardTitle className="text-xl font-semibold text-[#66b497]">
                        Chat with {withUserId === "admin" ? "Support" : withUserName}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/70 flex items-center justify-center gap-2">
                        {status.icon}
                        {status.text}
                    </CardDescription>

                    {/* Error Banner */}
                    {connectionError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span className="text-xs text-red-400 flex-1 text-left">{connectionError}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={manualReconnect}
                                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 h-auto"
                            >
                                Retry
                            </Button>
                        </div>
                    )}
                </CardHeader>

                {/* Chat Content */}
                <CardContent className="flex-1 overflow-y-auto border border-white/10 bg-[#111111] p-3 rounded mx-4 mb-2">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-white/50">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.from === currentUserId ? "justify-end" : "justify-start"}`}>
                                    <div className="max-w-[80%]">
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm ${msg.from === currentUserId
                                                    ? "bg-[#66b497] text-black rounded-br-sm"
                                                    : "bg-white/10 text-white rounded-bl-sm"
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <div
                                            className={`text-xs text-gray-500 mt-1 ${msg.from === currentUserId ? "text-right" : "text-left"}`}
                                        >
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </CardContent>

                {/* Input Footer */}
                <CardFooter className="flex space-x-2 pt-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!wsConnected}
                        className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none disabled:opacity-50"
                        placeholder={wsConnected ? "Type a message..." : "Connecting..."}
                        maxLength={500}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!wsConnected || !newMessage.trim()}
                        className="bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4"
                    >
                        Send
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
