 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const propertyIcons = [
  {
    label: "Home",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="22" height="25" rx="1.2" />
        <line x1="5" y1="12" x2="27" y2="12" />
        <line x1="16" y1="4" x2="16" y2="29" />
        <rect x="7" y="6" width="6" height="4" rx="0.5" />
        <rect x="19" y="6" width="6" height="4" rx="0.5" />
        <rect x="7" y="14" width="6" height="4" rx="0.5" />
        <rect x="19" y="14" width="6" height="4" rx="0.5" />
        <rect x="12" y="22" width="8" height="7" />
      </svg>
    ),
  },
  {
    label: "Shop",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h24l-3 6H7l-3-6z" />
        <rect x="7" y="18" width="18" height="12" rx="1.2" />
        <rect x="13" y="22" width="6" height="8" />
        <path d="M4 12l3.5-7h17l3.5 7" />
        <line x1="7.5" y1="21" x2="12" y2="21" />
        <line x1="20" y1="21" x2="24.5" y2="21" />
      </svg>
    ),
  },
];

interface RefItem { _id: string; name: string; slug?: string }

export default function HeroSection() {
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [activeIcon,   setActiveIcon]   = useState("Home");
  const [show,         setShow]         = useState(false);
  const [sparkles,     setSparkles]     = useState<Record<string, number>>({});

  const [cities, setCities] = useState<RefItem[]>([]);
  const [areas,  setAreas]  = useState<RefItem[]>([]);
  const [types,  setTypes]  = useState<RefItem[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.data || []));
    fetch('/api/types').then(r => r.json()).then(d => setTypes(d.data || []));
  }, []);

  useEffect(() => {
    if (!selectedCity) { setAreas([]); setSelectedArea(''); return; }
    fetch(`/api/areas?city=${selectedCity}`)
      .then(r => r.json())
      .then(d => setAreas(d.data || []));
    setSelectedArea('');
  }, [selectedCity]);

  const goToListings = (overrideTypeId?: string) => {
    const cityObj = cities.find(c => c._id === selectedCity);
    const areaObj = areas.find(a  => a._id === selectedArea);
    const typeId  = overrideTypeId !== undefined ? overrideTypeId : selectedType;
    const params  = new URLSearchParams();
    if (cityObj?.slug) params.set('city', cityObj.slug);
    if (areaObj?.slug) params.set('area', areaObj.slug);
    if (typeId)        params.set('type', typeId);
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : '/listings');
  };

  const handleIconClick = (label: string) => {
    setActiveIcon(label);
    setSparkles(prev => ({ ...prev, [label]: Date.now() }));
    const matched = types.find(t => t.name.toLowerCase() === label.toLowerCase());
    goToListings(matched?._id ?? '');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .hf { font-family:'Nunito',sans-serif; }

        @keyframes drawRoof {
          from { stroke-dashoffset:1100; } to { stroke-dashoffset:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); }
        }
        @keyframes floatA {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50%     { transform:translateY(-16px) rotate(8deg); }
        }
        @keyframes floatB {
          0%,100% { transform:translateY(0) scale(1); }
          50%     { transform:translateY(-20px) scale(1.12); }
        }
        @keyframes sparkPop {
          0%   { opacity:0; transform:scale(0) rotate(0deg); }
          50%  { opacity:1; transform:scale(1.3) rotate(20deg); }
          100% { opacity:0; transform:scale(0) rotate(40deg); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(240,192,64,0); }
          50%     { box-shadow:0 0 24px 6px rgba(240,192,64,0.3); }
        }
        @keyframes iconBounce {
          0%   { transform:translateY(0) scale(1); }
          35%  { transform:translateY(-7px) scale(1.08); }
          70%  { transform:translateY(-2px) scale(1.02); }
          100% { transform:translateY(0) scale(1); }
        }
        @keyframes shimmer {
          from { background-position:-200% center; }
          to   { background-position:200% center; }
        }

        .roof-path { stroke-dasharray:1100; stroke-dashoffset:1100; }
        .roof-draw { animation:drawRoof 1.3s cubic-bezier(.4,0,.2,1) forwards; }

        .fu1 { animation:fadeUp .6s cubic-bezier(.4,0,.2,1) .45s both; }
        .fu2 { animation:fadeUp .6s cubic-bezier(.4,0,.2,1) .7s  both; }
        .op0 { opacity:0; }

        .ch { opacity:0; transition:opacity .5s ease 1.1s; }
        .ch-show { opacity:1; }

        .fa { animation:floatA 6.5s ease-in-out infinite; }
        .fb { animation:floatB 8.2s ease-in-out 1.2s infinite; }
        .fc { animation:floatA 7.1s ease-in-out 2.4s infinite; }
        .fd { animation:floatB 5.8s ease-in-out .6s infinite; }

        .sp { position:absolute; width:7px; height:7px; border-radius:50%; background:#f0c040; pointer-events:none; }
        .sp1 { top:-9px; left:50%; animation:sparkPop .55s ease forwards; }
        .sp2 { top:14%; right:-11px; animation:sparkPop .55s .07s ease forwards; }
        .sp3 { bottom:-9px; left:27%; animation:sparkPop .55s .13s ease forwards; }
        .sp4 { top:24%; left:-11px; animation:sparkPop .55s .05s ease forwards; }

        .ic-active { animation:glowPulse 2.5s ease-in-out infinite, iconBounce .4s cubic-bezier(.4,0,.2,1); }

        .btn-shine { position:relative; overflow:hidden; }
        .btn-shine::before {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.2) 50%,transparent 65%);
          background-size:200% 100%; opacity:0; transition:opacity .2s;
        }
        .btn-shine:hover::before { opacity:1; animation:shimmer .5s linear; }
      `}</style>

      <section className="hf bg-[#faf9f4] relative overflow-hidden">

        {/* floating blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="fa absolute w-40 h-40 rounded-full bg-[#e8dfc8] opacity-20" style={{top:'2%',left:'1%'}} />
          <div className="fb absolute w-24 h-24 rounded-full bg-[#d4cbb8] opacity-15" style={{top:'25%',right:'4%'}} />
          <div className="fc absolute w-14 h-14 rounded-full bg-[#c8bfa8] opacity-15" style={{top:'9%',right:'17%'}} />
          <div className="fd absolute w-8  h-8  rounded-full bg-amber-300 opacity-25" style={{top:'20%',left:'40%'}} />
          <div className="fa absolute w-5  h-5  rounded-full bg-amber-400 opacity-20" style={{bottom:'20%',left:'22%'}} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" preserveAspectRatio="none">
            <line x1="0" y1="80%" x2="30%" y2="0" stroke="#1a2332" strokeWidth="1.5"/>
            <line x1="100%" y1="65%" x2="72%" y2="0" stroke="#1a2332" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* roof */}
        <div className="relative z-10 flex justify-center pt-3">
          <svg viewBox="0 0 520 135" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-full max-w-lg">
            <polyline className={`roof-path ${show ? 'roof-draw' : ''}`}
              points="8,124 260,12 512,124" stroke="#1a2332" strokeWidth="2.8"/>
            <line className={`ch ${show ? 'ch-show' : ''}`}
              x1="8" y1="124" x2="512" y2="124" stroke="#1a2332" strokeWidth="1.2" opacity="0.12"/>
            <g className={`ch ${show ? 'ch-show' : ''}`} opacity="0.06">
              {[180,120,340,400,60,460].map((x,i) => (
                <line key={i} x1="260" y1="12" x2={x} y2="124" stroke="#1a2332" strokeWidth="1.2"/>
              ))}
            </g>
            <g className={`ch ${show ? 'ch-show' : ''}`}>
              <rect x="368" y="44" width="28" height="56" rx="2.5" fill="#f0ead8" stroke="#1a2332" strokeWidth="1.6"/>
              <rect x="362" y="38" width="40" height="10"  rx="2.5" fill="#e8dfc8" stroke="#1a2332" strokeWidth="1.4"/>
              <path d="M382 36 Q378 25 382 16 Q386 7 381 0" stroke="#1a2332" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.28"/>
              <path d="M393 34 Q398 23 393 14" stroke="#1a2332" strokeWidth="1" strokeDasharray="2 3" opacity="0.16"/>
            </g>
          </svg>
        </div>

        {/* search card */}
        <div className={`relative z-10 px-4 max-w-xl mx-auto -mt-1 ${show ? 'fu1' : 'op0'}`}>
          <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-[0_6px_32px_rgba(26,35,50,0.09)]">

            {/* Search text input */}
            <div className="flex items-center border border-stone-200 rounded-xl px-3 h-11 gap-2.5 mb-2.5 bg-[#f8fafc] focus-within:border-[#1a2332] focus-within:shadow-[0_0_0_3px_rgba(26,35,50,0.07)] transition-all">
              <svg width="15" height="15" fill="none" stroke="#1a4a8a" strokeWidth="2.2" viewBox="0 0 24 24" className="opacity-50 shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search city, area, or property..."
                className="hf flex-1 text-sm text-[#1a2332] bg-transparent outline-none placeholder-stone-400"
                onKeyDown={e => e.key === 'Enter' && goToListings()}
              />
            </div>

            {/* City · Area · Type · Search — one row */}
            <div className="flex gap-2 items-center">

              {/* City */}
              <div className="relative flex-1">
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  className="hf w-full appearance-none bg-white border border-stone-200 text-[#1a2332] text-xs font-semibold h-9 pl-3 pr-6 rounded-xl cursor-pointer transition-colors hover:border-stone-400 focus:outline-none focus:border-[#1a2332]">
                  <option value="">City</option>
                  {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Area */}
              <div className="relative flex-1">
                <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)}
                  disabled={!selectedCity}
                  className="hf w-full appearance-none bg-white border border-stone-200 text-[#1a2332] text-xs font-semibold h-9 pl-3 pr-6 rounded-xl cursor-pointer transition-colors hover:border-stone-400 focus:outline-none focus:border-[#1a2332] disabled:opacity-40 disabled:cursor-not-allowed">
                  <option value="">{selectedCity ? 'Area' : 'Select city'}</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Type */}
              <div className="relative flex-1">
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                  className="hf w-full appearance-none bg-white border border-stone-200 text-[#1a2332] text-xs font-semibold h-9 pl-3 pr-6 rounded-xl cursor-pointer transition-colors hover:border-stone-400 focus:outline-none focus:border-[#1a2332]">
                  <option value="">Type</option>
                  {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* Search button */}
              <button onClick={() => goToListings()}
                className="btn-shine hf shrink-0 flex items-center gap-1.5 bg-[#1a2332] hover:bg-[#243044] text-white text-xs font-bold h-9 px-4 rounded-xl transition-all hover:shadow-[0_4px_16px_rgba(26,35,50,0.25)] active:scale-[0.97]">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* property type icons */}
        <div className={`px-4 pt-5 pb-6 max-w-xl mx-auto ${show ? 'fu2' : 'op0'}`}>
          <div className="flex justify-between sm:justify-center sm:gap-10">
            {propertyIcons.map(({ label, icon }) => {
              const isActive   = activeIcon === label;
              const sparkleKey = sparkles[label];
              return (
                <button key={label} onClick={() => handleIconClick(label)}
                  className="group flex flex-col items-center gap-2 focus:outline-none">
                  <div className="relative">
                    {/* hover ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />

                    {/* sparkles */}
                    {sparkleKey && (
                      <div key={sparkleKey} className="absolute inset-0 pointer-events-none">
                        <div className="sp sp1" /><div className="sp sp2" />
                        <div className="sp sp3" /><div className="sp sp4" />
                      </div>
                    )}

                    {/* icon circle */}
                    <div className={[
                      'w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center border-2',
                      'transition-all duration-200 group-hover:-translate-y-1',
                      isActive
                        ? 'border-[#1a2332] bg-gradient-to-br from-[#f5f0e0] to-[#ede4c8] text-[#1a2332] ic-active'
                        : 'border-stone-200 bg-white text-stone-400 group-hover:border-[#1a2332] group-hover:text-[#1a2332] group-hover:shadow-[0_8px_24px_rgba(26,35,50,0.12)]',
                    ].join(' ')}>
                      {icon}
                    </div>
                  </div>

                  <span className={[
                    'hf text-[11px] sm:text-xs font-semibold transition-colors duration-200',
                    isActive ? 'text-[#1a2332]' : 'text-stone-400 group-hover:text-[#1a2332]',
                  ].join(' ')}>
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