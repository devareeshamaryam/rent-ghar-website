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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function GrowAgency() {
  const [ref, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .ga-section {
          font-family: 'Nunito', sans-serif;
          background: #fffdf0;
          position: relative;
          overflow: hidden;
        }

        .ga-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 90% 10%, rgba(240,192,64,0.08) 0%, transparent 50%),
            radial-gradient(circle at 5% 90%, rgba(240,192,64,0.06) 0%, transparent 40%);
          pointer-events: none;
        }

        .ga-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 52px 40px;
        }

        @media (max-width: 600px) {
          .ga-inner { padding: 36px 20px; }
        }

        /* ── Header ── */
        .ga-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c8a84b;
          margin-bottom: 10px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .ga-eyebrow.show { opacity: 1; transform: translateY(0); }

        .ga-heading {
          font-size: clamp(24px, 3.8vw, 44px);
          font-weight: 900;
          color: #1a2332;
          line-height: 1.15;
          margin: 0 0 12px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s;
        }
        .ga-heading.show { opacity: 1; transform: translateY(0); }
        .ga-heading span { color: #c8a84b; }

        .ga-sub {
          font-size: 14px;
          color: #6b7a8d;
          max-width: 500px;
          line-height: 1.7;
          margin: 0 0 28px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s;
        }
        .ga-sub.show { opacity: 1; transform: translateY(0); }

        /* ── CTA buttons ── */
        .ga-btns {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease 0.22s, transform 0.5s ease 0.22s;
        }
        .ga-btns.show { opacity: 1; transform: translateY(0); }

        .ga-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #1a2332;
          color: #ffffff;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 10px 22px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 3px 14px rgba(26,35,50,0.18);
        }
        .ga-btn-primary:hover {
          background: #0f1826;
          color: #f0c040;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26,35,50,0.25);
        }

        .ga-btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f0c040;
          color: #1a2332;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: 10px 22px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 3px 14px rgba(240,192,64,0.3);
        }
        .ga-btn-gold:hover {
          background: #e0b030;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(240,192,64,0.4);
        }

        .ga-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: #1a2332;
          font-family: 'Nunito', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 9px;
          border: 1.5px solid #d0d8e4;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s, background 0.2s;
        }
        .ga-btn-outline:hover {
          border-color: #1a2332;
          background: #f8faff;
          transform: translateY(-2px);
        }

        /* ── Divider ── */
        .ga-divider {
          width: 100%;
          height: 1px;
          background: #e8edf5;
          margin-bottom: 28px;
        }

        /* ── Steps ── */
        .ga-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 700px) {
          .ga-steps { grid-template-columns: 1fr; gap: 12px; }
        }

        .ga-step {
          background: #ffffff;
          border: 1px solid #e8edf5;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.25s;
        }
        .ga-step.show { opacity: 1; transform: translateY(0); }
        .ga-step:hover {
          border-color: #c8a84b;
          box-shadow: 0 6px 24px rgba(200,168,75,0.1);
        }

        .ga-step-num {
          font-size: 10px;
          font-weight: 900;
          color: #c8a84b;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .ga-step-icon {
          background: #fffbec;
          border-radius: 10px;
          padding: 10px;
          flex-shrink: 0;
        }

        .ga-step-title {
          font-size: 14px;
          font-weight: 800;
          color: #1a2332;
          margin: 0 0 4px;
        }

        .ga-step-desc {
          font-size: 12px;
          color: #6b7a8d;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <section className="ga-section" ref={ref}>
        <div className="ga-inner">

          {/* Header */}
          <p className={`ga-eyebrow ${inView ? "show" : ""}`}>For Agents & Property Owners</p>
          <h2 className={`ga-heading ${inView ? "show" : ""}`}>
            List Your Property &{" "}
            <span>Grow Your Agency</span>
          </h2>
          <p className={`ga-sub ${inView ? "show" : ""}`}>
            Join Pakistan's fastest growing rental portal. Reach thousands of verified buyers and tenants every day with tools built for agents.
          </p>

          {/* 3 CTA Buttons */}
          <div className={`ga-btns ${inView ? "show" : ""}`}>
            <Link href="/register" className="ga-btn-primary">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Register Now
            </Link>
            <Link href="/listings/create" className="ga-btn-gold">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Sign Up Now
            </Link>
            <Link href="/listings" className="ga-btn-outline">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
              See Listings
            </Link>
          </div>

          <div className="ga-divider" />

          {/* Steps */}
          <div className="ga-steps">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`ga-step ${inView ? "show" : ""}`}
                style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="ga-step-icon">{s.icon}</div>
                <div>
                  <p className="ga-step-num">{s.num}</p>
                  <h3 className="ga-step-title">{s.title}</h3>
                  <p className="ga-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}