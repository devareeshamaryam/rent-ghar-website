 "use client";

import { useState } from "react";
import PropertyCard from "../components/Propertycard";

const LISTINGS = [
  { id: "1", price: "85 Lac",  type: "House for Rent",     beds: 3, baths: 2, area: "5 Marla",   location: "DHA Phase 5, Lahore",      date: "2 hours ago",  href: "/listings/1", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"] },
  { id: "2", price: "1.2 Cr",  type: "Apartment for Rent", beds: 2, baths: 2, area: "950 Sqft",  location: "Bahria Town, Karachi",      date: "5 hours ago",  href: "/listings/2", images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80"] },
  { id: "3", price: "45 Lac",  type: "Flat for Rent",      beds: 1, baths: 1, area: "3 Marla",   location: "Gulshan-e-Iqbal, Karachi",  date: "1 day ago",    href: "/listings/3", images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80"] },
  { id: "4", price: "2.5 Cr",  type: "House for Rent",     beds: 5, baths: 4, area: "10 Marla",  location: "F-7, Islamabad",            date: "3 hours ago",  href: "/listings/4", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"] },
  { id: "5", price: "65 Lac",  type: "Apartment for Rent", beds: 2, baths: 1, area: "650 Sqft",  location: "Model Town, Lahore",        date: "Today",        href: "/listings/5", images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"] },
  { id: "6", price: "90 Lac",  type: "House for Rent",     beds: 4, baths: 3, area: "7 Marla",   location: "G-11, Islamabad",           date: "2 days ago",   href: "/listings/6", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"] },
  { id: "7", price: "30 Lac",  type: "Flat for Rent",      beds: 1, baths: 1, area: "2 Marla",   location: "Saddar, Rawalpindi",        date: "Today",        href: "/listings/7", images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80"] },
  { id: "8", price: "1.8 Cr",  type: "House for Rent",     beds: 6, baths: 5, area: "1 Kanal",   location: "DHA Phase 2, Islamabad",    date: "4 hours ago",  href: "/listings/8", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"] },
  { id: "9", price: "55 Lac",  type: "Apartment for Rent", beds: 3, baths: 2, area: "1100 Sqft", location: "Clifton, Karachi",          date: "1 day ago",    href: "/listings/9", images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80"] },
];

const CITIES = ["All Cities","Lahore","Karachi","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Gujranwala"];
const AREAS  = ["All Areas","DHA","Bahria Town","Gulshan","Clifton","F-7","G-11","Model Town","Saddar"];
const TYPES  = ["All Types","House","Apartment","Flat","Plot","Commercial","Farmhouse"];
const MARLAS = ["Any Size","2 Marla","3 Marla","5 Marla","7 Marla","10 Marla","1 Kanal","2 Kanal"];
const BEDS   = ["Any","1","2","3","4","5+"];
const BATHS  = ["Any","1","2","3","4+"];

export default function ListingsPage() {
  const [city,  setCity]  = useState("All Cities");
  const [area,  setArea]  = useState("All Areas");
  const [type,  setType]  = useState("All Types");
  const [marla, setMarla] = useState("Any Size");
  const [minP,  setMinP]  = useState("");
  const [maxP,  setMaxP]  = useState("");
  const [beds,  setBeds]  = useState("Any");
  const [baths, setBaths] = useState("Any");

  const chips = [
    city  !== "All Cities" && { label: city,                            clear: () => setCity("All Cities") },
    area  !== "All Areas"  && { label: area,                            clear: () => setArea("All Areas") },
    type  !== "All Types"  && { label: type,                            clear: () => setType("All Types") },
    marla !== "Any Size"   && { label: marla,                           clear: () => setMarla("Any Size") },
    beds  !== "Any"        && { label: `${beds} Bed`,                   clear: () => setBeds("Any") },
    baths !== "Any"        && { label: `${baths} Bath`,                 clear: () => setBaths("Any") },
    (minP || maxP)         && { label: `PKR ${minP||"0"} – ${maxP||"∞"}`, clear: () => { setMinP(""); setMaxP(""); } },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const sel = "bg-white border border-[#dce8f8] text-[#1a2332] text-xs h-8 rounded-lg outline-none cursor-pointer appearance-none px-2.5 pr-7 hover:border-[#1a2332] focus:border-[#1a2332] transition-colors listing-font";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .listing-font { font-family: 'Nunito', sans-serif; }
        .sel-wrap { position: relative; display: inline-flex; }
        .sel-wrap::after {
          content: '';
          position: absolute; right: 9px; top: 50%;
          transform: translateY(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #1a2332;
          pointer-events: none;
        }
      `}</style>

      <main className="listing-font bg-[#f6f9ff] min-h-screen">

        {/* ══ Sticky filter bar ══ */}
        <div className="bg-white border-b border-[#e4edf8] sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">

            <div className="flex flex-wrap gap-2 items-center">

              {/* For Rent */}
              <span className="bg-[#1a2332] text-white text-[11px] font-extrabold px-3.5 h-8 rounded-lg flex items-center shrink-0 tracking-wide">
                For Rent
              </span>

              <div className="sel-wrap">
                <select value={city} onChange={e => setCity(e.target.value)} className={sel}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="sel-wrap">
                <select value={area} onChange={e => setArea(e.target.value)} className={sel}>
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div className="sel-wrap">
                <select value={type} onChange={e => setType(e.target.value)} className={sel}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="sel-wrap">
                <select value={marla} onChange={e => setMarla(e.target.value)} className={sel}>
                  {MARLAS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <input type="number" placeholder="Min Price" value={minP} onChange={e => setMinP(e.target.value)}
                className="bg-white border border-[#dce8f8] text-[#1a2332] text-xs h-8 px-2.5 rounded-lg outline-none w-[88px] focus:border-[#1a2332] transition-colors listing-font placeholder-[#b0c8e0]" />

              <input type="number" placeholder="Max Price" value={maxP} onChange={e => setMaxP(e.target.value)}
                className="bg-white border border-[#dce8f8] text-[#1a2332] text-xs h-8 px-2.5 rounded-lg outline-none w-[88px] focus:border-[#1a2332] transition-colors listing-font placeholder-[#b0c8e0]" />

              <div className="sel-wrap">
                <select value={beds} onChange={e => setBeds(e.target.value)} className={sel}>
                  <option disabled value="Any">Bedrooms</option>
                  {BEDS.map(b => <option key={b}>{b} Bed</option>)}
                </select>
              </div>

              <div className="sel-wrap">
                <select value={baths} onChange={e => setBaths(e.target.value)} className={sel}>
                  <option disabled value="Any">Bathrooms</option>
                  {BATHS.map(b => <option key={b}>{b} Bath</option>)}
                </select>
              </div>

              <button className="ml-auto flex items-center gap-1.5 bg-[#1a2332] text-white hover:text-[#f0c040] text-xs font-bold h-8 px-4 rounded-lg transition-colors shrink-0">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>

            {/* Active chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {chips.map((ch) => (
                  <span key={ch.label} className="inline-flex items-center gap-1 bg-[#eef4ff] border border-[#c8ddf5] text-[#1a2332] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {ch.label}
                    <button onClick={ch.clear} className="text-gray-400 hover:text-[#1a2332] leading-none">✕</button>
                  </span>
                ))}
                <button
                  onClick={() => { setCity("All Cities"); setArea("All Areas"); setType("All Types"); setMarla("Any Size"); setMinP(""); setMaxP(""); setBeds("Any"); setBaths("Any"); }}
                  className="text-[10px] text-red-400 hover:text-red-600 font-semibold">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ Results heading ══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#1a2332]">
              Rental Properties
              {city !== "All Cities" && <span className="text-[#1a4a8a]"> in {city}</span>}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{LISTINGS.length} properties available</p>
          </div>
          <div className="sel-wrap">
            <select className={sel}>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ══ Property Cards Grid — using PropertyCard component ══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {LISTINGS.map((listing) => (
              <PropertyCard
                key={listing.id}
                id={listing.id}
                images={listing.images}
                price={listing.price}
                title={`${listing.type} in ${listing.location.split(",")[0]}`}
                beds={listing.beds}
                baths={listing.baths}
                area={listing.area}
                location={listing.location}
                type={listing.type}
                date={listing.date}
                href={listing.href}
              />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-8">
            <button className="bg-white border-2 border-[#1a2332] text-[#1a2332] font-bold text-sm px-10 py-2.5 rounded-xl hover:bg-[#1a2332] hover:text-[#f0c040] transition-colors">
              Load More Properties
            </button>
          </div>
        </div>

      </main>
    </>
  );
}