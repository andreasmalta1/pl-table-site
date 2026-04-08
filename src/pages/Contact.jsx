import { useState } from "react"
import { MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { adminPostRequest } from "../utils/api"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Data Correction",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminPostRequest("/contact", formData)
      console.log("Email sent successfully")
      setFormData({
        name: "",
        email: "",
        subject: "Data Correction",
        message: "",
      })
    } catch (err) {
      console.log(err.message)
    } finally {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Message <span className="text-emerald-500">Received</span>
        </h1>
        <p className="text-slate-400 mt-4 max-w-md">
          Our data integrity team has been notified. We'll review your inquiry
          and get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Side: Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
              Get in <span className="text-indigo-500">Touch</span>
            </h1>
            <p className="text-slate-400 mt-6 text-lg leading-relaxed">
              Have you spotted a historical inaccuracy? Or perhaps a manager's
              face is missing? Our goal is the most accurate Premier League
              database. Let us know.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <MessageSquare size={120} className="text-indigo-500" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-2 focus:ring-2 ring-indigo-500 outline-none transition-all text-white"
                  placeholder="John Doe"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-2 focus:ring-2 ring-indigo-500 outline-none transition-all text-white"
                  placeholder="john@example.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Subject
              </label>
              <select
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-2 focus:ring-2 ring-indigo-500 outline-none cursor-pointer text-white appearance-none"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option>Data Correction</option>
                <option>Technical Issue</option>
                <option>Partnership Inquiry</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full bg-slate-800 border-none rounded-2xl p-4 mt-2 focus:ring-2 ring-indigo-500 outline-none transition-all text-white resize-none"
                placeholder="How can we help?"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3">
              <Send size={18} />
              Transmit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
