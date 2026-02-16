import React, { useState } from "react"
import DataTable from "../components/DataTable"

const CustomeDateTable = () => {
  const [dates, setDates] = useState({ start: "", end: "" })
  const [data, setData] = useState([])

  const handleSearch = () => {
    fetch(`/api/table/range?start=${dates.start}&end=${dates.end}`)
      .then((res) => res.json())
      .then(setData)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">
            START DATE
          </label>
          <input
            type="date"
            className="bg-slate-800 p-2 rounded"
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">
            END DATE
          </label>
          <input
            type="date"
            className="bg-slate-800 p-2 rounded"
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-indigo-600 px-6 py-2 rounded-lg font-bold"
        >
          Generate Table
        </button>
      </div>
      {data.length > 0 && (
        <DataTable data={data} title={`From ${dates.start} to ${dates.end}`} />
      )}
    </div>
  )
}
export default CustomeDateTable
