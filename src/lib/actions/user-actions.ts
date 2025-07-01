// src/lib/actions/user-actions.ts
"use server"

// Interface para representar os dados do utilizador
export interface User {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
    createdAt: string
    lastLogin?: string
}