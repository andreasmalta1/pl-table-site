import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"

const CustomeDateTable = () => {
  const getInitialDates = () => {
    const d = new Date()
    const today = d.toISOString().split("T")[0]
    d.setMonth(d.getMonth() - 1)
    const monthAgo = d.toISOString().split("T")[0]

    return { start: monthAgo, end: today }
  }

  const [dates, setDates] = useState(getInitialDates)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    setLoading(true)
    fetch(
      `http://127.0.0.1:5000/api/dates?start=${dates.start}&end=${dates.end}`,
    )
      .then((res) => res.json())
      .then((resData) => {
        setData(resData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="space-y-6 text-white">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">
            START DATE
          </label>
          <input
            type="date"
            className="bg-slate-800 p-2 rounded border border-slate-700 outline-none focus:border-indigo-500"
            value={dates.start} // Controlled input
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">
            END DATE
          </label>
          <input
            type="date"
            className="bg-slate-800 p-2 rounded border border-slate-700 outline-none focus:border-indigo-500"
            value={dates.end} // Controlled input
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Generate Table"}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable data={data} title={`From ${dates.start} to ${dates.end}`} />
      )}
    </div>
  )
}

export default CustomeDateTable
