import React, { useState, useEffect } from "react"
import DataTable from "../components/DataTable"

const ManagerList = ({ type }) => {
  // type: 'current' or 'past'
  const [managers, setManagers] = useState([])
  const [tableData, setTableData] = useState(null)
  const [activeName, setActiveName] = useState("")

  useEffect(() => {
    fetch(`/api/managers/${type}`)
      .then((res) => res.json())
      .then(setManagers)
  }, [type])

  const loadManagerTable = (id, name) => {
    setActiveName(name)
    fetch(`/api/table/manager/${id}`)
      .then((res) => res.json())
      .then(setTableData)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black italic uppercase">{type} Managers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {managers.map((m) => (
          <button
            key={m.id}
            onClick={() => loadManagerTable(m.id, m.name)}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-indigo-500 transition-all"
          >
            <div className="font-bold text-white">{m.name}</div>
            <div className="text-xs text-slate-500 uppercase">{m.club}</div>
          </button>
        ))}
      </div>
      {tableData && (
        <DataTable data={tableData} title={`Tenure Table: ${activeName}`} />
      )}
    </div>
  )
}
export default ManagerList
