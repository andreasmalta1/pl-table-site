import React from "react"

const InfoBit = ({ label, value, color = "text-white" }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
    <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">
      {label}
    </p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
)

export default InfoBit
