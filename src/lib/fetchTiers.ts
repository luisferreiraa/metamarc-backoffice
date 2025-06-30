// src/lib/fetchTiers.ts
import { Tier } from '../interfaces/stripe-tier'

// Função que retorna o array de tiers ordenado
export const fetchTiers = async (): Promise<Tier[] | null> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("No token found for fetching tiers")
            return null
        }

        const response = await fetch("http://89.28.236.11:3000/api/admin/tiers", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch tiers, status: ${response.status}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            // Ordena por preço crescente
            return data.sort((a, b) => {
                const priceA = a.prices[0]?.unit_amount || 0
                const priceB = b.prices[0]?.unit_amount || 0
                return priceA - priceB
            })
        } else {
            console.error("Tiers API did not return an array:", data)
            return null
        }
    } catch (err) {
        console.error("Error fetching tiers:", err)
        return null
    }
}