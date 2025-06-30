interface FetchOptions {
    method?: string
    params?: Record<string, string | number | undefined>
    body?: any
}

export const fetchWithAuth = async (url: string, options?: FetchOptions) => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const params = new URLSearchParams()
    if (options?.params) {
        for (const [key, value] of Object.entries(options.params)) {
            if (value !== undefined) params.append(key, String(value))
        }
    }

    const finalUrl = params.toString() ? `${url}?${params.toString()}` : url

    const fetchOptions: RequestInit = {
        method: options?.method || "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }

    if (options?.body) {
        fetchOptions.body = JSON.stringify(options.body)
    }

    const response = await fetch(finalUrl, fetchOptions)

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    return await response.json()
}