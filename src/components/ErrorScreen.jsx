import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Link } from "react-router-dom"

const ErrorScreen = ({ message, retryAction }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem] text-center animate-in fade-in zoom-in duration-300">
      <div className="p-4 bg-rose-500/10 rounded-full mb-6 border border-rose-500/20">
        <AlertTriangle className="text-rose-500" size={40} />
      </div>

      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
        Data Connection Failed
      </h2>

      <p className="text-slate-500 max-w-sm text-sm mb-8 font-medium">
        {message ||
          "We couldn't reach the statistics server. This might be due to a temporary outage or a CORS configuration issue."}
      </p>

      <div className="flex gap-4">
        {retryAction && (
          <button
            onClick={retryAction}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
          >
            <RefreshCcw size={14} /> Retry Request
          </button>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-700 transition-all"
        >
          <Home size={14} /> Back Home
        </Link>
      </div>
    </div>
  )
}

export default ErrorScreen
