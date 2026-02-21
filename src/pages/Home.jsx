import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"

const Home = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTable = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://127.0.0.1:5000/api/current-season")
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }
      const data = await response.json()
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
    <div className="space-y-6">
      <title>PL Tables | Home</title>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Current Premier League Table
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
export default Home
