 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export interface PropertyCardProps {
  id: string;
  images: string[];
  price: string;
  title: string;
  beds: number;
  baths: number;
  area: string;
  location: string;
  type: string;
  date?: string;
  href: string;
}

export default function PropertyCard({
  images = ["/placeholder.jpg"],
  price,
  title,
  beds,
  baths,
  area,
  location,
  type,
  date = "Today",
  href,
}: PropertyCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left → next
        setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
      } else {
        // swipe right → prev
        setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .prop-font { font-family: 'Nunito', sans-serif; }

        .prop-card {
          transition: box-shadow 0.3s ease, transform 0.25s ease;
        }
        .prop-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 2px #1a2332, 0 8px 32px rgba(240,192,64,0.35), 0 2px 12px rgba(26,35,50,0.10);
        }

        /* Desktop: arrows hidden until hover */
        .arrow-btn {
          transition: opacity 0.2s ease, background 0.2s ease;
        }
        @media (min-width: 640px) {
          .arrow-btn { opacity: 0; }
          .img-wrap:hover .arrow-btn { opacity: 1; }
        }
        /* Mobile: arrows always visible */
        @media (max-width: 639px) {
          .arrow-btn { opacity: 1; }
        }

        .prop-img { transition: transform 0.45s ease; }
        .img-wrap:hover .prop-img { transform: scale(1.04); }
      `}</style>

      <Link href={href} className="prop-font block">
        <div className="prop-card bg-white border border-[#e8edf5] rounded-xl overflow-hidden">

          {/* ── Image slider ── */}
          <div
            className="img-wrap relative h-28 sm:h-40 overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[imgIndex]}
              alt={title}
              fill
              className="prop-img object-cover"
              draggable={false}
            />

            {/* Price badge */}
            <div className="absolute bottom-2 left-2 bg-[#1a2332] text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
              Rs {price}
            </div>

            {/* Arrows — always shown on mobile, hover on desktop */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="arrow-btn absolute left-1.5 top-1/2 -translate-y-1/2 bg-[#1a2332]/70 hover:bg-[#1a2332] text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="arrow-btn absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1a2332]/70 hover:bg-[#1a2332] text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all ${i === imgIndex ? "bg-white w-3 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`} />
                ))}
              </div>
            )}
          </div>

          {/* ── Card Body ── */}
          <div className="p-2 sm:p-3">

            {/* Title */}
            <p className="text-[#1a2332] font-bold text-xs sm:text-sm leading-snug line-clamp-1 mb-1.5 hover:text-[#1a4a8a] transition-colors">
              {title}
            </p>

            {/* Beds / Baths / Area */}
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-[#1a2332] font-semibold mb-1.5">
              {beds > 0 && (
                <span className="flex items-center gap-0.5">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v2"/>
                  </svg>
                  {beds}
                </span>
              )}
              {baths > 0 && (
                <span className="flex items-center gap-0.5">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/>
                  </svg>
                  {baths}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                {area}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#1a2332] mb-2">
              <svg width="9" height="9" fill="none" stroke="#1a4a8a" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span className="line-clamp-1">{location}</span>
            </div>

            {/* Type + Date */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#f0c040] text-[9px] sm:text-[10px] font-bold bg-[#fffbea] border border-[#f0e080] px-1.5 py-0.5 rounded-md">
                {type}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#1a2332]">{date}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
              <button onClick={(e) => e.preventDefault()}
                className="flex-1 flex items-center justify-center gap-1 border border-[#e0eaf5] text-[#1a2332] text-[9px] sm:text-[10px] font-semibold h-6 sm:h-7 rounded-lg hover:bg-[#1a2332] hover:text-white hover:border-[#1a2332] transition-colors">
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </button>
              <button onClick={(e) => e.preventDefault()}
                className="flex-1 flex items-center justify-center gap-1 bg-[#1a2332] text-white text-[9px] sm:text-[10px] font-semibold h-6 sm:h-7 rounded-lg hover:bg-[#f0c040] hover:text-[#1a2332] transition-colors">
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
                Call
              </button>
              <button onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
                className={`flex items-center justify-center h-6 sm:h-7 px-2 rounded-lg border text-[9px] font-semibold transition-colors
                  ${saved ? "border-[#f0c040] bg-[#fffbea] text-[#c89000]" : "border-[#e0eaf5] text-[#1a2332] hover:border-[#f0c040] hover:text-[#c89000]"}`}>
                <svg width="10" height="10" fill={saved ? "#f0c040" : "none"} stroke={saved ? "#f0c040" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}