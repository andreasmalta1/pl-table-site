import React, { useEffect, useState } from "react"
import DataTable from "../components/DataTable"

const AllTimeTable = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/all-time")
      .then((res) => res.json())
      .then(setData)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black italic uppercase">
        All Time Premier League Table
      </h1>
      <DataTable data={data} />
    </div>
  )
}
export default AllTimeTable
