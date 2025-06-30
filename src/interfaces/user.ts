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