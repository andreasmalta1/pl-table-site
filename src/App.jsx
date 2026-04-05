import { useEffect } from "react"
import { Routes, Route, useLocation, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import About from "./pages/About"
import AllTimeTable from "./pages/AllTimeTable"
import CustomDateTable from "./pages/CustomDateTable"
import SeasonTable from "./pages/SeasonTable"
import CalendarTable from "./pages/CalendarTable"
import ManagerList from "./pages/ManagerList"
import YouTubeStats from "./pages/YouTubeStats"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import SiteAnalytics from "./pages/admin/SiteAnalytics"
import AddTeam from "./pages/admin/AddTeam"
import AddNation from "./pages/admin/AddNation"
import AddManager from "./pages/admin/AddManager"
import AddStint from "./pages/admin/AddStint"
import EndStint from "./pages/admin/EndStint"
import AddDeductions from "./pages/admin/AddDeductions"
import NewSeason from "./pages/admin/NewSeason"
import AddMatch from "./pages/admin/AddMatch"
import { apiPostRequest } from "./utils/api"

const VisitorTracker = () => {
  const location = useLocation()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await apiPostRequest("/track-visit", {
          method: "POST",
          body: JSON.stringify({ path: location.pathname }),
        })
      } catch {
        console.warn("Analytics ping failed.")
      }
    }

    trackVisit()
  }, [location.pathname])

  return null
}

const AdminLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
)

function App() {
  return (
    <>
      <VisitorTracker />
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="add-team" element={<AddTeam />} />
              <Route path="add-nation" element={<AddNation />} />
              <Route path="add-manager" element={<AddManager />} />
              <Route path="add-stint" element={<AddStint />} />
              <Route path="end-stint" element={<EndStint />} />
              <Route path="add-deduction" element={<AddDeductions />} />
              <Route path="new-season" element={<NewSeason />} />
              <Route path="add-match" element={<AddMatch />} />
              <Route path="stats" element={<SiteAnalytics />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/all-time" element={<AllTimeTable />} />
            <Route path="/custom-range" element={<CustomDateTable />} />
            <Route path="/seasons" element={<SeasonTable />} />
            <Route path="/calendar" element={<CalendarTable />} />
            <Route path="/managers" element={<ManagerList type="current" />} />
            <Route
              path="/past-managers"
              element={<ManagerList type="past" />}
            />
            <Route path="/youtube" element={<YouTubeStats />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
