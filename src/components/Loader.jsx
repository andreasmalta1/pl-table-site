import { Loader2 } from "lucide-react"

const Loader = () => {
  return (
    <div className="h-64 flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800/50">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
      <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">
        Compiling Standings...
      </span>
    </div>
  )
}

export default Loader
