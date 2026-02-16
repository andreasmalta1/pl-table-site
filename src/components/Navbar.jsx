import { Link } from "react-router-dom"

const Navbar = () => (
  <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-6 items-center justify-between">
      <Link to="/" className="text-xl font-black italic tracking-tighter">
        PL<span className="text-indigo-500">STATS</span>
      </Link>
      <div className="flex gap-4 text-xs font-bold uppercase text-slate-400">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <Link to="/all-time" className="hover:text-white">
          All-Time
        </Link>
        <Link to="/seasons" className="hover:text-white">
          Seasons
        </Link>
        <Link to="/managers" className="hover:text-white">
          Managers
        </Link>
        <Link to="/youtube" className="hover:text-white text-indigo-400">
          YouTube
        </Link>
        <Link to="/stats" className="hover:text-white text-indigo-400">
          Stats
        </Link>
      </div>
    </div>
  </nav>
)

export default Navbar
