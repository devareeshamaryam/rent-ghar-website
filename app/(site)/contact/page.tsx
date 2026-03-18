 "use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-12 md:p-16">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Left */}
          <div className="flex-1">
            <h1 className="text-4xl font-serif text-[#1a1a2e] mb-4">Get in Touch</h1>
            <p className="text-[#d4a843] italic mb-6">I'd like to hear from you!</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-10">
              If you have any inquiries or just want to say hi, please use the contact form!
            </p>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
              </svg>
              <span className="text-sm text-gray-500">info@rentghars.com</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-[#1a1a2e] transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1a1a2e] transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1a1a2e] transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex-1">
            {submitted ? (
              <div className="flex flex-col items-start justify-center h-full gap-4">
                <p className="text-2xl font-serif text-[#1a1a2e]">Thank you!</p>
                <p className="text-sm text-gray-500">Your message has been sent. I'll get back to you soon.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", message: "" }); }}
                  className="text-sm text-[#d4a843] underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-gray-500">First Name</label>
                    <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required
                      className="border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 text-sm outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/20 transition" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-gray-500">Last Name</label>
                    <input name="lastName" type="text" value={form.lastName} onChange={handleChange}
                      className="border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 text-sm outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/20 transition" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Email <span className="text-[#d4a843]">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 text-sm outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/20 transition" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                    className="border border-gray-200 bg-gray-50 text-gray-800 rounded px-3 py-2 text-sm outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/20 transition resize-none" />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <div className="flex justify-end">
                  <button type="submit" disabled={loading}
                    className="bg-[#1a1a2e] hover:bg-[#d4a843] text-white hover:text-[#1a1a2e] font-bold text-sm px-8 py-2.5 rounded transition disabled:opacity-60 flex items-center gap-2">
                    {loading ? (
                      <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : "Send"}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}