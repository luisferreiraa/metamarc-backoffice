export interface User {
    name: string
}

export interface UpdateUser {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
}

// Interface para representar os dados o utilizdor
export interface UserProfile {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: string
    createdAt: string
}

// Interface que define a estrutura dos dados do user
export interface UserDashboardData {
    id: string
    name: string
    email: string
    role: string
    tier: string
    isActive: boolean
    apiKey: string
    apiKeyExpiresAt: string
    createdAt: string
    requestsUsed: number
    requestsRemaining: number
    resetInSeconds: number | null
}