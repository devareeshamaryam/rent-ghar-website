 "use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const cities = [
  { name: "Lahore",      country: "Pakistan", properties: 107, image: "/lahore.jpg",      href: "/listings?city=lahore" },
  { name: "Islamabad",   country: "Pakistan", properties: 84,  image: "/islamabad.jpg",   href: "/listings?city=islamabad" },
  { name: "Karachi",     country: "Pakistan", properties: 63,  image: "/karachi.jpg",     href: "/listings?city=karachi" },
  { name: "Multan",      country: "Pakistan", properties: 41,  image: "/multan.jpg",      href: "/listings?city=multan" },
  { name: "Faisalabad",  country: "Pakistan", properties: 29,  image: "/faisalabad.jpg",  href: "/listings?city=faisalabad" },
  { name: "Gujranwala",  country: "Pakistan", properties: 18,  image: "/gujranwala.jpg",  href: "/listings?city=gujranwala" },
];

export default function PopularLocations() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .loc-font { font-family: 'Nunito', sans-serif; }
        .city-card-img { transition: transform 0.5s ease; }
        .city-card:hover .city-card-img { transform: scale(1.07); }
        .card-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .card-fade.show { opacity: 1; transform: translateY(0); }
      `}</style>

      <section className="loc-font bg-white px-4 sm:px-6 lg:px-10 py-7" ref={ref}>

        {/* Header */}
        <div className={`flex items-end justify-between mb-4 card-fade ${visible ? "show" : ""}`}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2332] leading-tight">
              Explore Popular Locations
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-500 mt-0.5">
              Find rentals in Pakistan&apos;s most sought-after cities
            </p>
          </div>
          <Link
            href="/listings"
            className="flex items-center gap-1 text-xs font-bold text-[#1a2332] hover:text-[#f0c040] transition-colors whitespace-nowrap ml-4"
          >
            View All
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Cards grid — 3 cols, 2 rows, smaller aspect ratio */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {cities.map((city, i) => (
            <Link
              key={city.name}
              href={city.href}
              className={`city-card relative rounded-lg overflow-hidden block group card-fade ${visible ? "show" : ""}`}
              style={{ transitionDelay: `${0.07 + i * 0.08}s`, aspectRatio: "5/3" }}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="city-card-img object-cover"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 p-2 sm:p-2.5">
                <div className="flex items-center gap-0.5 text-white/80 mb-0.5">
                  <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <span className="text-[8px] sm:text-[9px] font-semibold">{city.country}</span>
                </div>
                <p className="text-white font-extrabold text-xs sm:text-sm leading-none">{city.name}</p>
                <p className="text-[#f0c040] text-[8px] sm:text-[9px] font-semibold mt-0.5">{city.properties} Properties</p>
              </div>

              {/* Hover yellow border */}
              <div className="absolute inset-0 rounded-lg ring-0 group-hover:ring-2 ring-[#f0c040] transition-all duration-300" />
            </Link>
          ))}
        </div>

      </section>
    </>
  );
}