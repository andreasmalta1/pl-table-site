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
import { Users, Video, Award, BarChart3, TrendingUp, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import StatCard from "../components/StatCard"
import TabButton from "../components/TabButton"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"
import { apiRequest } from "../utils/api"

const SHORT_NAMES = {
  "Liverpool FC": "Liverpool",
  "Manchester United": "Man United",
  "Chelsea Football Club": "Chelsea",
  "Tottenham Hotspur": "Spurs",
  "Man City": "Man City",
  Arsenal: "Arsenal",
}

const CONFIG = {
  subscribers: {
    icon: <Users size={16} />,
    label: "Audience",
    chartTitle: "Audience Size",
    stat1Label: "Total Subscribers",
    stat2Label: "Avg Subscribers",
    metricName: "subscribers",
    dataKey: "subscribers",
    fmt: (n) =>
      n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1e3)}K`,
    stat1: (d) => {
      const t = d.reduce((a, b) => a + (b.subscribers || 0), 0)
      return t >= 1e9 ? `${(t / 1e9).toFixed(2)}B` : `${(t / 1e6).toFixed(1)}M`
    },
    stat2: (d) =>
      d.length
        ? `${(d.reduce((a, b) => a + (b.subscribers || 0), 0) / d.length / 1e6).toFixed(1)}M`
        : "0M",
  },
  views: {
    icon: <Eye size={16} />,
    label: "Views",
    chartTitle: "Total Views",
    stat1Label: "Combined Views",
    stat2Label: "Avg Views",
    metricName: "total views",
    dataKey: "total_views",
    fmt: (n) =>
      n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : `${(n / 1e6).toFixed(0)}M`,
    stat1: (d) =>
      `${(d.reduce((a, b) => a + (b.total_views || 0), 0) / 1e9).toFixed(1)}B`,
    stat2: (d) =>
      d.length
        ? `${(d.reduce((a, b) => a + (b.total_views || 0), 0) / d.length / 1e9).toFixed(1)}B`
        : "0B",
  },
  content: {
    icon: <Video size={16} />,
    label: "Content",
    chartTitle: "Content Volume",
    stat1Label: "Total Videos",
    stat2Label: "Avg per Club",
    metricName: "videos uploaded",
    dataKey: "video_count",
    fmt: (n) => n.toLocaleString(),
    stat1: (d) =>
      d.reduce((a, b) => a + (b.video_count || 0), 0).toLocaleString(),
    stat2: (d) =>
      d.length
        ? Math.round(
            d.reduce((a, b) => a + (b.video_count || 0), 0) / d.length,
          ).toLocaleString()
        : "0",
  },
  efficiency: {
    icon: <Award size={16} />,
    label: "Views/Video",
    chartTitle: "Views Per Video",
    stat1Label: "Best Efficiency",
    stat2Label: "Avg Views / Video",
    metricName: "avg views per video",
    dataKey: "efficiency",
    fmt: (n) =>
      n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1e3)}K`,
    stat1: (d) => {
      if (!d.length) return "0"
      const max = Math.max(...d.map((x) => x.efficiency || 0))
      return max >= 1e6
        ? `${(max / 1e6).toFixed(1)}M`
        : `${Math.round(max / 1e3)}K`
    },
    stat2: (d) => {
      if (!d.length) return "0"
      const avg = d.reduce((a, b) => a + (b.efficiency || 0), 0) / d.length
      return avg >= 1e6
        ? `${(avg / 1e6).toFixed(1)}M`
        : `${Math.round(avg / 1e3)}K`
    },
  },
}

const YouTubeStats = () => {
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("subscribers")

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiRequest("/yt-stats")
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
    const cfg = CONFIG[activeTab]
    return statsData
      .map((c) => ({
        ...c,
        club: SHORT_NAMES[c.club] ?? c.club,
        efficiency: Math.round(
          Number(c.total_views || 0) / Number(c.video_count || 1),
        ),
        color: c.color || "#6366f1", // Fallback color
      }))
      .sort((a, b) => (b[cfg.dataKey] || 0) - (a[cfg.dataKey] || 0))
  }, [statsData, activeTab])

  const cfg = CONFIG[activeTab]
  const leader = processedData[0]
  const leaderValue = leader ? cfg.fmt(leader[cfg.dataKey]) : "—"

  if (error) return <ErrorScreen error={error} onRetry={fetchStats} />

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 lg:p-12 font-sans selection:bg-indigo-500/30">
      <title>PL Tables | YouTube Stats</title>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
              BIG 6 <span className="text-indigo-500">DIGITAL</span>
            </h1>
            <p className="text-slate-500 font-mono text-[10px] md:text-xs mt-2 tracking-[0.3em] uppercase opacity-80">
              Premier League YouTube Performance // 2026 Report
            </p>
          </motion.div>

          <nav className="flex flex-wrap bg-slate-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/50 shadow-2xl">
            {Object.entries(CONFIG).map(([key, value]) => (
              <TabButton
                key={key}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
                icon={value.icon}
                label={value.label}
              />
            ))}
          </nav>
        </header>

        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <motion.div
                layout
                className="bg-slate-900/30 border border-slate-800/60 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-3xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 uppercase tracking-tight">
                    <BarChart3 className="text-indigo-500" size={20} />
                    {cfg.chartTitle}
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                    Real-time
                  </div>
                </div>

                <div className="h-[300px] md:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                        vertical={false}
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="club"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={cfg.fmt}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)", radius: 12 }}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "20px",
                          border: "1px solid #334155",
                          padding: "12px 16px",
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        labelStyle={{
                          color: "#64748b",
                          marginBottom: "4px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                        }}
                        formatter={(value) => [cfg.fmt(value), cfg.label]}
                      />
                      <Bar
                        dataKey={cfg.dataKey}
                        radius={[10, 10, 0, 0]}
                        barSize={45}
                      >
                        {processedData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            fillOpacity={0.9}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                  label={cfg.stat1Label}
                  value={cfg.stat1(processedData)}
                  icon={<Video className="text-pink-500" size={20} />}
                />
                <StatCard
                  label={cfg.stat2Label}
                  value={cfg.stat2(processedData)}
                  icon={<TrendingUp className="text-emerald-500" size={20} />}
                />
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-indigo-600 to-violet-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                      Top Performer
                    </p>
                    <h3 className="text-3xl md:text-4xl font-black italic uppercase mb-4 group-hover:translate-x-1 transition-transform">
                      {leader?.club || "Loading..."}
                    </h3>
                    <div className="h-1.5 w-16 bg-white/20 rounded-full mb-6" />
                    <p className="text-base text-indigo-50/80 leading-relaxed">
                      Dominates the league with{" "}
                      <span className="font-black text-white underline decoration-indigo-400 underline-offset-4">
                        {leaderValue}
                      </span>{" "}
                      {cfg.metricName}.
                    </p>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                </motion.div>
              </AnimatePresence>

              <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 backdrop-blur-md">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                  Detailed Rankings
                </h4>
                <div className="space-y-5">
                  {processedData.map((club, i) => (
                    <motion.div
                      layout
                      key={club.club}
                      className="flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-mono text-[10px] w-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div
                          className="w-1 h-5 rounded-full transition-all duration-300 group-hover:h-8 group-hover:w-1.5"
                          style={{ backgroundColor: club.color }}
                        />
                        <span className="font-bold text-sm tracking-tight text-slate-300 group-hover:text-white transition-colors">
                          {club.club}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">
                        {cfg.fmt(club[cfg.dataKey])}
                      </span>
                    </motion.div>
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
