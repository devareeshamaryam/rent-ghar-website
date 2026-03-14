 "use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
        <path d="M20 44C20 44 14 40 14 28C14 20.268 20.268 14 28 14C35.732 14 42 20.268 42 28" stroke="#c8a84b" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M44 22C51.732 22 58 28.268 58 36C58 43.732 51.732 50 44 50C36.268 50 30 43.732 30 36C30 28.268 36.268 22 44 22Z" stroke="#c8a84b" strokeWidth="2.2"/>
        <path d="M36 36L41 41L52 30" stroke="#c8a84b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="28" r="5" stroke="#c8a84b" strokeWidth="2.2"/>
      </svg>
    ),
    title: "Connecting Buyers & Sellers",
    desc: "Providing a platform for sellers and buyers to connect & engage with each other.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
        <rect x="10" y="28" width="12" height="24" rx="2" stroke="#c8a84b" strokeWidth="2.2"/>
        <rect x="26" y="18" width="12" height="34" rx="2" stroke="#c8a84b" strokeWidth="2.2"/>
        <rect x="42" y="10" width="12" height="42" rx="2" stroke="#c8a84b" strokeWidth="2.2"/>
      </svg>
    ),
    title: "Real Estate Projects",
    desc: "Builders, Developers & Marketers can post their real estate projects without any charges.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
        <circle cx="32" cy="20" r="8" stroke="#c8a84b" strokeWidth="2.2"/>
        <path d="M16 50C16 41.163 23.163 34 32 34C40.837 34 48 41.163 48 50" stroke="#c8a84b" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M44 28L46 30L52 22" stroke="#c8a84b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Trusted Estate Agents",
    desc: "Property finders can hire the services of our verified and Trusted Estate Agents.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 56 }}>
        <circle cx="32" cy="32" r="20" stroke="#c8a84b" strokeWidth="2.2"/>
        <circle cx="32" cy="32" r="12" stroke="#c8a84b" strokeWidth="2.2"/>
        <circle cx="32" cy="32" r="4" fill="#c8a84b"/>
        <path d="M46 18L52 12" stroke="#c8a84b" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Lead Generation Services",
    desc: "Realtors looking for qualified leads can buy different packages from our platform.",
  },
];

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function WhatWeDo() {
  const [sectionRef, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

        .wwd-section {
          font-family: 'Nunito', sans-serif;
          background: #f5f5f0;
          padding: 80px 24px;
        }

        .wwd-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .wwd-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c8a84b;
          margin-bottom: 10px;
        }

        .wwd-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #1a2332;
          margin: 0 0 14px;
          line-height: 1.2;
        }

        .wwd-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .wwd-divider-line {
          height: 1px;
          width: 36px;
          background: #c8a84b;
          opacity: 0.4;
        }

        .wwd-divider-bar {
          height: 3px;
          width: 36px;
          background: #c8a84b;
          border-radius: 4px;
        }

        .wwd-subtitle {
          font-size: 15px;
          color: #6b7a8d;
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .wwd-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1080px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .wwd-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .wwd-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .wwd-section {
            padding: 48px 16px;
          }
          .wwd-header {
            margin-bottom: 36px;
          }
        }

        .wwd-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 32px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease;
        }

        .wwd-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .wwd-card:hover {
          box-shadow: 0 14px 36px rgba(200,168,75,0.13);
          transform: translateY(-5px);
        }

        .wwd-icon-wrap {
          background: #fdf8ec;
          border-radius: 16px;
          padding: 16px;
          transition: transform 0.3s ease;
        }

        .wwd-card:hover .wwd-icon-wrap {
          transform: scale(1.08);
        }

        .wwd-card-title {
          font-size: 14px;
          font-weight: 800;
          color: #1a2332;
          line-height: 1.4;
          margin: 0;
        }

        .wwd-card-bar {
          width: 28px;
          height: 2px;
          background: #c8a84b;
          border-radius: 4px;
        }

        .wwd-card-desc {
          font-size: 13px;
          color: #6b7a8d;
          line-height: 1.65;
          margin: 0;
        }

        .wwd-fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .wwd-fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section ref={sectionRef} className="wwd-section">

        {/* Header */}
        <div className={`wwd-header wwd-fade-up ${inView ? "visible" : ""}`}>
          <p className="wwd-eyebrow">Our Services</p>
          <h2 className="wwd-title">What We Do</h2>
          <div className="wwd-divider">
            <div className="wwd-divider-line" />
            <div className="wwd-divider-bar" />
            <div className="wwd-divider-line" />
          </div>
          <p className="wwd-subtitle">
            Making the selling and buying of real estate faster, less costly and easier
          </p>
        </div>

        {/* Cards */}
        <div className="wwd-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`wwd-card ${inView ? "visible" : ""}`}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="wwd-icon-wrap">{f.icon}</div>
              <h3 className="wwd-card-title">{f.title}</h3>
              <div className="wwd-card-bar" />
              <p className="wwd-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

      </section>
    </>
  );
}