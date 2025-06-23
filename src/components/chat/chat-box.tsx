"use client"
import { useEffect, useState } from "react"
import axios from 'axios'

interface ChatMessage {
    from: string
    to: string
    message: string
    timestamp: string
}

interface ChatBoxProps {
    withUserId: string
    currentUserId: string
}

export function ChatBox({ withUserId, currentUserId }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")

    const fetchHistory = async () => {
        const res = await axios.get(`http://89.28.236.11:3000/api/chat/history/${withUserId}`)
        setMessages(res.data)
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        await axios.post("http://89.28.236.11:3000/api/chat/send", {
            to: withUserId,
            message: newMessage
        })
        setMessages(prev => [...prev, { from: currentUserId, to: withUserId, message: newMessage, timestamp: new Date().toISOString() }])
        setNewMessage("")
    }

    useEffect(() => {
        fetchHistory()
        const interval = setInterval(fetchHistory, 5000)
        return () => clearInterval(interval)
    }, [withUserId])

    return (
        <div className="p-4 border rounded max-w-md">
            <div className="h-64 overflow-y-auto bg-gray-100 mb-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-2 ${msg.from === currentUserId ? 'text-right' : 'text-left'}`}>
                        <span className="text-sm">{msg.message}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-grow border p-2 rounded"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    )
}