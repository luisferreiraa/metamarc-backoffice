import { User } from "./user"

export interface Log {
    id: string
    userId: string
    user: User
    action: string
    ip: string
    userAgent: string
    createdAt: string
}