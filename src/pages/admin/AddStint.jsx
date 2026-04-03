import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import {
  History,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

const AddStint = () => {
  const [managers, setManagers] = useState([])
  const [teams, setTeams] = useState([])
  const [formData, setFormData] = useState({
    managerId: "",
    teamId: "",
    dateStart: "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mList, tList] = await Promise.all([
          apiRequest("/managers"),
          apiRequest("/teams"),
        ])
        setManagers(mList)
        setTeams(tList)
      } catch (err) {
        console.error("Failed to load selection data", err)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", msg: "" })

    try {
      await adminPostRequest("/new-stint", formData)
      setStatus({
        type: "success",
        msg: `Stint added!`,
      })
      setFormData({ managerId: "", teamId: "", dateStart: "" })
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
          <History size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          New <span className="text-indigo-500 font-normal">Appointment</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6 text-white"
        >
          {/* Manager Selection */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Select Manager
            </label>
            <select
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-indigo-500 outline-none cursor-pointer"
              value={formData.managerId}
              onChange={(e) =>
                setFormData({ ...formData, managerId: e.target.value })
              }
            >
              <option value="">Choose a Manager...</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Selection */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Assign to Club
            </label>
            <select
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-indigo-500 outline-none cursor-pointer"
              value={formData.teamId}
              onChange={(e) =>
                setFormData({ ...formData, teamId: e.target.value })
              }
            >
              <option value="">Choose a Team...</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Official Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-indigo-500 outline-none color-scheme-dark"
                value={formData.dateStart}
                onChange={(e) =>
                  setFormData({ ...formData, dateStart: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            {loading ? "Recording..." : "Confirm Appointment"}
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

        {/* The "Contract" Preview */}
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-700">
              {formData.managerId ? (
                <img
                  src={
                    managers.find((m) => m.id == formData.managerId)?.face_url
                  }
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <History className="text-slate-600" />
              )}
            </div>
            <ArrowRight className="text-indigo-500" />
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center p-4 border border-slate-700">
              {formData.teamId ? (
                <img
                  src={teams.find((t) => t.id == formData.teamId)?.crest_url}
                  className="w-full h-full object-contain"
                  alt=""
                />
              ) : (
                <History className="text-slate-600" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">
            {formData.managerId
              ? managers.find((m) => m.id == formData.managerId)?.name
              : "Select Manager"}
          </h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            to
          </p>
          <h3 className="text-xl font-black uppercase italic text-indigo-500 tracking-tighter">
            {formData.teamId
              ? teams.find((t) => t.id == formData.teamId)?.name
              : "Select Club"}
          </h3>

          {formData.dateStart && (
            <div className="mt-8 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <p className="text-[10px] font-black uppercase text-indigo-400">
                Commencing: {formData.dateStart}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddStint
