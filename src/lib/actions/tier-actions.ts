// src/lib/actions/tier-actions.ts
"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Schemas de validação
const createTierSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.number().min(0, "Price must be positive"),
    features: z.string().optional(),
})

const updateTierSchema = z.object({
    tierId: z.string().min(1, "Tier ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    priceInCents: z.number().min(0, "Price must be positive"),
    features: z.string().optional(),
})

const deleteTierSchema = z.object({
    tierId: z.string().min(1, "Tier ID is required"),
})

// Types
export type ActionState = {
    success?: boolean
    error?: string
    fieldErrors?: Record<string, string[]>
}

export type CreateTierState = ActionState

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

// Server Actions
export async function getToken() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        return token
    } catch (error) {
        console.error("Failed to get token")
    }
}

export async function getTiers(): Promise<Tier[]> {
    try {

        const token = getToken()
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to fetch tiers")
        }

        const data = await response.json()

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

export async function createTier(prevState: CreateTierState, formData: FormData): Promise<CreateTierState> {
    try {
        const validatedFields = createTierSchema.safeParse({
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

        const token = getToken()
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(validatedFields.data)
        })

        if (!response.ok) {
            throw new Error("Failed to create tier")
        }

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to create tier",
        }
    }
}

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

        const { tierId, ...updateData } = validatedFields.data

        const token = getToken()
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/${tierId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        })

        if (!response.ok) {
            throw new Error("Failed to update tier")
        }

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to update tier",
        }
    }
}

export async function deleteTier(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = deleteTierSchema.safeParse({
            tierId: formData.get("tierId"),
        })

        if (!validatedFields.success) {
            return {
                error: "Invalid tier ID",
            }
        }

        const token = getToken()
        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/${validatedFields.data.tierId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error("Failed to delete tier")
        }

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to delete tier",
        }
    }
}