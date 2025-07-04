// src/components/chat/chat-panel.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, MessageSquareText, Loader2 } from "lucide-react"

interface ChatPanelProps {
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

export function ChatPanel({ withUserId, withUserName, currentUserId }: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const fetchHistory = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await axios.get(`http://89.28.236.11:3000/api/chat/history/${withUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessages(res.data)
        } catch (error) {
            console.error("Failed to fetch chat history:", error)
        } finally {
            setHistoryLoading(false)
            scrollToBottom()
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        const token = localStorage.getItem("token")
        if (!token) return

        setLoading(true)
        try {
            await axios.post("http://89.28.236.11:3000/api/chat/send", {
                to: withUserId,
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setMessages(prev => [
                ...prev,
                { from: currentUserId, to: withUserId, message: newMessage, timestamp: new Date().toISOString() }
            ])
            setNewMessage("")
            scrollToBottom()
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setLoading(false)
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }

    useEffect(() => {
        fetchHistory()
    }, [withUserId])

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden text-white shadow-lg">

            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#111111] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5 text-[#66b497]" />
                    <h2 className="text-lg font-semibold text-[#66b497]">
                        Chat with {withUserId === "admin" ? "Support" : withUserName}
                    </h2>
                </div>
                <span className="text-xs text-white/40">Private</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111111]">
                {historyLoading ? (
                    <div className="flex justify-center items-center h-full text-white/60">
                        <Loader2 className="animate-spin mr-2" /> Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-white/50">No messages yet.</p>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.from === currentUserId ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words shadow transition-colors ${msg.from === currentUserId
                                ? "bg-[#66b497] text-black"
                                : "bg-white/10 text-white"
                                }`}>
                                {msg.message}
                                <div className="text-xs text-gray-400 mt-1 text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#111111] flex gap-2 items-center">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="border border-white/10 bg-[#1a1a1a] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none flex-1"
                    placeholder="Type a message..."
                />
                <Button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
            </div>
        </div>
    )
}
