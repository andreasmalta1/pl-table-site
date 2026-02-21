import { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import About from "./pages/About"
import AllTimeTable from "./pages/AllTimeTable"
import CustomDateTable from "./pages/CustomDateTable"
import SeasonTable from "./pages/SeasonTable"
import CalendarTable from "./pages/CalendarTable"
import ManagerList from "./pages/ManagerList"
import YouTubeStats from "./pages/YouTubeStats"
import SiteAnalytics from "./pages/SiteAnalytics"
import Contact from "./pages/Contact"
import { apiRequest } from "./utils/api"

const VisitorTracker = () => {
  const location = useLocation()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await apiRequest("/track-visit", {
          method: "POST",
          body: JSON.stringify({ path: location.pathname }),
        })
      } catch (err) {
        console.warn("Analytics ping failed.")
      }
    }

    trackVisit()
  }, [location.pathname]) // Only refires when the path changes

  return null
}

function App() {
  return (
    <Router>
      <VisitorTracker />
      <div className="min-h-screen bg-[#020617] text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <Routes>
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
            <Route path="/stats" element={<SiteAnalytics />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
