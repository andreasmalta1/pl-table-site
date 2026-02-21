const StatCard = ({ label, value, icon }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="text-3xl font-black text-white tracking-tighter">
        {value}
      </div>
    </div>
    <div className="p-4 bg-slate-800/50 rounded-2xl">{icon}</div>
  </div>
)

export default StatCard
