import { Link } from "react-router-dom"
import {
  PlusCircle,
  Users,
  Trophy,
  ShieldAlert,
  Calendar,
  ArrowUpCircle,
  History,
} from "lucide-react"

const AdminDashboard = () => {
  const adminLinks = [
    {
      label: "New Team",
      path: "add-team",
      icon: <PlusCircle />,
      color: "bg-blue-500",
    },
    {
      label: "New Nation",
      path: "add-nation",
      icon: <Trophy />,
      color: "bg-emerald-500",
    },
    {
      label: "New Manager",
      path: "add-manager",
      icon: <Users />,
      color: "bg-purple-500",
    },
    {
      label: "Start Stint",
      path: "start-stint",
      icon: <History />,
      color: "bg-indigo-500",
    },
    {
      label: "End Stint",
      path: "end-stint",
      icon: <ArrowUpCircle />,
      color: "bg-orange-500",
    },
    {
      label: "Deductions",
      path: "add-deduction",
      icon: <ShieldAlert />,
      color: "bg-rose-500",
    },
    {
      label: "New Season",
      path: "new-season",
      icon: <Calendar />,
      color: "bg-pink-500",
    },
    {
      label: "Add Match",
      path: "add-match",
      icon: <Trophy />,
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter">
        System <span className="text-indigo-500">Admin</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adminLinks.map((link) => (
          <Link
            key={link.path}
            to={`/admin/${link.path}`}
            className="group p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-indigo-500 transition-all flex flex-col items-center text-center"
          >
            <div
              className={`${link.color} p-4 rounded-2xl mb-4 text-white shadow-lg shadow-black/20`}
            >
              {link.icon}
            </div>
            <span className="font-bold uppercase text-xs tracking-widest">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
