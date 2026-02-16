export const Contact = () => (
  <div className="max-w-xl bg-slate-900 p-10 rounded-3xl border border-slate-800">
    <h2 className="text-2xl font-bold mb-6 italic uppercase">Get in Touch</h2>
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
      />
      <textarea
        placeholder="Message"
        className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 h-32"
      />
      <button className="w-full bg-indigo-600 py-3 rounded-xl font-black uppercase">
        Send Message
      </button>
    </form>
  </div>
)

export default Contact
