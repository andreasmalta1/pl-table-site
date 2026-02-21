import { useState, useEffect } from "react"
import { CalendarDays } from "lucide-react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"
import { apiRequest } from "../utils/api"

const START_YEAR = 1992

const CalendarTable = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = START_YEAR; y <= currentYear; y++) {
    years.push(y)
  }
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTable = async () => {
    setLoading(true)
    setError(null)
    if (!selectedYear) setError("Please make sure to select a year")

    try {
      const data = await apiRequest(`/years/${selectedYear}`)
      setTableData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTable()
  }, [selectedYear])

  if (error) return <ErrorScreen message={error} retryAction={fetchTable} />

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <title>PL Tables | Calendar Year</title>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Calendar Year Archives
          </h1>
          <p className="text-slate-500 text-sm">
            Historical standings from the Premier League vault
          </p>
        </div>

        <div className="relative group">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 text-white pl-10 pr-10 py-3 rounded-xl focus:ring-2 ring-indigo-500 outline-none cursor-pointer hover:border-slate-600 transition-all font-bold"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <DataTable data={tableData} title={`Standings: Year ${selectedYear}`} />
      )}
    </div>
  )
}

export default CalendarTable
