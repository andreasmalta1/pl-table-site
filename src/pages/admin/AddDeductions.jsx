import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import { ShieldAlert, Hash, CheckCircle2, AlertCircle } from "lucide-react"

const AddDeduction = () => {
  const [teams, setTeams] = useState([])
  const [seasons, setSeasons] = useState([])
  const [formData, setFormData] = useState({
    teamId: "",
    pointsDeducted: "",
    reason: "",
    season: "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadSelectionData = async () => {
      try {
        const [tList, sList] = await Promise.all([
          apiRequest("/teams"),
          apiRequest("/seasons-list"),
        ])
        setTeams(tList)
        setSeasons(sList)
      } catch (err) {
        console.error("Failed to load metadata", err)
      }
    }
    loadSelectionData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", msg: "" })

    try {
      await adminPostRequest("/new-point-deduction", formData)
      setStatus({
        type: "success",
        msg: `Points Deduction added!`,
      })
      setFormData({ teamId: "", pointsDeducted: "", reason: "", season: "" })
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8 text-rose-500">
        <div className="p-3 bg-rose-500/10 rounded-2xl">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Sanction <span className="text-rose-500 font-normal">Record</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-5 text-white"
        >
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Target Club
            </label>
            <select
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-rose-500 outline-none cursor-pointer"
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: e.target.value })
              }
            >
              <option value="">Select penalized team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                Points
              </label>
              <input
                type="number"
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-rose-500 outline-none"
                placeholder="e.g. 4"
                value={formData.pointsDeducted}
                onChange={(e) =>
                  setFormData({ ...formData, pointsDeducted: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                Season
              </label>
              <select
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-rose-500 outline-none cursor-pointer"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
              >
                <option value="">Select Season...</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Official Reason
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-rose-500 outline-none text-sm resize-none"
              placeholder="e.g. Breach of Profitability and Sustainability Rules (PSR)"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <Hash size={18} />
            {loading ? "Processing Penalty..." : "Apply Points Penalty"}
          </button>

          {status.msg && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {status.msg}
            </div>
          )}
        </form>

        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col justify-center">
          <div className="text-center">
            <div className="text-6xl font-black text-rose-600 mb-2 italic">
              -{formData.pointsDeducted || "0"}
            </div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
              Points Sanctioned
            </div>

            <div className="space-y-4 text-left bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-600">
                  Club Affected
                </p>
                <p className="text-lg font-bold text-white uppercase italic">
                  {teams.find((t) => t.id == formData.teamId)?.name || "---"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-600">
                  Season Context
                </p>
                <p className="text-md font-bold text-rose-500">
                  {formData.season || "---"}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-600 mb-1">
                  Stated Offence
                </p>
                <p className="text-xs text-slate-400 italic">
                  "{formData.reason || "Reason will be displayed here..."}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddDeduction
