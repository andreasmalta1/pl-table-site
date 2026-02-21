import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"
import { apiRequest } from "../utils/api"

const AllTimeTable = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTable = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest("/all-time")
      setTableData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTable()
  }, [])

  if (error) return <ErrorScreen message={error} retryAction={fetchTable} />

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <title>PL Tables | All Time Table</title>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            All Time Premier League Table
          </h1>
          <p className="text-slate-500 text-sm">
            Historical standings from the Premier League vault
          </p>
        </div>
      </header>

      {loading ? <Loader /> : <DataTable data={tableData} />}
    </div>
  )
}
export default AllTimeTable
