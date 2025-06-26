"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export function ChatBox({ withUserId, withUserName, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")

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
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        const token = localStorage.getItem("token")
        if (!token) return

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
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [withUserId])

    return (
        <div className="fixed bottom-28 right-6 w-[400px] max-w-[95%] h-[500px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300">

            <Card className="bg-[#1a1a1a] border border-white/10 w-full h-full text-white [font-family:var(--font-poppins)] shadow-xl flex flex-col">

                {/* Header */}
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold text-[#66b497]">
                        Chat with {withUserId === "admin" ? "Support" : withUserName}
                    </CardTitle>
                    <CardDescription className="text-sm text-white/70">
                        Private conversation
                    </CardDescription>
                </CardHeader>

                {/* Conteúdo do Chat */}
                <CardContent className="flex-1 space-y-4 overflow-y-auto border border-white/10 bg-[#111111] p-3 rounded">
                    {messages.length === 0 ? (
                        <p className="text-center text-white/50">No messages yet.</p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 ${msg.from === currentUserId ? "text-right" : "text-left"}`}>
                                <div
                                    className={`inline-block px-3 py-1 rounded-lg text-sm ${msg.from === currentUserId
                                        ? "bg-[#66b497] text-black"
                                        : "bg-white/10 text-white"
                                        }`}
                                >
                                    {msg.message}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>

                {/* Campo de escrita e botão */}
                <CardFooter className="flex space-x-2 mt-auto">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="border border-white/10 bg-[#111111] text-white placeholder-white/30 focus:border-[#66b497] focus:ring-[#66b497] focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-[#66b497] hover:bg-[#5aa287] text-black font-semibold transition-colors"
                    >
                        Send
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}