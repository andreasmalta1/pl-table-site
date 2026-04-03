// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext()
const AUTH_URL = "/auth"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    axios
      .get(`${AUTH_URL}/current-user`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => {
        setLoading(false)
        setSessionChecked(true)
      })
  }, [])

  const login = (userData) => {
    setUser(userData)
    setLoading(false)
    setSessionChecked(true)
  }

  const logout = () => {
    axios
      .post(`${AUTH_URL}/logout`, {}, { withCredentials: true })
      .then(() => setUser(null))
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, sessionChecked }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
