import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

const DataTable = ({ data, title }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "rk",
    direction: "asc",
  })

  if (!data) return

  const sortedData = useMemo(() => {
    let sortableItems = [...data]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [data, sortConfig])

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc"
    setSortConfig({ key, direction })
  }

  const headers = [
    { label: "#", key: "rk" },
    { label: "", key: "url" },
    { label: "Club", key: "name" },
    { label: "MP", key: "played" },
    { label: "W", key: "win" },
    { label: "D", key: "draw" },
    { label: "L", key: "loss" },
    { label: "GS", key: "goals_for" },
    { label: "GC", key: "goals_against" },
    { label: "GD", key: "gd" },
    { label: "Pts", key: "points" },
  ]

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
      {title && (
        <div className="p-6 border-b border-slate-800 font-bold italic uppercase">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] tracking-widest font-black">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className="px-4 py-4 cursor-pointer hover:text-white"
                  onClick={() => h.key !== "logo" && requestSort(h.key)}
                >
                  <div className="flex items-center gap-1">
                    {h.label}
                    {sortConfig.key === h.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedData.map((team, i) => (
              <tr
                key={team.name + i}
                className="hover:bg-indigo-500/5 transition-colors group"
              >
                <td className="px-4 py-4 font-mono text-slate-500">
                  {team.rk}
                </td>
                <td className="px-4 py-4">
                  <img
                    src={team.url}
                    className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all"
                    alt=""
                  />
                </td>
                <td className="px-4 py-4 font-bold text-white">{team.name}</td>
                <td className="px-4 py-4">{team.played}</td>
                <td className="px-4 py-4 text-emerald-400 font-medium">
                  {team.win}
                </td>
                <td className="px-4 py-4 text-slate-400">{team.draw}</td>
                <td className="px-4 py-4 text-rose-400">{team.loss}</td>
                <td className="px-4 py-4">{team.goals_for}</td>
                <td className="px-4 py-4">{team.goals_against}</td>
                <td className="px-4 py-4 font-medium">
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="px-4 py-4 font-black text-indigo-400">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
