import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Users, Video, Award, BarChart3, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import StatCard from "../components/StatCard"
import TabButton from "../components/TabButton"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"

const YouTubeStats = () => {
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("efficiency")

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/yt-stats")
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }
      const data = await response.json()
      setStatsData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const processedData = useMemo(() => {
    return statsData
      .map((c) => ({
        ...c,
        efficiency: Math.round(Number(c.total_views) / Number(c.video_count)),
      }))
      .sort((a, b) => {
        if (activeTab === "efficiency") return b.efficiency - a.efficiency
        if (activeTab === "subscribers") return b.subscribers - a.subscribers
        return b.video_count - a.video_count
      })
  }, [statsData, activeTab])

  if (error) return <ErrorScreen error={error} />

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-12 font-sans">
      <title>PL Tables | YouTube Stats</title>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-black italic tracking-tighter text-white">
              BIG 6 <span className="text-indigo-500">DIGITAL</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs mt-2 tracking-[0.2em] uppercase">
              Premier League YouTube Performance // 2026 Report
            </p>
          </motion.div>

          <nav className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
            <TabButton
              active={activeTab === "efficiency"}
              onClick={() => setActiveTab("efficiency")}
              icon={<Award size={16} />}
              label="Efficiency"
            />
            <TabButton
              active={activeTab === "subscribers"}
              onClick={() => setActiveTab("subscribers")}
              icon={<Users size={16} />}
              label="Audience"
            />
            <TabButton
              active={activeTab === "content"}
              onClick={() => setActiveTab("content")}
              icon={<Video size={16} />}
              label="Content"
            />
          </nav>
        </header>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Visualizer */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div
                layout
                className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-inner"
              >
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-tight">
                    <BarChart3 className="text-indigo-500" />
                    {activeTab} Index
                  </h2>
                  <div className="px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    Live Data
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="club"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "16px",
                          border: "1px solid #334155",
                          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)",
                        }}
                      />
                      <Bar
                        dataKey={
                          activeTab === "efficiency"
                            ? "efficiency"
                            : activeTab === "subscribers"
                              ? "subscribers"
                              : "video_count"
                        }
                        radius={[12, 12, 0, 0]}
                      >
                        {processedData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || "#6366f1"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sub-Infographic: Content Volume vs Reach */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StatCard
                  label="Total Uploads"
                  value={processedData
                    .reduce((a, b) => a + b.video_count, 0)
                    .toLocaleString()}
                  icon={<Video className="text-pink-500" />}
                />
                <StatCard
                  label="Avg Views Per Video"
                  value={Math.round(
                    processedData.reduce((a, b) => a + b.efficiency, 0) / 6,
                  ).toLocaleString()}
                  icon={<TrendingUp className="text-emerald-500" />}
                />
              </div>
            </div>

            {/* Leaderboard Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">
                    Category Leader
                  </p>
                  <h3 className="text-4xl font-black italic uppercase mb-4">
                    {processedData[0].club}
                  </h3>
                  <div className="h-1 w-20 bg-white/30 rounded-full mb-6" />
                  <p className="text-sm text-indigo-100 leading-relaxed opacity-90">
                    Dominating the {activeTab} metric with a score of
                    <span className="font-black text-white ml-1">
                      {activeTab === "efficiency"
                        ? `${(processedData[0].efficiency / 1000).toFixed(0)}k`
                        : (processedData[0][activeTab] / 1000000).toFixed(1) +
                          "M"}
                    </span>
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">
                  Detailed Rankings
                </h4>
                <div className="space-y-6">
                  {processedData.map((club, i) => (
                    <div
                      key={club.club}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-mono text-xs">
                          {i + 1}
                        </span>
                        <div
                          className="w-1.5 h-6 rounded-full transition-all group-hover:h-8"
                          style={{ backgroundColor: club.color }}
                        />
                        <span className="font-bold text-sm tracking-tight">
                          {club.club}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {activeTab === "content"
                          ? club.video_count
                          : (club[activeTab] / 1000000).toFixed(1) + "M"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeStats
