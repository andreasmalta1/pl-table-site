import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import Loader from "../components/Loader"

const AllTimeTable = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("http://127.0.0.1:5000/api/all-time")
      .then((res) => res.json())
      .then((data) => {
        setTableData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching table:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <title>PL Tables | All Time Table</title>
      <h1 className="text-3xl font-black italic uppercase">
        All Time Premier League Table
      </h1>
      {loading ? <Loader /> : <DataTable data={tableData} />}
    </div>
  )
}
export default AllTimeTable
