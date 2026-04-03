import axios from "axios"

const API_URL = "/api"
const AUTH_URL = "/auth"

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const response = await axios.get(url, headers)

    if (response.status != 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.data
  } catch (error) {
    console.error(`API Request Failed for ${endpoint}:`, error)
    throw error
  }
}

export const apiPostRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const response = await axios.post(url, headers)

    if (response.status != 201) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error(`API Request Failed for ${endpoint}:`, error)
    throw error
  }
}

export const apiLoginRequest = async (endpoint, body) => {
  const url = `${AUTH_URL}${endpoint}`

  try {
    const response = await axios.post(url, body, {})

    if (response.status != 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error(`API Request Failed for ${endpoint}:`, error)
    throw error
  }
}
