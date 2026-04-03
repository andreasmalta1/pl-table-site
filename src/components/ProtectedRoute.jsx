// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, sessionChecked } = useAuth()

  if (!sessionChecked) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
