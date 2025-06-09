"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"

interface User {
    name: string
}

interface Log {
    id: string
    userId: string
    user: User
    action: string
    ip: string
    userAgent: string
    createdAt: string
}

export function SystemLogsManagement() {
    const [logs, setLogs] = useState<Log[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const [page, setPage] = useState(1)
    const [limit] = useState(20)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedLogIds, setSelectedLogIds] = useState<string[]>([])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    useEffect(() => {
        fetchLogs()
    }, [page, debouncedSearchTerm])

    const fetchLogs = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")

            // Construir query string dinamicamente
            const params = new URLSearchParams()
            params.append("page", String(page))
            params.append("limit", String(limit))
            if (searchTerm) {
                params.append("action", debouncedSearchTerm)
            }

            const response = await fetch(`http://89.28.236.11:3000/api/admin/logs?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setLogs(data.data || [])
                setTotalPages(data.meta.pages || 1)
                setSelectedLogIds([])
            } else {
                console.error("Failed to fetch logs:", response.status)
            }
        } catch (error) {
            console.error("Error loading system logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(1)
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    const toggleSelectLog = (logId: string) => {
        setSelectedLogIds((prevSelected) =>
            prevSelected.includes(logId)
                ? prevSelected.filter((id) => id !== logId)
                : [...prevSelected, logId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedLogIds.length === logs.length) {
            setSelectedLogIds([])
        } else {
            setSelectedLogIds(logs.map((log) => log.id))
        }
    }

    const handleDeleteSelected = async () => {
        if (selectedLogIds.length === 0) return

        if (!window.confirm(`Are you sure you want to delete ${selectedLogIds.length} log(s)?`)) {
            return
        }

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(`http://89.28.236.11:3000/api/admin/logs`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: selectedLogIds }),
            })

            if (response.ok) {
                await fetchLogs()
                setSelectedLogIds([])
            } else {
                console.error("Failed to delete logs:", response.status)
            }
        } catch (error) {
            console.error("Error deleting logs:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-gray-600">Loading system logs...</p>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">System Logs</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>List of System Logs</CardTitle>
                        <CardDescription>Manage all system logs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by action or IP..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="max-w-sm"
                            />
                        </div>

                        <div className="flex justify-end mb-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteSelected}
                                disabled={selectedLogIds.length === 0}
                            >
                                Delete selected ({selectedLogIds.length})
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <input
                                            type="checkbox"
                                            checked={selectedLogIds.length === logs.length && logs.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>IP</TableHead>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={selectedLogIds.includes(log.id)}
                                                onChange={() => toggleSelectLog(log.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{log.user.name}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.ip}</TableCell>
                                        <TableCell>{log.userAgent}</TableCell>
                                        <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
                                Previous
                            </Button>
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}