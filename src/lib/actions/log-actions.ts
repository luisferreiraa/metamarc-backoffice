// src/lib/actions/log-actions.ts
"use server"

import { z } from "zod"     // Biblioteca para validação de dados com esquemas
import { cookies } from "next/headers"      // Para acessar cookies do servidor
import { revalidatePath } from "next/cache"     // Para revalidar caminhos após mutações

// Tipo que representa um registo de Log
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

// Interface para a resposta paginada de logs
interface LogsResponse {
    data: Log[]     // Array de logs
    meta: {     // Metadados de paginação
        total: number
        page: number
        limit: number
        pages: number
    }
}

// Parâmetros para busca de logs
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

// Validação para delete de um único log
const deleteLogSchema = z.object({
    logId: z.string().min(1, "Log ID is required")
})

// Validação para delete de múltiplos logs por IDs
const bulkDeleteByIdsSchema = z.object({
    ids: z.array(z.string()).min(1, "At least one ID is required"),     // Array com pelo menos 1 ID
})

// Validação para delete por filtro
const bulkDeleteByFilterSchema = z.object({
    beforeDate: z.string().optional(),
    action: z.string().optional(),
    userId: z.string().optional(),
    ip: z.string().optional(),
})

// Estado genérico para retorno de ações
export type ActionState = {
    success?: boolean       // Indica sucesso na operação
    error?: string      // Mensagem de erro (se houver)
    fieldErrors?: Record<string, string[]>      // Erros de validação por campo
    deletedCount?: number       // Contagem de itens apagados (para operações em massa)
}

// Obtém o token JWT dos cookies
export async function getToken() {
    try {
        const cookieStore = await cookies()     // Acessa os cookies
        const token = cookieStore.get("token")?.value       // Busca o token
        return token || ""      // Retorna token ou string vazia se não existir
    } catch (error) {
        return ""       // Em caso de erro, retorna vazio
    }
}

/**
 * Busca logs com paginação e filtros
 * @param params Parâmetros de busca e paginação
 * @returns Promise<LogResponse> Dados paginados de logs
 */
export async function getLogs(params: GetLogsParams = {}): Promise<LogsResponse> {
    try {
        // Valores padrão caso parâmetros não sejam fornecidos
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

        const token = await getToken()      // Obtém token de autenticação

        // Constrói os parâmetros de busca a URL
        const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            orderBy: String(orderBy),
            order: String(order),
        })

        // Adiciona filtros apenas se forem fornecidos
        if (startDate) searchParams.append("startDate", startDate)
        if (endDate) searchParams.append("endDate", endDate)
        if (action) searchParams.append("action", action)
        if (userId) searchParams.append("userId", userId)
        if (ip) searchParams.append("ip", ip)

        // Faz a requisição para a API
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/logs?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",      // Desativa cache para dados sempre atualizados
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
            meta: result.meta,      // Mantém os metadados de paginação
        }
    } catch (error) {
        console.error("Error fetching logs:", error)
        throw new Error("Failed to load logs")      // Propaga o erro para ser tratado 
    }
}

/**
 * Busca logs com suporte a termo de busca
 * @param params Parâmetros de busca incluindo termo de pesquisa
 * @returns Promise<LogResponse> Dados paginados de logs filtrados
 */
export async function getLogsWithSearch(params: GetLogsParams & { search?: string }): Promise<LogsResponse> {
    const { search, ...otherParams } = params

    // Se houver um termo de busca, aplica ao campo 'action'
    if (search && search.trim()) {
        return await getLogs({ ...otherParams, action: search })
    }

    return await getLogs(otherParams)
}

/**
 * Faz delete de um log específico
 * @param prevState Estado anterior da ação (usado em forms)
 * @param formData Dados do formulário contendo o ID do log
 * @returns Promise<ActionState> Resultado da operação
 */
export async function deleteLog(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        // Valida os dados do formulário
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

        // Requisição para API fazer delete do log
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

        revalidatePath("/admin/logs")       // Força recarregar a página de logs
        return { success: true }
    } catch (error) {
        console.error("Error deleting log:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete log",
        }
    }
}

/**
 * Faz delete de múltiplos logs por IDs
 * @param prevState Estado anterior da ação
 * @param formData Dados do formulário contendo array de IDs
 * @returns Promise<ActionState> Resultado com contagem de deletados
 */
export async function bulkDeleteLogsByIds(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        // Obtém os IDs do campo oculto do formulário
        const idsString = formData.get("ids") as string

        if (!idsString) {
            return {
                error: "No IDs provided",
            }
        }

        let ids: string[]
        try {
            ids = JSON.parse(idsString)     // Converte string JSON para array
        } catch (parseError) {
            console.error("Error parsing IDs:", parseError)
            return {
                error: "Invalid IDs format",
            }
        }

        // Valida os IDs
        const validatedFields = bulkDeleteByIdsSchema.safeParse({ ids })

        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error)
            return {
                error: "Invalid IDs format",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        console.log("Sending bulk delete request with IDs:", validatedFields.data.ids)

        // Requisição para API fazer delete em massa
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/logs`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: validatedFields.data.ids }),
        })

        // Tratamento detalhado da resposta
        const responseText = await response.text()
        console.log("Bulk delete response:", responseText)

        if (!response.ok) {
            try {
                const errorData = JSON.parse(responseText)
                console.error("API Error:", errorData)
                throw new Error(errorData.error || "Failed to delete logs")
            } catch {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        }

        let result
        try {
            result = JSON.parse(responseText)
        } catch {
            result = { deletedCount: 0 }
        }

        revalidatePath("/admin/logs")
        return {
            success: true,
            deletedCount: result.deletedCount || 0,     // Retorna quantos foram deleted
        }
    } catch (error) {
        console.error("Error bulk deleting logs:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete logs",
        }
    }
}

/**
 * Faz delete de logs baseado em filtros
 * @param prevState Estado anterior da ação
 * @param formData Dados do formulário com filtros
 * @returns Promise<ActionState> Resultado com contagem de deleted
 */
export async function bulkDeleteLogsByFilter(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        // Valida os filtros do formulário
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

        // Constrói os parâmetros de query
        const searchParams = new URLSearchParams()
        Object.entries(validatedFields.data).forEach(([key, value]) => {
            if (value) searchParams.append(key, value)
        })

        // Requisição para API fazer delete por filtro
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
            deletedCount: result.deletedCount,      // Retorna quantos foram deleted
        }
    } catch (error) {
        console.error("Error bulk deleting logs by filter:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete logs",
        }
    }
}
