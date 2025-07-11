// src/lib/actions/user-actions.ts
"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Interface para representar os dados do utilizador
export interface User {
    id: string
    email: string
    name: string
    role: string
    tier: string
    apiKeyExpiresAt: string | null
    isActive: boolean
    createdAt: string
}

interface UsersResponse {
    data: User[]
    meta: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

// Pârametros de busca e filtros que corresponde ao backend
export interface GetUsersParams {
    page?: number
    limit?: number
    name?: string
    email?: string
    role?: string
    tier?: string
    isActive?: string
    order?: "asc" | "desc"
}

// Schema de validação para criar users
const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email({ message: "Invalid email format" }),
    role: z.enum(["ADMIN", "CLIENT"]),
    tier: z.enum(["FREE", "PRO", "PREMIUM", "ENTERPRISE"])
})

// Schema de validação para atualizar users
const updateUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email({ message: "Invalid email format" }),
    role: z.enum(["ADMIN", "CLIENT"]),
    tier: z.enum(["FREE", "PRO", "PREMIUM", "ENTERPRISE"])
})

// Schema de validação para eliminar users
const deleteUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
})

// Estado genérico de uma ação, usado para devolução de sucesso ou erros
export type ActionState = {
    success?: boolean       // Indica se a operação teve sucesso
    error?: string      // Mensagem de erro, caso ocorra
    fieldErrors?: Record<string, string[]>      // Erros específicos por campo, ex: { name: ["Name is required"] }
}

// Tipo específico para criação de User, atualmente igual a ActioState mas separado para clareza
export type CreateUserState = ActionState

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

// Buscar todos os users disponíveis
export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    try {
        const { page = 1, limit = 10, name = "", email = "", role = "", tier = "", isActive = "", order = "desc" } = params
        const token = await getToken()

        const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            order,
        })

        // Adiciona parâmetros de filtro apenas se não estiverem vaioz ou "all"
        if (name) searchParams.append("name", name)
        if (email) searchParams.append("email", email)
        if (role && role !== "all") searchParams.append("role", role)
        if (tier && tier != "all") searchParams.append("tier", tier)
        if (isActive && isActive !== "all") searchParams.append("isActive", isActive)

        const response = await fetch(`http://89.28.236.11:3000/api/admin/users?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`      // Envia token no cabeçalho para autenticação
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch users")
        }

        const result = await response.json()

        const users = result.data.map((item: any) => ({
            id: item.id,
            email: item.email,
            name: item.name,
            role: item.role,
            tier: item.tier,
            apiKeyExpiresAt: item.apiKeyExpiresAt,
            isActive: item.isActive,
            createAt: item.createdAt,
        }))

        return {
            data: users,
            meta: result.meta
        }

    } catch (error) {
        console.error("Error fetching users:", error)
        throw new Error("Failed to load users")
    }
}

// Função helper para processar search term em name e email
export async function getUsersWithSearch(params: GetUsersParams & { search?: string }): Promise<UsersResponse> {
    const { search, ...otherParams } = params

    // Se há um termo de busca, aplica tanto para name quanto email
    if (search && search.trim()) {
        // Primeiro tenta buscar por nome
        const nameResults = await getUsers({ ...otherParams, name: search })

        // Se não encontrou resultados por nome, tenta por email
        if (nameResults.data.length === 0) {
            return await getUsers({ ...otherParams, email: search })
        }

        return nameResults
    }

    return await getUsers(otherParams)
}

// Criar um novo user
export async function createUser(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
    try {
        // Validação dos campos recebidos via FormData
        const validatedFields = createUserSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            tier: formData.get("tier"),
        })

        // Se falhar a validação, devolve os erros por campo
        if (!validatedFields.success) {
            console.error("Validation errors:", validatedFields.error.flatten())
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const token = await getToken()
        if (!token) {
            throw new Error("Authentication token not found")
        }

        // Monta o corpo do pedido
        const payload = {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            role: validatedFields.data.role,
            tier: validatedFields.data.tier
        }

        // Faz pedido POST à API
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const responseText = await response.text()      // Lê resposta como texto

        if (!response.ok) {
            // Tenta converter o erro em JSON, se possível
            try {
                const errorData = JSON.parse(responseText);
                console.error("API Error:", {
                    status: response.status,
                    error: errorData
                });
                throw new Error(errorData.error || "Failed to create user")
            } catch {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        }

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Create user error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to create user",
        }
    }
}

// Atualiza um user existente
export async function updateUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = updateUserSchema.safeParse({
            userId: formData.get("userId"),
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            tier: formData.get("tier"),
        })

        if (!validatedFields.success) {
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { userId, name, email, role, tier } = validatedFields.data
        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        const updateUserResponse = await fetch(`${process.env.API_BASE_URL}/api/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                role,
                tier
            }),
        })

        if (!updateUserResponse.ok) {
            const errorData = await updateUserResponse.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to update user details")
        }

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Update error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to update user",
        }
    }
}

// Função para eliminar um user existente
export async function deleteUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const userId = String(formData.get("userId") ?? "")
        const validatedFields = deleteUserSchema.safeParse({ userId })

        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error)
            return {
                error: "Invalid user ID format"
            }
        }

        const token = await getToken()
        if (!token) {
            throw new Error("Authentication token not found")
        }

        const url = `${process.env.API_BASE_URL}/api/admin/users/${validatedFields.data.userId}`

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        const responseText = await response.text()
        console.log("Raw response:", responseText)

        if (!response.ok) {
            try {
                const errorData = JSON.parse(responseText)
                console.error("API Error Details:", {
                    status: response.status,
                    error: errorData
                });
                throw new Error(errorData.error || `Failed to archive tier (status: ${response.status})`)
            } catch {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        }
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to delete user",
        };
    }
}