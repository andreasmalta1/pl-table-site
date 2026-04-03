import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginRequest } from "../utils/api"
import { Lock } from "lucide-react"

const Login = () => {
  const [creds, setCreds] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginRequest("/login", creds)
      login(data)
      navigate("/admin")
    } catch (err) {
      setError("Access Denied: Invalid Credentials")
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-500">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black uppercase italic text-center tracking-tighter text-white">
          Login
        </h2>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center rounded-xl uppercase">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 ring-indigo-500 outline-none transition-all"
          onChange={(e) => setCreds({ ...creds, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 ring-indigo-500 outline-none transition-all"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
