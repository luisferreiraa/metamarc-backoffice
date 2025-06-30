export interface Tier {
    product: {
        id: string
        object: string
        active: boolean
        name: string
        description: string
        metadata: {
            features?: string  // Campo opcional com features separadas por ponto-e-vírgula
        }
    }
    prices: {
        id: string
        active: boolean
        currency: string
        unit_amount: number     // Preço em centimos (ex: 1000 = €10.00)
    }[]     // Array de objetos de preço (normalmente um preço por plano)
}

// Interface que descreve a estrutura de um tier a ser editado
export interface EditTierData {
    id: string
    name: string
    description: string
    priceInCents: number
}