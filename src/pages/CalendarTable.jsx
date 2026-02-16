import React, { useState, useEffect } from "react"
import DataTable from "../components/DataTable"
import { Loader2, CalendarDays } from "lucide-react"

const CalendarTable = () => {
  const [seasons, setSeasons] = useState([])
  const [selectedSeason, setSelectedSeason] = useState("")
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)

  // Phase 1: Fetch the list of seasons on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/seasons-list")
      .then((res) => res.json())
      .then((data) => {
        // Expected data format: ["2025-26", "2024-25", "2023-24"]
        setSeasons(data)
        if (data.length > 0) {
          setSelectedSeason(data[0]) // Auto-select the first season
        }
      })
      .catch((err) => console.error("Error fetching seasons:", err))
  }, [])

  // Phase 2: Fetch table data whenever the selectedSeason changes
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

      {/* Main Table Display */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800/50">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
          <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            Compiling Standings...
          </span>
        </div>
      ) : (
        <DataTable
          data={tableData}
          title={`Standings: Season ${selectedSeason}`}
        />
      )}
    </div>
  )
}

export default CalendarTable
