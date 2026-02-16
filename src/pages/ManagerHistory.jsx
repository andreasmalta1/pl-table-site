const ManagerHistory = ({ type }) => {
  const [managers, setManagers] = useState([])
  const [selectedManagerData, setSelectedManagerData] = useState(null)

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {managers.map((m) => (
          <button
            key={m.id}
            onClick={() => fetchManagerTable(m.id)}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left hover:border-indigo-500 transition-all group"
          >
            <h3 className="text-lg font-bold group-hover:text-indigo-400">
              {m.name}
            </h3>
            <p className="text-slate-500 text-sm">
              {m.club} • Since {m.appointed}
            </p>
          </button>
        ))}
      </div>
      {selectedManagerData && (
        <DataTable
          data={selectedManagerData}
          title={`Table under ${currentManagerName}`}
        />
      )}
    </div>
  )
}

export default ManagerHistory
