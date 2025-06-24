"use client"
import { useEffect, useState } from "react"
import axios from "axios"

interface ChatBoxProps {
    withUserId: string
    currentUserId: string
}

interface Message {
    from: string
    to: string
    message: string
    timestamp: string
}

export function ChatBox({ withUserId, currentUserId }: ChatBoxProps) {
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
        <div className="border p-4 rounded bg-white max-w-md">
            <div className="h-48 overflow-y-scroll mb-2 border p-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-1 ${msg.from === currentUserId ? "text-right" : "text-left"}`}>
                        <span className="block text-sm">{msg.message}</span>
                        <span className="block text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow border px-2 py-1 rounded mr-2"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="px-4 py-1 bg-blue-500 text-white rounded">
                    Send
                </button>
            </div>
        </div>
    )
}