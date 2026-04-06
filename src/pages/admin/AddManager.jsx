import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import { Users, UserPlus, CheckCircle2, AlertCircle } from "lucide-react"

const AddManager = () => {
  const [nations, setNations] = useState([])
  const [formData, setFormData] = useState({
    managerName: "",
    faceUrl: "",
    nationId: "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const data = await apiRequest("/nations")
        setNations(data)
      } catch (err) {
        console.error("Could not load nations", err)
      }
    }
    fetchNations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", msg: "" })

    if (!formData.nationId) {
      setStatus({ type: "error", msg: "Please select a nation" })
      setLoading(false)
      return
    }

    try {
      await adminPostRequest("/new-manager", formData)
      setStatus({
        type: "success",
        msg: `Manager ${formData.managerName} added!`,
      })
      setFormData({ managerName: "", faceUrl: "", nationId: "" })
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
          <UserPlus size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Register New{" "}
          <span className="text-purple-500 font-normal">Manager</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6 text-white"
        >
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Manager Full Name
            </label>
            <input
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-purple-500 outline-none transition-all"
              placeholder="e.g. Pep Guardiola"
              value={formData.managerName}
              onChange={(e) =>
                setFormData({ ...formData, managerName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Nation / Citizenship
            </label>
            <select
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 focus:ring-2 ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
              value={formData.nationId}
              onChange={(e) =>
                setFormData({ ...formData, nationId: e.target.value })
              }
            >
              <option value="">Select a Nation...</option>
              {nations.map((nation) => (
                <option key={nation.id} value={nation.id}>
                  {nation.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Face Image URL (S3)
            </label>
            <input
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 text-sm focus:ring-2 ring-purple-500 outline-none transition-all"
              placeholder="https://pl-table.s3.../pep.png"
              value={formData.faceUrl}
              onChange={(e) =>
                setFormData({ ...formData, faceUrl: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-purple-500/20"
          >
            {loading ? "Saving..." : "Confirm Manager Registration"}
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

        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-12">
          <div className="relative group">
            <div className="w-56 h-56 rounded-[3rem] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-500">
              {formData.faceUrl ? (
                <img
                  src={formData.faceUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users size={64} className="text-slate-800" />
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-3xl font-black uppercase italic text-white leading-tight">
              {formData.managerName || "Manager Name"}
            </h3>
            {formData.nationId && (
              <p className="text-purple-500 font-black uppercase text-xs tracking-widest mt-2">
                {nations.find((nation) => nation.id == formData.nationId)?.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddManager
