import { useState, useEffect } from "react"
import { apiRequest, adminPostRequest } from "../../utils/api"
import { Calendar, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

const NewSeason = () => {
  const [currentTeams, setCurrentTeams] = useState([])
  const [otherTeams, setOtherTeams] = useState([])
  const [selection, setSelection] = useState({
    relegate: [],
    promote: [],
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const [currentTeams, otherTeams] = await Promise.all([
          apiRequest("/teams/current"),
          apiRequest("/teams"),
        ])
        setCurrentTeams(currentTeams)
        setOtherTeams(otherTeams)
        setSelection({ relegate: [], promote: [] })
      } catch (err) {
        console.error("Failed to load season metadata", err)
      }
    }
    loadTeams()
  }, [])

  const handleToggle = (category, id) => {
    const other = category === "relegate" ? "promote" : "relegate"
    setSelection((prev) => ({
      ...prev,
      [other]: prev[other].filter((teamId) => teamId !== id),
      [category]: prev[category].includes(id)
        ? prev[category].filter((teamId) => teamId !== id)
        : [...prev[category], id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selection.relegate.length !== 3 || selection.promote.length !== 3) {
      return setStatus({
        type: "error",
        msg: "You must select exactly 3 teams to relegate and 3 to promote.",
      })
    }

    setLoading(true)
    try {
      const response = await adminPostRequest("/new-season", selection)
      setStatus({ type: "success", msg: response.msg })
    } catch (err) {
      setStatus({ type: "error", msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500">
          <Calendar size={32} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Season <span className="text-pink-500 font-normal">Transition</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
          <h2 className="flex items-center gap-2 text-rose-500 font-black uppercase italic mb-6">
            <ArrowDownCircle size={20} /> Relegate to Championship
          </h2>
          <div className="space-y-2">
            {currentTeams.map((t) => (
              <button
                key={t.id}
                onClick={() => handleToggle("relegate", t.id)}
                className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all border ${
                  selection.relegate.includes(t.id)
                    ? "bg-rose-500/20 border-rose-500 text-white"
                    : "bg-slate-800 border-transparent text-slate-400"
                }`}
              >
                <span className="font-bold">{t.name}</span>
                <span className="text-[10px] font-black uppercase">
                  {selection.relegate.includes(t.id) ? "Selected" : "Keep"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
          <h2 className="flex items-center gap-2 text-emerald-500 font-black uppercase italic mb-6">
            <ArrowUpCircle size={20} /> Promote to Premier League
          </h2>
          <div className="space-y-2 ">
            {otherTeams
              .filter((t) => !currentTeams.find((ct) => ct.id === t.id))
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleToggle("promote", t.id)}
                  className={`w-full flex justify-between items-center p-4 rounded-2xl transition-all border ${
                    selection.promote.includes(t.id)
                      ? "bg-emerald-500/20 border-emerald-500 text-white"
                      : "bg-slate-800 border-transparent text-slate-400"
                  }`}
                >
                  <span className="font-bold">{t.name}</span>
                  <span className="text-[10px] font-black uppercase">
                    {selection.promote.includes(t.id)
                      ? "Selected"
                      : "Championship"}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col items-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-pink-500 hover:text-white transition-all shadow-xl disabled:bg-slate-800"
        >
          {loading ? "Updating Database..." : "Finalize Season Rotation"}
        </button>
        {status.msg && (
          <p className="mt-4 font-bold text-xs uppercase tracking-widest text-pink-500">
            {status.msg}
          </p>
        )}
      </div>
    </div>
  )
}

export default NewSeason
