interface FetchOptions {
    params?: Record<string, string | number | undefined>
}

// Função genérica para fazer GET com token no header
export const fetchWithAuth = async (url: string, options?: FetchOptions) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("No token found")
        }

        // Adiciona query params se existirem
        const params = new URLSearchParams()
        if (options?.params) {
            for (const [key, value] of Object.entries(options.params)) {
                if (value !== undefined) {
                    params.append(key, String(value))
                }
            }
        }

        const finalUrl = params.toString() ? `${url}?${params.toString()}` : url

        const response = await fetch(finalUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }

        return await response.json()

    } catch (error) {
        console.error(`Error fetching from ${url}:`, error)
        return null
    }
}