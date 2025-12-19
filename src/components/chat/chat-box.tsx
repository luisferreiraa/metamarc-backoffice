"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Wifi, WifiOff, RefreshCw, Send, CheckCircle, Clock } from "lucide-react"
import { getToken } from "@/lib/actions/log-actions"
import { API_BASE_URL } from "@/utils/urls"

interface ChatBoxProps {
    withUserId: string
    withUserName: string
    currentUserId: string
}

interface Message {
    id?: string
    from: string
    to: string
    message: string
    timestamp: string
    status?: "sending" | "sent" | "delivered" | "failed"
}

export function ChatBox({ withUserId, withUserName, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [wsConnected, setWsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [isReconnecting, setIsReconnecting] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [debugLogs, setDebugLogs] = useState<string[]>([])
    const ws = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectAttemptsRef = useRef(0)
    const maxReconnectAttempts = 5
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const addDebugLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        const logMessage = `[${timestamp}] ${message}`
        console.log(`[ChatDebug] ${logMessage}`)
        setDebugLogs((prev) => [...prev.slice(-19), logMessage])
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchHistory = async () => {
        const token = await getToken()
        if (!token) {
            setConnectionError("No authentication token found")
            addDebugLog("❌ No token found")
            return
        }

        try {
            addDebugLog("📥 Fetching chat history...")
            const res = await axios.get(`${API_BASE_URL}/api/chat/history/${withUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            })

            const historyMessages = res.data || []
            setMessages(historyMessages.map((msg: Message) => ({ ...msg, status: "delivered" })))
            setConnectionError(null)
            addDebugLog(`✅ Loaded ${historyMessages.length} messages from history`)
        } catch (error: any) {
            console.error("Failed to fetch chat history:", error)
            const errorMsg = error.response?.data?.message || error.message || "Failed to load history"
            setConnectionError(errorMsg)
            addDebugLog(`❌ History fetch failed: ${errorMsg}`)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) {
            addDebugLog("❌ Empty message, not sending")
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            addDebugLog("❌ No token for sending message")
            return
        }

        const messageText = newMessage.trim()
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Optimistic update
        const tempMessage: Message = {
            id: tempId,
            from: currentUserId,
            to: withUserId,
            message: messageText,
            timestamp: new Date().toISOString(),
            status: "sending",
        }

        addDebugLog(`📤 Sending message: "${messageText}" to ${withUserId}`)

        setMessages((prev) => [...prev, tempMessage])
        setNewMessage("")
        setIsSending(true)

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/chat/send`,
                {
                    to: withUserId,
                    message: messageText,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                },
            )

            addDebugLog("✅ Message sent successfully via HTTP")
            addDebugLog(`Response: ${JSON.stringify(response.data)}`)

            // Update status to 'sent'
            setMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "sent" } : msg)))

            setConnectionError(null)

            // Fallback if WebSocket doesn't deliver within 3s
            setTimeout(() => {
                setMessages((prev) => {
                    const msg = prev.find((m) => m.id === tempId)
                    if (msg && msg.status === "sent") {
                        addDebugLog("⚠️ Message not received via WebSocket after 3s, marking as delivered")
                        return prev.map((m) => (m.id === tempId ? { ...m, status: "delivered" } : m))
                    }
                    return prev
                })
            }, 3000)
        } catch (error: any) {
            console.error("Failed to send message:", error)
            const errorMsg = error.response?.data?.message || error.message || "Failed to send message"
            setConnectionError(errorMsg)
            addDebugLog(`❌ Send failed: ${errorMsg}`)

            // Mark as failed
            setMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg)))

            if (!wsConnected) {
                addDebugLog("🔄 WebSocket not connected, attempting to reconnect...")
                setupWebSocket()
            }
        } finally {
            setIsSending(false)
        }
    }

    const setupWebSocket = useCallback(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setConnectionError("No authentication token found")
            addDebugLog("❌ No token for WebSocket")
            return
        }

        // Impede duplicação se já existir uma conexão ativa ou em fase de conexão
        if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
            addDebugLog("ℹ️ WebSocket already connecting or connected")
            return
        }

        // Fecha conexão antiga caso exista e esteja num estado inesperado
        if (ws.current) {
            ws.current.close()
            ws.current = null
        }

        setIsReconnecting(true)
        setConnectionError(null)

        try {
            const protocol = window.location.protocol === "https:" ? "wss" : "ws"
            const wsUrl = `${protocol}://91.98.29.248:3000?token=${encodeURIComponent(token)}`
            addDebugLog(`🔌 Connecting to WebSocket: ${wsUrl}`)

            const socket = new WebSocket(wsUrl)
            ws.current = socket

            const connectionTimeout = setTimeout(() => {
                if (socket.readyState === WebSocket.CONNECTING) {
                    addDebugLog("⏰ WebSocket connection timeout")
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
                    addDebugLog(`📨 WebSocket message received: ${event.data}`)
                    const msg = JSON.parse(event.data)

                    const isForThisChat =
                        (msg.from === withUserId && msg.to === currentUserId) ||
                        (msg.from === currentUserId && msg.to === withUserId)

                    if (isForThisChat) {
                        setMessages((prev) => {
                            const withoutTemp = prev.filter((existingMsg) => {
                                if (existingMsg.id?.startsWith("temp-")) {
                                    return !(
                                        existingMsg.from === msg.from &&
                                        existingMsg.to === msg.to &&
                                        existingMsg.message === msg.message
                                    )
                                }
                                return true
                            })

                            const exists = withoutTemp.some(
                                (existingMsg) =>
                                    existingMsg.from === msg.from &&
                                    existingMsg.to === msg.to &&
                                    existingMsg.message === msg.message &&
                                    Math.abs(new Date(existingMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 5000
                            )

                            if (!exists) {
                                return [...withoutTemp, { ...msg, status: "delivered" }]
                            }
                            return withoutTemp
                        })
                    }
                } catch (err) {
                    addDebugLog(`❌ Error parsing WebSocket message: ${err}`)
                }
            }

            socket.onerror = () => {
                clearTimeout(connectionTimeout)
                addDebugLog("❌ WebSocket error occurred")
                setWsConnected(false)
                setIsReconnecting(false)
                setConnectionError("Connection error occurred")
            }

            socket.onclose = (event) => {
                clearTimeout(connectionTimeout)
                addDebugLog(`🔌 WebSocket closed: code=${event.code}, reason="${event.reason}", clean=${event.wasClean}`)

                setWsConnected(false)
                setIsReconnecting(false)

                let errorMessage = "Connection closed"
                if (event.code === 1000) errorMessage = "Connection closed normally"
                else if (event.code === 1008) errorMessage = "Authentication failed"
                else if (event.code === 1011) errorMessage = "Server error"
                else if (event.code === 1006) errorMessage = "Connection lost"

                setConnectionError(errorMessage)

                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++
                    const delay = Math.min(2000 * reconnectAttemptsRef.current, 10000)
                    addDebugLog(`🔄 Scheduling reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`)
                    reconnectTimeoutRef.current = setTimeout(setupWebSocket, delay)
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    addDebugLog("❌ Max reconnection attempts reached")
                    setConnectionError("Max reconnection attempts reached")
                }
            }
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
        addDebugLog("🔄 Manual reconnection triggered")
        reconnectAttemptsRef.current = 0
        setConnectionError(null)
        setupWebSocket()
    }

    const retryFailedMessage = (messageId: string) => {
        const failedMessage = messages.find((msg) => msg.id === messageId)
        if (failedMessage) {
            setNewMessage(failedMessage.message)
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
        }
    }

    const refreshHistory = () => {
        addDebugLog("🔄 Manual history refresh triggered")
        fetchHistory()
    }

    useEffect(() => {
        addDebugLog(`🚀 ChatBox mounted for user: ${currentUserId} chatting with: ${withUserId}`)
        fetchHistory()
        setupWebSocket()

        return () => {
            addDebugLog("🧹 Cleaning up WebSocket connection")
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            if (ws.current) {
                ws.current.close(1000, "Component unmounting")
            }
        }
    }, [withUserId, currentUserId, setupWebSocket])

    const getConnectionStatus = () => {
        if (isReconnecting) return { icon: <RefreshCw className="w-4 h-4 animate-spin" />, text: "Reconnecting..." }
        if (wsConnected) return { icon: <Wifi className="w-4 h-4 text-green-500" />, text: "Online" }
        return { icon: <WifiOff className="w-4 h-4 text-red-500" />, text: "Offline" }
    }

    const getMessageStatusIcon = (status?: string) => {
        switch (status) {
            case "sending":
                return <Clock className="w-3 h-3 text-gray-400" />
            case "sent":
                return <CheckCircle className="w-3 h-3 text-blue-400" />
            case "delivered":
                return <CheckCircle className="w-3 h-3 text-green-400" />
            case "failed":
                return <AlertCircle className="w-3 h-3 text-red-400" />
            default:
                return null
        }
    }

    const status = getConnectionStatus()

    return (
        <div className="fixed bottom-28 right-6 w-[400px] max-w-[95%] h-[600px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300">
            <Card className="bg-[#1a1a1a] border border-white/10 w-full h-full text-white shadow-xl flex flex-col">
                <CardHeader className="space-y-1 text-center pb-3">
                    <CardTitle className="text-xl font-semibold text-[#66b497]">
                        Chat with {withUserId === "admin" ? "Support" : withUserName}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/70 flex items-center justify-center gap-2">
                        {status.icon}
                        {status.text}
                        <Button size="sm" variant="ghost" onClick={refreshHistory} className="text-xs px-1 py-0 h-auto ml-2">
                            ↻
                        </Button>
                    </CardDescription>

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

                    <details className="text-left">
                        <summary className="text-xs text-white/50 cursor-pointer">Debug Logs ({debugLogs.length})</summary>
                        <div className="text-xs text-white/40 mt-1 max-h-32 overflow-y-auto bg-black/20 p-2 rounded">
                            {debugLogs.map((log, idx) => (
                                <div key={idx} className="font-mono">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </details>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto border border-white/10 bg-[#111111] p-3 rounded mx-4 mb-2">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-white/50">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id || idx}
                                    className={`flex ${String(msg.from) === String(currentUserId) ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="max-w-[80%]">
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm ${String(msg.from) === String(currentUserId)
                                                ? "bg-[#66b497] text-black rounded-br-sm"
                                                : "bg-white/10 text-white rounded-bl-sm"
                                                } ${msg.status === "failed" ? "border border-red-500/50" : ""}`}
                                        >
                                            {msg.message}
                                            {msg.status === "failed" && (
                                                <button
                                                    onClick={() => retryFailedMessage(msg.id!)}
                                                    className="ml-2 text-xs underline hover:no-underline"
                                                >
                                                    Retry
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${String(msg.from) === String(currentUserId)
                                                ? "justify-end"
                                                : "justify-start"}`}
                                        >
                                            <span>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                            {String(msg.from) === String(currentUserId) && getMessageStatusIcon(msg.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex space-x-2 pt-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                        className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none disabled:opacity-50"
                        placeholder={isSending ? "Sending..." : wsConnected ? "Type a message..." : "Connecting..."}
                        maxLength={500}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isSending || !newMessage.trim()}
                        className="bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4"
                    >
                        {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}