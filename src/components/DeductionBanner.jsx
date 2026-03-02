const DeductionBanner = ({ deductions }) => {
  if (deductions.length === 0) return null

  return (
    <div className="space-y-3 mb-8">
      {deductions.map((d, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in slide-in-from-left duration-500"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
            <span className="text-amber-500 font-black italic">!</span>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">
              Point Deduction: {d.team_name}
            </h4>
            <p className="text-sm text-slate-400">
              {d.reason}{" "}
              <span className="text-slate-200 font-bold">
                (-{d.points_deducted} pts)
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeductionBanner
