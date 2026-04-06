import { useState } from "react"
import { adminPostRequest } from "../../utils/api"
import {
  ShieldPlus,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react"

const AddNation = () => {
  const [formData, setFormData] = useState({
    nationName: "",
    shortcode: "",
    flagUrl: "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", msg: "" })

    try {
      await adminPostRequest("/new-nation", formData)
      setStatus({
        type: "success",
        msg: `Nation ${formData.nationName} added!`,
      })
      setFormData({ nationName: "", shortcode: "", flagUrl: "" })
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
          <ShieldPlus size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Register New
          <span className="text-indigo-500 font-normal">Nation</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6"
        >
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Nation Name
            </label>
            <input
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 text-white focus:ring-2 ring-indigo-500 outline-none transition-all"
              placeholder="e.g. England"
              value={formData.nationName}
              onChange={(e) =>
                setFormData({ ...formData, nationName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                Shortcode
              </label>
              <input
                required
                maxLength={3}
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 text-white uppercase focus:ring-2 ring-indigo-500 outline-none transition-all"
                placeholder="ENG"
                value={formData.shortcode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortcode: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
              Flag S3 URL
            </label>
            <input
              required
              className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-1 text-white focus:ring-2 ring-indigo-500 outline-none transition-all text-sm"
              placeholder="https://pl-table.s3.../crest.png"
              value={formData.crestUrl}
              onChange={(e) =>
                setFormData({ ...formData, flagUrl: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Deploy Team to DB"}
          </button>

          {status.msg && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase transition-all ${
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
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-8">
            Digital Identity Preview
          </p>

          <div className="relative group">
            <div className="w-48 h-48 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500">
              {formData.flagUrl ? (
                <img
                  src={formData.flagUrl}
                  alt="Preview"
                  className="w-32 h-32 object-contain animate-in zoom-in duration-300"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <ImageIcon size={48} className="text-slate-800" />
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-2xl font-black uppercase italic text-white leading-tight">
              {formData.nationName || "Nation"}
            </h3>
            <p className="text-indigo-500 font-mono font-bold tracking-[0.5em] mt-2">
              {formData.shortcode || "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNation
