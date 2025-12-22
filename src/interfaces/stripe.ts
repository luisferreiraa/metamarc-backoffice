interface StripeCustomer {
    email: string
    name: string
    created: number
}

interface Subscription {
    id: string
    status: string
    currentPeriodEnd: number
    cancelAtPeriodEnd: boolean
}

interface Invoice {
    id: string
    amount_paid: number
    status: string
    created: number
    hosted_invoice_url: string
}

interface PaymentMethod {
    id: string
    card?: {
        brand?: string
        last4?: string
        exp_month?: number
        exp_year?: number
    }
}

export interface StripeData {
    customer: StripeCustomer
    subscriptions: Subscription[]
    invoices: Invoice[]
    paymentMethods: PaymentMethod[]
}

export interface UserStripeProfileProps {
    userId?: string
    title?: string
}