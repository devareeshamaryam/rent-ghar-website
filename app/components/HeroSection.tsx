 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const propertyIcons = [
  {
    label: "Home",
    typeSlug: "home",
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13.5L16 3l13 10.5" />
        <rect x="6" y="13.5" width="20" height="16" rx="1.2" />
        <rect x="12" y="20" width="8" height="9.5" />
        <rect x="7.5" y="15.5" width="5" height="4.5" rx="0.6" />
        <rect x="19.5" y="15.5" width="5" height="4.5" rx="0.6" />
      </svg>
    ),
  },
  {
    label: "Apartment",
    typeSlug: "apartment",
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="24" height="27" rx="1.2" />
        <line x1="4" y1="11" x2="28" y2="11" />
        <line x1="4" y1="19" x2="28" y2="19" />
        <rect x="7" y="5" width="4.5" height="4" rx="0.5" />
        <rect x="20.5" y="5" width="4.5" height="4" rx="0.5" />
        <rect x="7" y="13" width="4.5" height="4" rx="0.5" />
        <rect x="20.5" y="13" width="4.5" height="4" rx="0.5" />
        <rect x="13" y="5" width="6" height="4" rx="0.5" />
        <rect x="13" y="13" width="6" height="4" rx="0.5" />
        <rect x="13" y="22" width="6" height="8" />
      </svg>
    ),
  },
  {
    label: "Flat",
    typeSlug: "flat",
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="22" height="25" rx="1.2" />
        <line x1="5" y1="12" x2="27" y2="12" />
        <line x1="16" y1="4" x2="16" y2="29" />
        <rect x="7" y="6" width="6" height="4" rx="0.5" />
        <rect x="19" y="6" width="6" height="4" rx="0.5" />
        <rect x="7" y="14" width="6" height="4" rx="0.5" />
        <rect x="19" y="14" width="6" height="4" rx="0.5" />
        <rect x="12" y="22" width="8" height="7" />
        <circle cx="18.5" cy="25.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Shop",
    typeSlug: "shop",
    icon: (
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h24l-3 6H7l-3-6z" />
        <rect x="7" y="18" width="18" height="12" rx="1.2" />
        <rect x="13" y="22" width="6" height="8" />
        <path d="M4 12l3.5-7h17l3.5 7" />
        <line x1="7.5" y1="21" x2="12" y2="21" />
        <line x1="20" y1="21" x2="24.5" y2="21" />
        <circle cx="24.5" cy="25" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

interface RefItem { _id: string; name: string; slug?: string }

export default function HeroSection() {
  const router = useRouter();

  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedCity, setSelectedCity] = useState("");   // stores _id
  const [selectedArea, setSelectedArea] = useState("");   // stores _id
  const [selectedType, setSelectedType] = useState("");   // stores _id
  const [activeIcon,   setActiveIcon]   = useState("Home");
  const [show,         setShow]         = useState(false);
  const [sparkles,     setSparkles]     = useState<Record<string, number>>({});

  const [cities, setCities] = useState<RefItem[]>([]);
  const [areas,  setAreas]  = useState<RefItem[]>([]);
  const [types,  setTypes]  = useState<RefItem[]>([]);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Load cities & types once
  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.data || []));
    fetch('/api/types').then(r => r.json()).then(d => setTypes(d.data || []));
  }, []);

  // Load areas when city changes
  useEffect(() => {
    if (!selectedCity) { setAreas([]); setSelectedArea(''); return; }
    fetch(`/api/areas?city=${selectedCity}`)
      .then(r => r.json())
      .then(d => setAreas(d.data || []));
    setSelectedArea('');
  }, [selectedCity]);

  const triggerSparkle = (label: string) => {
    setActiveIcon(label);
    setSparkles(prev => ({ ...prev, [label]: Date.now() }));
  };

  // ── Navigate to listings with filters ──────────────────────
  const goToListings = (overrideTypeId?: string) => {
    const cityObj = cities.find(c => c._id === selectedCity);
    const areaObj = areas.find(a  => a._id === selectedArea);
    const typeId  = overrideTypeId ?? selectedType;

    const params = new URLSearchParams();
    if (cityObj?.slug) params.set('city', cityObj.slug);
    if (areaObj?.slug) params.set('area', areaObj.slug);
    if (typeId)        params.set('type', typeId);

    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : '/listings');
  };

  // Icon click — match type by name (case-insensitive) then navigate
  const handleIconClick = (label: string) => {
    triggerSparkle(label);

    // Find matching type from API by name
    const matched = types.find(
      t => t.name.toLowerCase() === label.toLowerCase()
    );
    goToListings(matched?._id ?? '');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .hs * { box-sizing: border-box; }
        .hs { font-family: 'DM Sans', sans-serif; }

        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(0deg); opacity:.18; }
          33%      { transform: translateY(-18px) rotate(12deg); opacity:.3; }
          66%      { transform: translateY(-8px) rotate(-6deg); opacity:.22; }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) scale(1); opacity:.12; }
          50%      { transform: translateY(-22px) scale(1.2); opacity:.25; }
        }
        @keyframes floatC {
          0%,100% { transform: translate(0,0); opacity:.1; }
          40%      { transform: translate(8px,-14px); opacity:.22; }
          80%      { transform: translate(-5px,-6px); opacity:.15; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(.85); opacity:.6; }
          70%  { transform: scale(1.3); opacity:0; }
          100% { transform: scale(1.3); opacity:0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sparkle-pop {
          0%   { opacity:0; transform:scale(0) rotate(0deg); }
          50%  { opacity:1; transform:scale(1.2) rotate(20deg); }
          100% { opacity:0; transform:scale(0) rotate(40deg); }
        }
        @keyframes drawRoof {
          from { stroke-dashoffset: 1100; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeSlideUp2 {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(240,192,64,0); }
          50%      { box-shadow: 0 0 20px 4px rgba(240,192,64,0.22); }
        }
        @keyframes iconBounce {
          0%   { transform: translateY(0) scale(1); }
          30%  { transform: translateY(-6px) scale(1.06); }
          60%  { transform: translateY(-2px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }

        .p1 { animation: floatA 6.2s ease-in-out infinite; }
        .p2 { animation: floatB 7.8s ease-in-out 1s infinite; }
        .p3 { animation: floatC 5.4s ease-in-out 0.5s infinite; }
        .p4 { animation: floatA 8.1s ease-in-out 2s infinite; }
        .p5 { animation: floatB 5.9s ease-in-out 1.5s infinite; }
        .p6 { animation: floatC 6.7s ease-in-out 0.8s infinite; }
        .p7 { animation: floatA 4.8s ease-in-out 3s infinite; }

        .roof-path { stroke-dasharray: 1100; stroke-dashoffset: 1100; }
        .roof-path.draw { animation: drawRoof 1.2s cubic-bezier(.4,0,.2,1) forwards; }
        .chimney-group { opacity: 0; transition: opacity .5s ease 1.1s; }
        .chimney-group.show { opacity: 1; }

        .search-card { opacity: 0; }
        .search-card.show { animation: fadeSlideUp .6s cubic-bezier(.4,0,.2,1) .6s forwards; }
        .icons-row { opacity: 0; }
        .icons-row.show { animation: fadeSlideUp2 .55s cubic-bezier(.4,0,.2,1) .85s forwards; }

        .ic-btn { position: relative; transition: transform .2s cubic-bezier(.4,0,.2,1); }
        .ic-btn:hover { transform: translateY(-5px) scale(1.04); }
        .ic-btn:hover .ic-ring { opacity: 1; animation: pulse-ring .7s ease-out; }

        .ic-circle {
          transition: border-color .2s, background .2s, box-shadow .2s, color .2s;
          position: relative; overflow: hidden;
        }
        .ic-btn:hover .ic-circle::after {
          content: ''; position: absolute; inset: 0; border-radius: 9999px;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmer .5s linear forwards;
        }
        .ic-circle.active {
          border-color: #1a2332 !important;
          background: linear-gradient(135deg, #f5f0e0 0%, #ede4c8 100%) !important;
          color: #1a2332 !important;
          box-shadow: 0 8px 28px rgba(26,35,50,0.16), 0 0 0 3px rgba(240,192,64,0.25) !important;
          animation: glowPulse 2.2s ease-in-out infinite, iconBounce .45s cubic-bezier(.4,0,.2,1);
        }
        .ic-circle:not(.active) {
          border-color: #dde4f0; background: #fff; color: #94a3b8;
          box-shadow: 0 2px 10px rgba(26,35,50,0.05);
        }
        .ic-btn:hover .ic-circle:not(.active) {
          border-color: #1a2332; color: #1a2332;
          box-shadow: 0 8px 24px rgba(26,35,50,0.14);
        }

        .ic-ring {
          position: absolute; inset: -4px; border-radius: 9999px;
          border: 2px solid rgba(240,192,64,0.5); opacity: 0; pointer-events: none;
        }

        .sparkle { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #f0c040; pointer-events: none; }
        .sp1 { top:-8px; left:50%; animation: sparkle-pop .6s ease forwards; }
        .sp2 { top:20%; right:-10px; animation: sparkle-pop .6s .08s ease forwards; }
        .sp3 { bottom:-8px; left:30%; animation: sparkle-pop .6s .14s ease forwards; }
        .sp4 { top:30%; left:-10px; animation: sparkle-pop .6s .06s ease forwards; }

        .s-input-wrap { transition: border-color .2s, box-shadow .2s; }
        .s-input-wrap:focus-within {
          border-color: #1a2332 !important;
          box-shadow: 0 0 0 3px rgba(26,35,50,0.07), 0 0 18px rgba(240,192,64,0.12);
        }
        .s-select { -webkit-appearance: none; appearance: none; }
        .s-select:focus { border-color: #1a2332; outline: none; }

        .find-btn {
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .find-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
          background-size: 200% 100%; opacity: 0; transition: opacity .2s;
        }
        .find-btn:hover::before { opacity: 1; animation: shimmer .5s linear; }
        .find-btn:hover {
          box-shadow: 0 6px 22px rgba(26,35,50,0.22), 0 0 0 2px rgba(240,192,64,0.3);
          transform: translateY(-1px);
        }
        .find-btn:active { transform: scale(.97); }
        .ic-label-active { color: #1a2332; font-weight: 600; }
        .ic-label-inactive { color: #94a3b8; font-weight: 400; }
      `}</style>

      <section className="hs bg-[#faf9f4] overflow-hidden relative">

        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="p1 absolute w-44 h-44 rounded-full bg-[#e8dfc8]" style={{ top:"2%", left:"1%", opacity:.18 }} />
          <div className="p2 absolute w-28 h-28 rounded-full bg-[#d4cbb8]" style={{ top:"28%", right:"3%", opacity:.13 }} />
          <div className="p3 absolute w-16 h-16 rounded-full bg-[#c8bfa8]" style={{ top:"8%", right:"16%", opacity:.14 }} />
          <div className="p4 absolute w-10 h-10 rounded-full bg-[#1a2332]" style={{ top:"55%", left:"6%", opacity:.05 }} />
          <div className="p5 absolute w-9 h-9 rounded-full bg-[#f0c040]" style={{ top:"18%", left:"38%", opacity:.18 }} />
          <div className="p6 absolute w-6 h-6 rounded-full bg-[#1a2332]" style={{ bottom:"15%", right:"12%", opacity:.06 }} />
          <div className="p7 absolute w-5 h-5 rounded-full bg-[#f0c040]" style={{ bottom:"22%", left:"22%", opacity:.15 }} />
          <svg className="absolute inset-0 w-full h-full" style={{ opacity:.04 }} preserveAspectRatio="none">
            <line x1="0" y1="80%" x2="30%" y2="0" stroke="#1a2332" strokeWidth="1"/>
            <line x1="100%" y1="60%" x2="70%" y2="0" stroke="#1a2332" strokeWidth="1"/>
          </svg>
        </div>

        {/* Roof SVG */}
        <div className="relative flex justify-center pt-2 pb-0 z-10">
          <svg viewBox="0 0 520 135" fill="none" strokeLinecap="round" strokeLinejoin="round"
            className="w-full max-w-lg" style={{ display:"block" }}>
            <polyline
              className={`roof-path ${show ? "draw" : ""}`}
              points="8,124 260,12 512,124"
              stroke="#1a2332" strokeWidth="2.6"
            />
            <line x1="8" y1="124" x2="512" y2="124" stroke="#1a2332" strokeWidth="1.2" opacity="0.15"
              className={`chimney-group ${show ? "show" : ""}`} />
            <g className={`chimney-group ${show ? "show" : ""}`} opacity="0.07">
              <line x1="260" y1="12" x2="180" y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              <line x1="260" y1="12" x2="120" y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              <line x1="260" y1="12" x2="340" y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              <line x1="260" y1="12" x2="400" y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              <line x1="260" y1="12" x2="60"  y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              <line x1="260" y1="12" x2="460" y2="124" stroke="#1a2332" strokeWidth="1.2"/>
            </g>
            <g className={`chimney-group ${show ? "show" : ""}`}>
              <rect x="370" y="46" width="26" height="54" rx="2" fill="#f0ead8" stroke="#1a2332" strokeWidth="1.6"/>
              <rect x="365" y="40" width="36" height="9"  rx="2" fill="#e8dfc8" stroke="#1a2332" strokeWidth="1.4"/>
              <path d="M383 38 Q379 27 383 18 Q387 9 382 1" stroke="#1a2332" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.32"/>
              <path d="M393 36 Q398 25 393 16" stroke="#1a2332" strokeWidth="1" strokeDasharray="2 3" opacity="0.2"/>
            </g>
          </svg>
        </div>

        {/* Search Card */}
        <div className={`search-card ${show ? "show" : ""} relative z-10 px-4 max-w-xl mx-auto -mt-1`}>
          <div className="bg-white border border-[#e2e8f4] rounded-2xl px-3 py-3 shadow-[0_6px_32px_rgba(26,35,50,0.09)]">

            {/* Search input */}
            <div className="s-input-wrap flex items-center border border-[#e8edf5] rounded-xl px-3 h-11 gap-2.5 mb-2.5 bg-[#f8fafc]">
              <svg width="15" height="15" fill="none" stroke="#1a4a8a" strokeWidth="2.2" viewBox="0 0 24 24" style={{ opacity:.55, flexShrink:0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search city, area, or property..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && goToListings()}
                className="flex-1 text-sm text-[#1a2332] bg-transparent outline-none"
                style={{ fontFamily:"'DM Sans',sans-serif" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ color:"#aab4c4" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Selects + button */}
            <div className="grid grid-cols-2 sm:flex gap-2">

              {/* City */}
              <div className="relative">
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  className="s-select w-full bg-[#f8fafc] border border-[#e8edf5] text-[#1a2332] text-xs h-9 pl-3 pr-7 rounded-xl cursor-pointer"
                  style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  <option value="">City</option>
                  {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" opacity="0.4"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Area */}
              <div className="relative">
                <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)}
                  className="s-select w-full bg-[#f8fafc] border border-[#e8edf5] text-[#1a2332] text-xs h-9 pl-3 pr-7 rounded-xl cursor-pointer disabled:opacity-50"
                  style={{ fontFamily:"'DM Sans',sans-serif" }}
                  disabled={!selectedCity}>
                  <option value="">{selectedCity ? 'Area' : 'Select city'}</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" opacity="0.4"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Type */}
              <div className="relative col-span-1">
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="s-select w-full bg-[#f8fafc] border border-[#e8edf5] text-[#1a2332] text-xs h-9 pl-3 pr-7 rounded-xl cursor-pointer"
                  style={{ fontFamily:"'DM Sans',sans-serif" }}>
                  <option value="">Type</option>
                  {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" opacity="0.4"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Search btn */}
              <button
                onClick={() => goToListings()}
                className="find-btn col-span-1 flex items-center justify-center gap-1.5 bg-[#1a2332] text-white text-xs font-semibold h-9 px-5 rounded-xl"
                style={{ fontFamily:"'DM Sans',sans-serif" }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Property Type Icons */}
        <div className={`icons-row ${show ? "show" : ""} px-4 pt-4 pb-5 max-w-xl mx-auto`}>
          <div className="flex justify-between sm:justify-center sm:gap-8">
            {propertyIcons.map(({ label, icon }) => {
              const isActive   = activeIcon === label;
              const sparkleKey = sparkles[label];
              return (
                <button key={label} onClick={() => handleIconClick(label)}
                  className="ic-btn flex flex-col items-center gap-2">
                  <div style={{ position:"relative", display:"inline-flex", flexDirection:"column", alignItems:"center" }}>
                    <div className="ic-ring" />
                    {sparkleKey && (
                      <div key={sparkleKey} style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                        <div className="sparkle sp1" />
                        <div className="sparkle sp2" />
                        <div className="sparkle sp3" />
                        <div className="sparkle sp4" />
                      </div>
                    )}
                    <div className={`ic-circle w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 ${isActive ? "active" : ""}`}>
                      {icon}
                    </div>
                  </div>
                  <span className={`text-[11px] sm:text-xs ${isActive ? "ic-label-active" : "ic-label-inactive"}`}
                    style={{ fontFamily:"'DM Sans',sans-serif", transition:"color .2s" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </section>
    </>
  );
}