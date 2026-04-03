import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import { LogOut, Calendar, CheckCircle2, AlertCircle } from "lucide-react"

const EndStint = () => {
  const [activeStints, setActiveStints] = useState([])
  const [formData, setFormData] = useState({
    stintId: "",
    dateEnd: "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const data = await apiRequest("/active-stints")
        setActiveStints(data)
      } catch (err) {
        console.error("Failed to load active stints", err)
      }
    }
    fetchActive()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", msg: "" })

    try {
      await adminPostRequest("/end-stint", formData)
      setStatus({
        type: "success",
        msg: `Stint ended!`,
      })

      setActiveStints((prev) => prev.filter((s) => s.id != formData.stintId))
      setFormData({ stintId: "", dateEnd: "" })
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
          <LogOut size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Terminate <span className="text-orange-500 font-normal">Stint</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6 text-white"
        >
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Select Active Manager
            </label>
            <select
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-orange-500 outline-none cursor-pointer"
              value={formData.stintId}
              onChange={(e) =>
                setFormData({ ...formData, stintId: e.target.value })
              }
            >
              <option value="">Choose manager to depart...</option>
              {activeStints.map((stint) => (
                <option key={stint.id} value={stint.id}>
                  {stint.manager_name} ({stint.team_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Departure Date
            </label>
            <input
              type="date"
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-orange-500 outline-none color-scheme-dark"
              value={formData.dateEnd}
              onChange={(e) =>
                setFormData({ ...formData, dateEnd: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            {loading ? "Processing Departure..." : "Confirm Departure"}
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

        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center">
          {formData.stintId ? (
            <div className="animate-in zoom-in duration-300">
              <div className="w-32 h-32 mx-auto bg-slate-800 rounded-[2rem] overflow-hidden border-4 border-orange-500/20 mb-6">
                <img
                  src={
                    activeStints.find((s) => s.id == formData.stintId)?.face_url
                  }
                  className="w-full h-full object-cover grayscale opacity-50"
                  alt=""
                />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-none">
                {
                  activeStints.find((s) => s.id == formData.stintId)
                    ?.manager_name
                }
              </h3>
              <p className="text-orange-500 font-bold uppercase text-xs mt-2 tracking-widest">
                Departing{" "}
                {activeStints.find((s) => s.id == formData.stintId)?.team_name}
              </p>
            </div>
          ) : (
            <p className="text-slate-600 font-bold uppercase tracking-widest text-xs italic">
              Select a manager to preview departure
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EndStint
