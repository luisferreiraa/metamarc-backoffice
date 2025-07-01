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
        return token || ""
    } catch (error) {
        return ""
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
        });

        if (!validatedFields.success) {
            console.error("Validation errors:", validatedFields.error.flatten());
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const token = await getToken()
        if (!token) {
            throw new Error("Authentication token not found")
        }

        const payload = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            priceInCents: validatedFields.data.priceInCents,
            features: validatedFields.data.features || undefined
        };

        console.log("Sending payload:", payload)

        const response = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const responseText = await response.text()

        if (!response.ok) {
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

        revalidatePath("/admin/tiers")
        return { success: true }
    } catch (error) {
        console.error("Create tier error:", error)
        return {
            error: error instanceof Error ? error.message : "Failed to create tier",
        };
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
        });

        if (!validatedFields.success) {
            return {
                error: "Validation failed",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { tierId, name, description, features, priceInCents } = validatedFields.data;
        const token = await getToken()

        if (!token) {
            throw new Error("Authentication token not found");
        }

        const updateProductResponse = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/${tierId}`, {
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
        });

        if (!updateProductResponse.ok) {
            const errorData = await updateProductResponse.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to update product details")
        }

        const addPriceResponse = await fetch(`${process.env.API_BASE_URL}/api/admin/tiers/${tierId}/price`, {
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
        };
    }
}

export async function deleteTier(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const validatedFields = deleteTierSchema.safeParse({
            tierId: formData.get("tierId"),
        });

        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error)
            return {
                error: "Invalid tier ID format",
            };
        }

        const token = await getToken();
        if (!token) {
            throw new Error("Authentication token not found")
        }

        const url = `${process.env.API_BASE_URL}/api/admin/tiers/${validatedFields.data.tierId}`
        console.log("Making DELETE request to:", url)

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

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