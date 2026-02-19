import { useState, useEffect } from "react"
import { CalendarDays } from "lucide-react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"

const SeasonTable = () => {
  const [seasons, setSeasons] = useState([])
  const [selectedSeason, setSelectedSeason] = useState("")
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/seasons-list")
      .then((res) => res.json())
      .then((data) => {
        setSeasons(data)
        if (data.length > 0) {
          setSelectedSeason(data[0])
        }
      })
      .catch((err) => console.error("Error fetching seasons:", err))
  }, [])

  useEffect(() => {
    if (!selectedSeason) return
    const formattedSeason = selectedSeason.replace("/", "-")

    setLoading(true)
    fetch(`http://127.0.0.1:5000/api/seasons/${formattedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        setTableData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching table:", err)
        setLoading(false)
      })
  }, [selectedSeason])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <title>PL Tables | Season</title>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Season Archives
          </h1>
          <p className="text-slate-500 text-sm">
            Historical standings from the Premier League vault
          </p>
        </div>

        {/* The Dropdown UI */}
        <div className="relative group">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 text-white pl-10 pr-10 py-3 rounded-xl focus:ring-2 ring-indigo-500 outline-none cursor-pointer hover:border-slate-600 transition-all font-bold"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          data={tableData}
          title={`Standings: Season ${selectedSeason}`}
        />
      )}
    </div>
  )
}

export default SeasonTable
