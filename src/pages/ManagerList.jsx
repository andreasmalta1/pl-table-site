import { useState, useEffect, useRef } from "react"
import { Trophy, Clock, ChevronRight } from "lucide-react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"
import InfoBit from "../components/InfoBit"

const ManagerList = ({ type }) => {
  const [managers, setManagers] = useState([])
  const [tableData, setTableData] = useState(null)
  const [selectedManager, setSelectedManager] = useState(null)
  const [loading, setLoading] = useState(false)

  const managerInfoRef = useRef(null)

  useEffect(() => {
    setTableData(null)
    setSelectedManager(null)

    fetch(`http://127.0.0.1:5000/api/manager-list/${type}`)
      .then((res) => res.json())
      .then((data) => {
        const processed = data
          .map((m) => {
            const start = new Date(m.date_start)
            const end = m.date_end ? new Date(m.date_end) : new Date()
            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24))
            return { ...m, daysInCharge: days }
          })
          .sort((a, b) => b.daysInCharge - a.daysInCharge)

        setManagers(processed)
      })
      .catch((err) => console.error("Error:", err))
  }, [type])

  useEffect(() => {
    if (tableData && managerInfoRef.current) {
      managerInfoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [tableData])

  const loadManagerTable = (manager) => {
    setLoading(true)
    setSelectedManager(manager)
    fetch(`http://127.0.0.1:5000/api/stints/${manager.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTableData(data)
        setLoading(false)
      })
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          {type === "current" ? "Current" : "Past"}{" "}
          <span className="text-indigo-500 font-normal">Managers</span>
        </h1>
      </header>

      {/* Manager Selection List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {managers.map((m) => (
          <button
            key={m.id}
            onClick={() => loadManagerTable(m)}
            className={`group flex items-center gap-4 p-4 rounded-3xl transition-all border ${
              selectedManager?.id === m.id
                ? "bg-indigo-600 border-indigo-400"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="relative w-14 h-14 flex-shrink-0">
              <img
                src={m.face_url}
                className={`w-full h-full rounded-2xl object-cover  ${m?.current == false ? "grayscale group-hover:grayscale-0 transition-all" : ""}`}
                alt=""
              />
              <img
                src={m.crest_url}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 p-1 rounded-md border border-slate-800"
                alt=""
              />
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <h3
                className={`font-bold truncate ${selectedManager?.id === m.id ? "text-white" : "text-slate-200"}`}
              >
                {m.manager_name}
              </h3>
              <div className="flex items-center gap-2">
                <Clock
                  size={10}
                  className={
                    selectedManager?.id === m.id
                      ? "text-indigo-200"
                      : "text-slate-500"
                  }
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-tighter ${selectedManager?.id === m.id ? "text-indigo-100" : "text-slate-500"}`}
                >
                  {m.daysInCharge} Days
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              className={
                selectedManager?.id === m.id ? "text-white" : "text-slate-700"
              }
            />
          </button>
        ))}
      </div>

      {/* Profile Info Card */}
      {selectedManager && (
        <div
          ref={managerInfoRef}
          className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <img
                src={selectedManager.face_url}
                className="w-40 h-40 object-cover rounded-3xl border-2 border-slate-700"
                alt=""
              />
              <img
                src={selectedManager.crest_url}
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-slate-950 p-2 rounded-xl border border-slate-800"
                alt="Club"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={selectedManager.flag_url}
                  className="w-6 h-4 object-cover rounded-sm"
                  alt=""
                />
              </div>
              <h2 className="text-5xl font-black uppercase italic mb-6 leading-none">
                {selectedManager.manager_name}
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <InfoBit
                  label="Start"
                  value={new Date(
                    selectedManager.date_start,
                  ).toLocaleDateString("en-GB")}
                />
                {/* Only show End Date if it exists (Past Manager) */}
                {selectedManager.date_end ? (
                  <InfoBit
                    label="Departure"
                    value={new Date(
                      selectedManager.date_end,
                    ).toLocaleDateString("en-GB")}
                  />
                ) : (
                  <InfoBit
                    label="Status"
                    value="Present"
                    color="text-emerald-400"
                  />
                )}
                <InfoBit
                  label="Tenure"
                  value={`${selectedManager.daysInCharge} Days`}
                />
              </div>
            </div>
          </div>
          {/* Background design element */}
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Trophy size={200} />
          </div>
        </div>
      )}

      <div className="border-t border-slate-800/50 pt-10">
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            data={tableData}
            title={`Table In Charge: ${selectedManager?.manager_name}`}
          />
        )}
      </div>
    </div>
  )
}

export default ManagerList
