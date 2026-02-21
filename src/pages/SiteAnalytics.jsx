import { useState, useEffect } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Users, MousePointer2, Activity, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Loader from "../components/Loader"
import ErrorScreen from "../components/ErrorScreen"
import { apiRequest } from "../utils/api"

const SiteAnalytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiRequest("/visitor-stats")
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (error) return <ErrorScreen error={error} />

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <title>PL Tables | Visitor Stats</title>
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Site Traffic{" "}
          <span className="text-indigo-500 font-normal">Control</span>
        </h1>
        <p className="text-slate-500 mt-2 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live monitoring of platform engagement
        </p>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Total Page Views"
              value={stats.total_views.toLocaleString()}
              icon={<MousePointer2 size={20} />}
              color="indigo"
            />
            <AnalyticsCard
              title="Unique Visitors"
              value={stats.unique_visitors.toLocaleString()}
              icon={<Users size={20} />}
              color="emerald"
            />
            <AnalyticsCard
              title="Avg. Engagement"
              value={(stats.total_views / stats.unique_visitors).toFixed(2)}
              sub="Views per user"
              icon={<Activity size={20} />}
              color="pink"
            />
          </div>

          {/* Traffic Trend Chart */}
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold uppercase italic flex items-center gap-3">
                <Globe className="text-indigo-500" size={20} />
                Traffic Flow (Hashed IP Basis)
              </h2>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* Note: This uses a mock array if your API doesn't provide time-series yet */}
                <AreaChart data={stats.time_series || []}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const AnalyticsCard = ({ title, value, icon, color, sub }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}-500`}>
      {icon}
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
      {title}
    </p>
    <div className="text-4xl font-black text-white tracking-tighter">
      {value}
    </div>
    {sub && (
      <p className="text-slate-600 text-[10px] font-bold mt-1 uppercase">
        {sub}
      </p>
    )}
  </motion.div>
)

export default SiteAnalytics
