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

export function ChatBoxImproved({ withUserId, withUserName, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [wsConnected, setWsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [isReconnecting, setIsReconnecting] = useState(false)
    const [debugInfo, setDebugInfo] = useState<string[]>([])
    const ws = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectAttemptsRef = useRef(0)
    const maxReconnectAttempts = 3

    const addDebugLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        console.log(`[WebSocket Debug] ${message}`)
        setDebugInfo((prev) => [...prev.slice(-9), `[${timestamp}] ${message}`])
    }

    // Verificar se o servidor está acessível
    const checkServerHealth = async () => {
        try {
            addDebugLog("Checking server health...")
            const response = await fetch("http://89.28.236.11:3000/health", {
                method: "GET",
                mode: "cors",
                timeout: 5000,
            } as any)

            if (response.ok) {
                addDebugLog("✅ Server is accessible via HTTP")
                return true
            } else {
                addDebugLog(`❌ Server HTTP error: ${response.status}`)
                return false
            }
        } catch (error) {
            addDebugLog(`❌ Server not accessible: ${error}`)
            return false
        }
    }

    const fetchHistory = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            addDebugLog("❌ No token found in localStorage")
            return
        }

        try {
            addDebugLog("Fetching chat history...")
            const res = await axios.get(`http://89.28.236.11:3000/api/chat/history/${withUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            })
            setMessages(res.data)
            setConnectionError(null)
            addDebugLog(`✅ Loaded ${res.data.length} messages`)
        } catch (error: any) {
            console.error("Failed to fetch chat history:", error)
            const errorMsg = error.response?.data?.message || error.message || "Unknown error"
            setConnectionError(`Failed to load chat history: ${errorMsg}`)
            addDebugLog(`❌ History fetch failed: ${errorMsg}`)
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
            addDebugLog("Sending message...")
            await axios.post(
                "http://89.28.236.11:3000/api/chat/send",
                {
                    to: withUserId,
                    message: newMessage,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                },
            )
            setNewMessage("")
            setConnectionError(null)
            addDebugLog("✅ Message sent successfully")
        } catch (error: any) {
            console.error("Failed to send message:", error)
            const errorMsg = error.response?.data?.message || error.message || "Unknown error"
            setConnectionError(`Failed to send message: ${errorMsg}`)
            addDebugLog(`❌ Send failed: ${errorMsg}`)

            if (!wsConnected) {
                setupWebSocket()
            }
        }
    }

    const setupWebSocket = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            addDebugLog("❌ No token for WebSocket connection")
            return
        }

        // Verificar se já existe uma conexão ativa
        if (ws.current?.readyState === WebSocket.OPEN) {
            addDebugLog("WebSocket already connected")
            return
        }

        // Verificar saúde do servidor primeiro
        const serverHealthy = await checkServerHealth()
        if (!serverHealthy) {
            setConnectionError("Server is not accessible")
            return
        }

        // Fechar conexão existente se houver
        if (ws.current) {
            ws.current.close()
            ws.current = null
        }

        setIsReconnecting(true)
        setConnectionError(null)

        try {
            // Usar sempre ws:// para teste (você pode mudar para wss:// se necessário)
            const wsUrl = `ws://89.28.236.11:3000?token=${encodeURIComponent(token)}`

            addDebugLog(`Attempting WebSocket connection to: ${wsUrl}`)

            const socket = new WebSocket(wsUrl)

            // Timeout para conexão
            const connectionTimeout = setTimeout(() => {
                if (socket.readyState === WebSocket.CONNECTING) {
                    addDebugLog("❌ Connection timeout")
                    socket.close()
                    setConnectionError("Connection timeout")
                    setIsReconnecting(false)
                }
            }, 10000)

            socket.onopen = () => {
                clearTimeout(connectionTimeout)
                addDebugLog("✅ WebSocket connected successfully")
                setWsConnected(true)
                setIsReconnecting(false)
                setConnectionError(null)
                reconnectAttemptsRef.current = 0
            }

            socket.onmessage = (event) => {
                try {
                    addDebugLog(`📨 Message received: ${event.data}`)
                    const msg = JSON.parse(event.data)

                    if (
                        (msg.from === withUserId && msg.to === currentUserId) ||
                        (msg.from === currentUserId && msg.to === withUserId)
                    ) {
                        setMessages((prev) => [...prev, msg])
                        addDebugLog("✅ Message added to chat")
                    } else {
                        addDebugLog("ℹ️ Message not for this chat")
                    }
                } catch (err) {
                    addDebugLog(`❌ Error parsing message: ${err}`)
                    setConnectionError("Error processing message")
                }
            }

            socket.onerror = (error) => {
                clearTimeout(connectionTimeout)
                addDebugLog(`❌ WebSocket error occurred`)
                addDebugLog(`Error details: readyState=${socket.readyState}, url=${socket.url}`)

                setConnectionError("Connection error occurred")
                setWsConnected(false)
                setIsReconnecting(false)
            }

            socket.onclose = (event) => {
                clearTimeout(connectionTimeout)
                addDebugLog(`🔌 WebSocket closed: code=${event.code}, reason="${event.reason}", clean=${event.wasClean}`)

                setWsConnected(false)
                setIsReconnecting(false)

                // Mapear códigos de erro
                let errorMessage = `Connection closed (${event.code})`
                switch (event.code) {
                    case 1008:
                        errorMessage = "Authentication failed - check your token"
                        break
                    case 1011:
                        errorMessage = "Server error occurred"
                        break
                    case 1006:
                        errorMessage = "Connection lost unexpectedly"
                        break
                    case 1000:
                        errorMessage = "Connection closed normally"
                        break
                }

                setConnectionError(errorMessage)

                // Tentar reconectar se não foi fechamento normal
                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++
                    const delay = Math.min(2000 * reconnectAttemptsRef.current, 10000)

                    addDebugLog(`Scheduling reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`)

                    reconnectTimeoutRef.current = setTimeout(() => {
                        setupWebSocket()
                    }, delay)
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    addDebugLog("❌ Max reconnection attempts reached")
                    setConnectionError("Max reconnection attempts reached")
                }
            }

            ws.current = socket
        } catch (error) {
            addDebugLog(`❌ Error creating WebSocket: ${error}`)
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
        addDebugLog("Manual reconnection triggered")
        reconnectAttemptsRef.current = 0
        setConnectionError(null)
        setupWebSocket()
    }

    useEffect(() => {
        addDebugLog("Component mounted, initializing...")
        fetchHistory()
        setupWebSocket()

        return () => {
            addDebugLog("Component unmounting, cleaning up...")
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }

            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.close(1000, "Component unmounting")
            }
        }
    }, [withUserId, currentUserId, setupWebSocket])

    const getConnectionStatus = () => {
        if (isReconnecting) return { icon: <RefreshCw className="w-4 h-4 animate-spin" />, text: "Reconnecting..." }
        if (wsConnected) return { icon: <Wifi className="w-4 h-4 text-green-500" />, text: "Online" }
        return { icon: <WifiOff className="w-4 h-4 text-red-500" />, text: "Offline" }
    }

    const status = getConnectionStatus()

    return (
        <div className="fixed bottom-28 right-6 w-[400px] max-w-[95%] h-[500px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300">
            <Card className="bg-[#1a1a1a] border border-white/10 w-full h-full text-white [font-family:var(--font-poppins)] shadow-xl flex flex-col">
                {/* Header */}
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold text-[#66b497]">
                        Chat with {withUserId === "admin" ? "Support" : withUserName}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/70 flex items-center justify-center gap-2">
                        {status.icon}
                        {status.text}
                    </CardDescription>

                    {/* Error Banner */}
                    {connectionError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-400 flex-1">{connectionError}</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={manualReconnect}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Debug Info */}
                    {debugInfo.length > 0 && (
                        <details className="text-left">
                            <summary className="text-xs text-white/50 cursor-pointer">Debug Info</summary>
                            <div className="text-xs text-white/40 mt-1 max-h-20 overflow-y-auto">
                                {debugInfo.map((log, idx) => (
                                    <div key={idx}>{log}</div>
                                ))}
                            </div>
                        </details>
                    )}
                </CardHeader>

                {/* Chat Content */}
                <CardContent className="flex-1 space-y-4 overflow-y-auto border border-white/10 bg-[#111111] p-3 rounded">
                    {messages.length === 0 ? (
                        <p className="text-center text-white/50">No messages yet.</p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 ${msg.from === currentUserId ? "text-right" : "text-left"}`}>
                                <div
                                    className={`inline-block px-3 py-1 rounded-lg text-sm max-w-[80%] ${msg.from === currentUserId ? "bg-[#66b497] text-black" : "bg-white/10 text-white"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                            </div>
                        ))
                    )}
                </CardContent>

                {/* Input Footer */}
                <CardFooter className="flex space-x-2 mt-auto">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!wsConnected}
                        className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none disabled:opacity-50"
                        placeholder={wsConnected ? "Type a message..." : "Connecting..."}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!wsConnected || !newMessage.trim()}
                        className="bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
