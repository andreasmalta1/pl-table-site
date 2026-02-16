import React, { useEffect, useState } from "react"
import DataTable from "../components/DataTable"

const Home = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/current-season")
      .then((res) => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black italic uppercase">
        Current Premier League Table
      </h1>
      <DataTable data={data} />
    </div>
  )
}
export default Home
