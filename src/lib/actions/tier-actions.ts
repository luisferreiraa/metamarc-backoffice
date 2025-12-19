// src/lib/actions/tier-actions.ts
"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { API_BASE_URL } from "@/utils/urls"

// Schema de validação para criar tiers
const createTierSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.number().min(0, "Price must be positive"),
    features: z.string().optional(),
})

// Schema de validação para atualizar tiers
const updateTierSchema = z.object({
    tierId: z.string().min(1, "Tier ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.number().min(0, "Price must be positive"),
    features: z.string().optional(),
})

// Schema de validação para eliminar tiers
const deleteTierSchema = z.object({
    tierId: z.string().min(1, "Tier ID is required"),
})

// Estado genérico de uma ação, usado para devolução de sucesso ou erros
export type ActionState = {
    success?: boolean       // Indica se a operação teve sucesso
    error?: string      // Mensagem de erro, caso ocorra
    fieldErrors?: Record<string, string[]>      // Erros específicos por campo, ex: { name: ["Name is required"] }
}

// Tipo específico para criação de Tier, atualmente igual a ActioState mas separado para clareza
export type CreateTierState = ActionState

// Definição do formato de dados de um Tier, ral como recebido da API
export type Tier = {
    id: string
    active: boolean
    created: number
    description: string
    name: string
    prices: {
        id: string
        active: boolean
        currency: string
        unit_amount: number
    }[]
    metadata: {
        features?: string
    }
    priceInCents?: number
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

// Busca todos os tiers disponíveis
export async function getTiers(): Promise<Tier[]> {
    try {

        const token = getToken()        // Obtém o token JWT do cookie
        const response = await fetch(`${API_BASE_URL}/api/admin/tiers/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`      // Envia token no cabeçalho para autenticação
            },
            cache: "no-store",      // Desativa o cache para garantir dados atualizados
        })

        if (!response.ok) {
            throw new Error("Failed to fetch tiers")
        }

        const data = await response.json()

        // Mapeia a resposta da API para o formato esperado no frontend
        return data.map((item: any) => ({
            id: item.product.id,
            active: item.product.active,
            created: item.product.created,
            description: item.product.description,
            name: item.product.name,
            prices: item.prices,
            metadata: item.product.metadata,
        }))
    } catch (error) {
        console.error("Error fetching tiers:", error)
        throw new Error("Failed to load tiers")
    }
}

// Cria um novo tier
export async function createTier(prevState: CreateTierState, formData: FormData): Promise<CreateTierState> {
    try {
        // Validação dos campos recebidos via FormData
        const validatedFields = createTierSchema.safeParse({
            name: formData.get("name"),
            description: formData.get("description"),
            priceInCents: Number(formData.get("priceInCents")),     // Converte para número
            features: formData.get("features"),
        })

        // Se falhar a validação, devolve os erros por campo
        if (!validatedFields.success) {
            console.error("Validation errors:", validatedFields.error.flatten());
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const token = await getToken()
        if (!token) {
            throw new Error("Authentication token not found")       // Sem token, não se prossegue
        }

        // Monta o corpo do pedido
        const payload = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            priceInCents: validatedFields.data.priceInCents,
            features: validatedFields.data.features || undefined
        }

        console.log("Sending payload:", payload)

        // Faz o pedido POST à API
        const response = await fetch(`${API_BASE_URL}/api/admin/tiers/`, {
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
                throw new Error(errorData.error || "Failed to create tier")
            } catch {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        }

        revalidatePath("/admin/tiers")      // Atualiza a página do frontend para refletir as mudanças
        return { success: true }
    } catch (error) {
        console.error("Create tier error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to create tier",
        };
    }
}

// Atualiza um tier existente
export async function updateTier(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = updateTierSchema.safeParse({
            tierId: formData.get("tierId"),
            name: formData.get("name"),
            description: formData.get("description"),
            priceInCents: Number(formData.get("priceInCents")),
            features: formData.get("features"),
        })

        if (!validatedFields.success) {
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { tierId, name, description, features, priceInCents } = validatedFields.data
        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found")
        }

        // Primeiro, atualiza nome, descrição e features do produto
        const updateProductResponse = await fetch(`${API_BASE_URL}/api/admin/tiers/${tierId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                newName: name,
                newDescription: description,
                features: features || ""
            }),
        })

        if (!updateProductResponse.ok) {
            const errorData = await updateProductResponse.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to update product details")
        }

        // Depois, adiciona o novo preço
        const addPriceResponse = await fetch(`${API_BASE_URL}/api/admin/tiers/${tierId}/price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                priceInCents: priceInCents
            }),
        });

        if (!addPriceResponse.ok) {
            const errorData = await addPriceResponse.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to update price")
        }

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        console.error("Update error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to update tier",
        }
    }
}

// Função para eliminar (arquivar) um tier
export async function deleteTier(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = deleteTierSchema.safeParse({
            tierId: formData.get("tierId"),
        })

        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error)
            return {
                error: "Invalid tier ID format",
            }
        }

        const token = await getToken()
        if (!token) {
            throw new Error("Authentication token not found")
        }

        const url = `${API_BASE_URL}/api/admin/tiers/${validatedFields.data.tierId}`
        console.log("Making DELETE request to:", url)

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

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        console.error("Archive tier error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to archive tier",
        };
    }
}