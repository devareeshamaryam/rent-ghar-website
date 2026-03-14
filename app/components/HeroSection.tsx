 "use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan"];
const areas = ["All Areas", "DHA", "Bahria Town", "Gulshan", "Clifton", "F-7", "G-11", "Model Town"];
const propertyTypes = ["Property Type", "House", "Apartment", "Plot", "Commercial", "Farmhouse", "Room"];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedType, setSelectedType] = useState("Property Type");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .hero-font { font-family: 'Nunito', sans-serif; }
      `}</style>

      <section className="hero-font bg-[#fffdf0] overflow-hidden">

        {/* ── Slogan ── */}
        <div
          className={`text-center px-4 pt-7 pb-4 transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-[22px] sm:text-3xl md:text-4xl lg:text-5xl font-700 text-[#1a2332] leading-snug tracking-tight">
            Ab har ghar ka{" "}
            <span className="relative inline-block cursor-default font-700">
              pata yahan se
              <span
                className={`absolute bottom-0 left-0 h-[2.5px] bg-[#f0c040] rounded transition-all duration-700 ease-out ${show ? "w-full" : "w-0"}`}
                style={{ transitionDelay: "0.6s" }}
              />
            </span>
          </h1>
        </div>

        {/* ── Filter Card ── */}
        <div
          className={`px-4 pb-0 max-w-2xl mx-auto transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionDelay: "0.3s" }}
        >
          <div className="bg-white border border-[#e8edf5] rounded-xl p-2 sm:p-3 shadow-sm">

            {/* Search bar */}
            <div className="flex items-center bg-[#f8faff] border border-[#e0eaf5] rounded-lg px-2.5 h-8 sm:h-9 gap-2 mb-1.5 sm:mb-2 focus-within:border-[#1a2332] transition-colors">
              <svg className="text-[#1a4a8a] shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by building, area, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs text-[#1a2332] placeholder-[#a0b4c8] bg-transparent outline-none hero-font"
              />
            </div>

            {/* Filters — mobile: 2-col grid | desktop: one row */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5">

              {/* For Rent — full width on mobile */}
              <div className="col-span-2 sm:col-auto flex items-center justify-center bg-[#1a2332] text-white font-700 text-[10px] sm:text-xs px-3 h-7 sm:h-8 rounded-md shrink-0 tracking-wide">
                For Rent
              </div>

              {/* City */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full sm:flex-1 bg-[#f8faff] border border-[#e0eaf5] text-[#1a2332] text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2 rounded-md outline-none cursor-pointer appearance-none focus:border-[#1a2332] transition-colors hero-font"
              >
                <option disabled value="Select City">Select City</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>

              {/* Area */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full sm:flex-1 bg-[#f8faff] border border-[#e0eaf5] text-[#1a2332] text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2 rounded-md outline-none cursor-pointer appearance-none focus:border-[#1a2332] transition-colors hero-font"
              >
                {areas.map((a) => <option key={a}>{a}</option>)}
              </select>

              {/* Property Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full sm:flex-1 bg-[#f8faff] border border-[#e0eaf5] text-[#1a2332] text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-2 rounded-md outline-none cursor-pointer appearance-none focus:border-[#1a2332] transition-colors hero-font"
              >
                {propertyTypes.map((t) => <option key={t}>{t}</option>)}
              </select>

              {/* Find button — full width on mobile */}
              <button className="col-span-2 sm:col-auto flex items-center justify-center gap-1.5 bg-[#1a2332] text-white hover:text-[#f0c040] font-700 text-[10px] sm:text-xs h-7 sm:h-8 px-4 sm:px-5 rounded-md shrink-0 hover:bg-[#1a2332] transition-colors active:scale-95 hero-font">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Find
              </button>
            </div>
          </div>
        </div>

        {/* ── Villas Strip ── */}
        <div
          className={`relative w-full h-48 sm:h-64 mt-2 overflow-hidden transition-all duration-700 ease-out
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.55s" }}
        >
          <Image
            src="/hello.jpg"
            alt="Villas"
            fill
            style={{ objectFit: "cover", objectPosition: "center bottom" }}
            priority
          />
        </div>

      </section>
    </>
  );
}