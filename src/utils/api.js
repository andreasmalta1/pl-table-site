const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request Failed for ${endpoint}:`, error)
    throw error
  }
}
