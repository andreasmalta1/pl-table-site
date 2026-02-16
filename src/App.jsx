// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import About from "./pages/About"
import AllTimeTable from "./pages/AllTimeTable"
import CustomDateTable from "./pages/CustomDateTable"
import SeasonTable from "./pages/SeasonTable"
import CalendarTable from "./pages/CalendarTable"
import ManagerList from "./pages/ManagerList"
import PLDashboard from "./pages/PLDashboard"
import SiteAnalytics from "./pages/SiteAnalytics"
import Contact from "./pages/Contact"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const VisitorTracker = () => {
  const location = useLocation()

  useEffect(() => {
    // Send visit data to your Flask backend
    fetch("http://127.0.0.1:5000/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location.pathname }),
    }).catch((err) => console.error("Tracking failed", err))
  }, [location]) // Fires every time the route changes

  return null // This is a "headless" component
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
            <Route path="/youtube" element={<PLDashboard />} />
            <Route path="/stats" element={<SiteAnalytics />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
