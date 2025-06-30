// Interface que define a estrutura esperada 
export interface Stats {
    totalUsers: number,
    activeUsers: number,
    inactiveUsers: number,
    byTier: Record<string, number>,
    byRole: Record<string, number>,
    payingUsers: number
}