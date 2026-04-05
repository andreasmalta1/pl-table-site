import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import { Trophy, Calendar } from "lucide-react"

const AddMatch = () => {
  const [teams, setTeams] = useState([])
  const [formData, setFormData] = useState({
    homeTeamId: "",
    awayTeamId: "",
    homeScore: "",
    awayScore: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiRequest("/teams/current").then(setTeams).catch(console.error)
  }, [])

  // Auto-clear status after 4 seconds
  useEffect(() => {
    if (!status.msg) return
    const t = setTimeout(() => setStatus({ type: "", msg: "" }), 4000)
    return () => clearTimeout(t)
  }, [status.msg])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.homeTeamId === formData.awayTeamId) {
      return setStatus({
        type: "error",
        msg: "A team cannot play against itself.",
      })
    }

    setLoading(true)
    try {
      await adminPostRequest("/new-match", formData)
      setStatus({ type: "success", msg: "Match result recorded successfully!" })
      setFormData((prev) => ({
        ...prev,
        homeTeamId: "",
        awayTeamId: "",
        homeScore: "",
        awayScore: "",
      }))
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
          <Trophy size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Match <span className="text-amber-500 font-normal">Reporter</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Scoreboard UI */}
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-3 gap-8 items-start relative z-10">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Home Side
              </label>
              <select
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-base font-bold text-center appearance-none cursor-pointer focus:ring-2 ring-amber-500 outline-none"
                value={formData.homeTeamId}
                onChange={(e) =>
                  setFormData({ ...formData, homeTeamId: e.target.value })
                }
              >
                <option value="">Select Team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                required
                placeholder="0"
                className="w-28 h-28 bg-slate-950 border-2 border-slate-800 rounded-3xl text-5xl font-black text-center leading-none p-0 focus:border-amber-500 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={formData.homeScore}
                onChange={(e) =>
                  setFormData({ ...formData, homeScore: e.target.value })
                }
              />
            </div>

            {/* VS Divider — vertically centred between selector + score */}
            <div className="flex flex-col items-center justify-center pt-10 gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="font-black italic text-black text-sm">VS</span>
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-amber-500/50 to-transparent" />
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Away Side
              </label>
              <select
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-base font-bold text-center appearance-none cursor-pointer focus:ring-2 ring-amber-500 outline-none"
                value={formData.awayTeamId}
                onChange={(e) =>
                  setFormData({ ...formData, awayTeamId: e.target.value })
                }
              >
                <option value="">Select Team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                required
                placeholder="0"
                className="w-28 h-28 bg-slate-950 border-2 border-slate-800 rounded-3xl text-5xl font-black text-center leading-none p-0 focus:border-amber-500 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={formData.awayScore}
                onChange={(e) =>
                  setFormData({ ...formData, awayScore: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Date & Submit */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
          <div className="flex items-center gap-4 ml-4">
            <Calendar className="text-slate-500" size={20} />
            {/* FIX: use inline style instead of invalid Tailwind class */}
            <input
              type="date"
              style={{ colorScheme: "dark" }}
              className="bg-transparent border-none text-slate-300 font-bold outline-none"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting Result..." : "Finalize Match Result"}
          </button>
        </div>

        {status.msg && (
          <div
            className={`p-6 rounded-[2rem] text-center font-bold uppercase text-xs tracking-widest border animate-in zoom-in ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            }`}
          >
            {status.msg}
          </div>
        )}
      </form>
    </div>
  )
}

export default AddMatch
