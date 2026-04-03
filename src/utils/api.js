import axios from "axios"

const API_URL = "/api"
const AUTH_URL = "/auth"
const ADMIN_URL = "/admin"

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

export const loginRequest = async (endpoint, body) => {
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

export const adminPostRequest = async (endpoint, body) => {
  const url = `${ADMIN_URL}${endpoint}`

  try {
    const response = await axios.post(url, body, {})
    return response.data
  } catch (error) {
    const serverMessage =
      error.response?.data?.msg || "A network error occurred"
    throw new Error(serverMessage)
  }
}
