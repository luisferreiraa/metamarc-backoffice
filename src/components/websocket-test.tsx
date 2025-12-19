"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function WebSocketTest() {
    const [status, setStatus] = useState<string>("Disconnected")
    const [logs, setLogs] = useState<string[]>([])
    const [serverUrl, setServerUrl] = useState("91.98.29.248:3000")
    const [token, setToken] = useState("")
    const ws = useRef<WebSocket | null>(null)

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
    }

    const testHttpConnection = async () => {
        addLog("Testing HTTP connection...")
        try {
            const response = await fetch(`http://${serverUrl}/health`, {
                method: "GET",
                mode: "cors",
            })
            if (response.ok) {
                addLog("✅ HTTP connection successful")
            } else {
                addLog(`❌ HTTP connection failed: ${response.status}`)
            }
        } catch (error) {
            addLog(`❌ HTTP connection error: ${error}`)
        }
    }

    const testWebSocketConnection = () => {
        addLog("Testing WebSocket connection...")

        if (ws.current) {
            ws.current.close()
        }

        const testToken = token || localStorage.getItem("token") || "test-token"
        const wsUrl = `ws://${serverUrl}?token=${encodeURIComponent(testToken)}`

        addLog(`Connecting to: ${wsUrl}`)

        try {
            const socket = new WebSocket(wsUrl)

            socket.onopen = (event) => {
                addLog("✅ WebSocket connection opened")
                setStatus("Connected")
                addLog(`Protocol: ${socket.protocol}`)
                addLog(`ReadyState: ${socket.readyState}`)
            }

            socket.onmessage = (event) => {
                addLog(`📨 Message received: ${event.data}`)
            }

            socket.onerror = (event) => {
                addLog(`❌ WebSocket error occurred`)
                addLog(
                    `Error details: ${JSON.stringify({
                        readyState: socket.readyState,
                        url: socket.url,
                        protocol: socket.protocol,
                    })}`,
                )
                setStatus("Error")
            }

            socket.onclose = (event) => {
                addLog(`🔌 WebSocket closed - Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`)
                setStatus("Closed")

                // Códigos de erro comuns
                switch (event.code) {
                    case 1000:
                        addLog("Normal closure")
                        break
                    case 1001:
                        addLog("Going away")
                        break
                    case 1002:
                        addLog("Protocol error")
                        break
                    case 1003:
                        addLog("Unsupported data")
                        break
                    case 1006:
                        addLog("Abnormal closure (connection lost)")
                        break
                    case 1008:
                        addLog("Policy violation (likely auth error)")
                        break
                    case 1011:
                        addLog("Server error")
                        break
                    default:
                        addLog(`Unknown close code: ${event.code}`)
                }
            }

            ws.current = socket
            setStatus("Connecting...")
        } catch (error) {
            addLog(`❌ Failed to create WebSocket: ${error}`)
            setStatus("Failed")
        }
    }

    const sendTestMessage = () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: "ping", timestamp: Date.now() })
            ws.current.send(message)
            addLog(`📤 Sent: ${message}`)
        } else {
            addLog("❌ WebSocket not connected")
        }
    }

    const clearLogs = () => {
        setLogs([])
    }

    const disconnect = () => {
        if (ws.current) {
            ws.current.close(1000, "Manual disconnect")
            ws.current = null
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    WebSocket Connection Test
                    <Badge variant={status === "Connected" ? "default" : status === "Error" ? "destructive" : "secondary"}>
                        {status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Server URL</label>
                        <Input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} placeholder="89.28.236.11:3000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Token (optional)</label>
                        <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="JWT token" type="password" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button onClick={testHttpConnection} variant="outline">
                        Test HTTP
                    </Button>
                    <Button onClick={testWebSocketConnection}>Test WebSocket</Button>
                    <Button onClick={sendTestMessage} disabled={status !== "Connected"}>
                        Send Ping
                    </Button>
                    <Button onClick={disconnect} variant="outline">
                        Disconnect
                    </Button>
                    <Button onClick={clearLogs} variant="ghost">
                        Clear Logs
                    </Button>
                </div>

                <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="text-sm font-mono space-y-1">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">No logs yet...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="whitespace-pre-wrap">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}