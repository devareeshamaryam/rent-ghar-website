 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const steps = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: 26, height: 26 }}>
        <circle cx="16" cy="10" r="5" stroke="#1a2332" strokeWidth="1.8"/>
        <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#1a2332" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M20 7l2 2 4-4" stroke="#c8a84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Create Account",
    desc: "Register in seconds — free forever for agents & sellers.",
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: 26, height: 26 }}>
        <rect x="5" y="4" width="22" height="24" rx="3" stroke="#1a2332" strokeWidth="1.8"/>
        <path d="M10 10h12M10 15h12M10 20h7" stroke="#1a2332" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="5" fill="white" stroke="#c8a84b" strokeWidth="1.5"/>
        <path d="M22 24l1.5 1.5L26 22" stroke="#c8a84b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "List Your Property",
    desc: "Add photos, price & details — go live instantly.",
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" style={{ width: 26, height: 26 }}>
        <path d="M4 20l6-6 5 5 7-8 6 5" stroke="#1a2332" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 12l2 2-2 2" stroke="#c8a84b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Grow Your Agency",
    desc: "Reach thousands of daily buyers across Pakistan.",
  },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function GrowAgency() {
  const [ref, inView] = useInView();

  return (
    <section
      className="relative overflow-hidden bg-[#fffdf0] font-[Nunito,sans-serif]"
      ref={ref}
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(240,192,64,0.08) 0%, transparent 50%), radial-gradient(circle at 5% 90%, rgba(240,192,64,0.06) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-10 sm:px-10 sm:py-14">

        {/* Eyebrow */}
        <p
          className={`mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#c8a84b] transition-all duration-500
            ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          For Agents & Property Owners
        </p>

        {/* Heading */}
        <h2
          className={`mb-3 text-[clamp(24px,3.8vw,44px)] font-black leading-tight text-[#1a2332] transition-all delay-75 duration-500
            ${inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
        >
          List Your Property & Grow Your Agency
        </h2>

        {/* Subtext */}
        <p
          className={`mb-7 max-w-[500px] text-sm leading-relaxed text-[#6b7a8d] transition-all delay-100 duration-500
            ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          Join Pakistan's fastest growing rental portal. Reach thousands of verified buyers and tenants every day with tools built for agents.
        </p>

        {/* Buttons */}
        <div
          className={`mb-9 flex flex-wrap gap-2.5 transition-all delay-150 duration-500
            ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          {[
            {
              href: "/register",
              label: "Register Now",
              icon: (
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              ),
            },
            {
              href: "/listings/create",
              label: "Sign Up Now",
              icon: (
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              ),
            },
            {
              href: "/listings",
              label: "See Listings",
              icon: (
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              ),
            },
          ].map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="inline-flex items-center gap-1.5 rounded-[9px] border-[1.5px] border-[#d0d8e4] bg-transparent
                px-[22px] py-2.5 text-xs font-bold text-[#1a2332] no-underline
                transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1a2332] hover:bg-[#f8faff]"
            >
              {btn.icon}
              {btn.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-7 h-px w-full bg-[#e8edf5]" />

        {/* Steps */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex gap-3.5 rounded-2xl border border-[#e8edf5] bg-white p-5 transition-all duration-500
                hover:border-[#c8a84b] hover:shadow-[0_6px_24px_rgba(200,168,75,0.1)]
                ${inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              {/* Icon box */}
              <div className="shrink-0 rounded-[10px] bg-[#fffbec] p-2.5">
                {s.icon}
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-black tracking-[0.1em] text-[#c8a84b]">
                  {s.num}
                </p>
                <h3 className="mb-1 text-[14px] font-extrabold text-[#1a2332]">
                  {s.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#6b7a8d]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}