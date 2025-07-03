// src/lib/actions/log-actions.ts
"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export type Log = {
    id: string
    userId: string
    action: string
    ip: string
    userAgent: string
    createdAt: string
    user: {
        id: string
        email: string
        name: string
    }
}

interface LogsResponse {
    data: Log[]
    meta: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export interface GetLogsParams {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
    action?: string
    userId?: string
    ip?: string
    orderBy?: "createdAt"
    order?: "asc" | "desc"
}

// Schema de validação para eliminar logs
const deleteLogSchema = z.object({
    logId: z.string().min(1, "Log ID is required")
})

const bulkDeleteByIdsSchema = z.object({
    ids: z.array(z.string()).min(1, "At least one ID is required"),
})

const bulkDeleteByFilterSchema = z.object({
    beforeDate: z.string().optional(),
    action: z.string().optional(),
    userId: z.string().optional(),
    ip: z.string().optional(),
})

// Estado genérico de uma ação, usado para devolução de sucesso ou erros
export type ActionState = {
    success?: boolean
    error?: string
    fieldErrors?: Record<string, string[]>
    deletedCount?: number
}

// Função assíncrona para ler o token do cookie
export async function getToken() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        return token || ""      // Se não existir token, devolve string vazia
    } catch (error) {
        return ""
    }
}

// Busca todos os logs disponíveis
export async function getLogs(params: GetLogsParams = {}): Promise<LogsResponse> {
    try {
        const {
            page = 1,
            limit = 10,
            startDate = "",
            endDate = "",
            action = "",
            userId = "",
            ip = "",
            orderBy = "createdAt",
            order = "desc",
        } = params

        const token = await getToken()

        const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            orderBy: String(orderBy),
            order: String(order),
        })

        if (startDate) searchParams.append("startDate", startDate)
        if (endDate) searchParams.append("endDate", endDate)
        if (action) searchParams.append("action", action)
        if (userId) searchParams.append("userId", userId)
        if (ip) searchParams.append("ip", ip)

        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/logs?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch logs")
        }

        const result = await response.json()

        // Mapeia a resposta da API para o formato esperado no frontend
        const logs = result.data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            action: item.action,
            ip: item.ip,
            userAgent: item.userAgent,
            createdAt: item.createdAt,
            user: {
                id: item.user.id,
                email: item.user.email,
                name: item.user.name,
            },
        }))

        return {
            data: logs,
            meta: result.meta,
        }
    } catch (error) {
        console.error("Error fetching logs:", error)
        throw new Error("Failed to load logs")
    }
}

// Função helper para processar search term
export async function getLogsWithSearch(params: GetLogsParams & { search?: string }): Promise<LogsResponse> {
    const { search, ...otherParams } = params

    // Se há um termo de busca, aplica para action
    if (search && search.trim()) {
        return await getLogs({ ...otherParams, action: search })
    }

    return await getLogs(otherParams)
}

// Deletar um log específico
export async function deleteLog(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = deleteLogSchema.safeParse({
            logId: formData.get("logId"),
        })

        if (!validatedFields.success) {
            return {
                error: "Invalid log ID format",
            }
        }

        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/logs/${validatedFields.data.logId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to delete log")
        }

        revalidatePath("/admin/logs")
        return { success: true }
    } catch (error) {
        console.error("Error deleting log:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete log",
        }
    }
}

// Deletar múltiplos logs por IDs
export async function bulkDeleteLogsByIds(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const idsString = formData.get("ids") as string
        const ids = JSON.parse(idsString)

        const validatedFields = bulkDeleteByIdsSchema.safeParse({ ids })

        if (!validatedFields.success) {
            return {
                error: "Invalid IDs format",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/logs/bulk-delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: validatedFields.data.ids }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to delete logs")
        }

        const result = await response.json()

        revalidatePath("/admin/logs")
        return {
            success: true,
            deletedCount: result.deletedCount,
        }
    } catch (error) {
        console.error("Error bulk deleting logs:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete logs",
        }
    }
}

// Deletar logs por filtro
export async function bulkDeleteLogsByFilter(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = bulkDeleteByFilterSchema.safeParse({
            beforeDate: formData.get("beforeDate") || undefined,
            action: formData.get("action") || undefined,
            userId: formData.get("userId") || undefined,
            ip: formData.get("ip") || undefined,
        })

        if (!validatedFields.success) {
            return {
                error: "Invalid filter format",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        const searchParams = new URLSearchParams()
        Object.entries(validatedFields.data).forEach(([key, value]) => {
            if (value) searchParams.append(key, value)
        })

        const response = await fetch(
            `${process.env.API_BASE_URL}/api/admin/logs/bulk-delete-filter?${searchParams.toString()}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to delete logs")
        }

        const result = await response.json()

        revalidatePath("/admin/logs")
        return {
            success: true,
            deletedCount: result.deletedCount,
        }
    } catch (error) {
        console.error("Error bulk deleting logs by filter:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete logs",
        }
    }
}
