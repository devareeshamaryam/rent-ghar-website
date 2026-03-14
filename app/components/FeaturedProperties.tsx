 "use client";

import { useRef, useEffect, useState } from "react";
import PropertyCard from "./Propertycard";

const FEATURED = [
  { id: "1", price: "85 Lac",  type: "House for Rent",     beds: 3, baths: 2, area: "5 Marla",   location: "DHA Phase 5, Lahore",    date: "2 hours ago", href: "/listings/1", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"] },
  { id: "2", price: "1.2 Cr",  type: "Apartment for Rent", beds: 2, baths: 2, area: "950 Sqft",  location: "Bahria Town, Karachi",   date: "5 hours ago", href: "/listings/2", images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80"] },
  { id: "4", price: "2.5 Cr",  type: "House for Rent",     beds: 5, baths: 4, area: "10 Marla",  location: "F-7, Islamabad",         date: "3 hours ago", href: "/listings/4", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"] },
  { id: "8", price: "1.8 Cr",  type: "House for Rent",     beds: 6, baths: 5, area: "1 Kanal",   location: "DHA Phase 2, Islamabad", date: "4 hours ago", href: "/listings/8", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"] },
  { id: "9", price: "55 Lac",  type: "Apartment for Rent", beds: 3, baths: 2, area: "1100 Sqft", location: "Clifton, Karachi",       date: "1 day ago",   href: "/listings/9", images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80"] },
  { id: "6", price: "90 Lac",  type: "House for Rent",     beds: 4, baths: 3, area: "7 Marla",   location: "G-11, Islamabad",        date: "2 days ago",  href: "/listings/6", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"] },
];

const CARD_WIDTH = 280;

export default function FeaturedProperties() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (CARD_WIDTH + 16));
      setActiveIdx(Math.min(idx, FEATURED.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -(CARD_WIDTH + 16) : (CARD_WIDTH + 16), behavior: "smooth" });
  };

  const scrollToIdx = (i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * (CARD_WIDTH + 16), behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .fp-font { font-family: 'Nunito', sans-serif; }

        .fp-scroll::-webkit-scrollbar { display: none; }
        .fp-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .fp-ribbon {
          position: absolute;
          top: 10px;
          left: 0px;
          z-index: 20;
          background: #1a2332;
          color: #fff;
          font-size: 8.5px;
          font-weight: 900;
          letter-spacing: 0.13em;
          padding: 3px 14px 3px 8px;
          clip-path: polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%);
          text-transform: uppercase;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.22);
          pointer-events: none;
        }
        .fp-ribbon::before {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          border-left: 4px solid #0b1622;
          border-bottom: 4px solid transparent;
        }

        .fp-card {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .fp-card.show { opacity: 1; transform: translateY(0); }

        .fp-card-inner {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: 14px;
          position: relative;
          z-index: 1;
        }
        .fp-card-inner:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(26,35,50,0.16), 0 0 0 2px #1a2332;
          z-index: 50;
        }

        .fp-arrow {
          transition: background 0.2s, color 0.2s, transform 0.18s;
          flex-shrink: 0;
        }
        .fp-arrow:hover {
          background: #1a2332 !important;
          color: #f0c040 !important;
          transform: scale(1.1);
        }

        .fp-underline { position: relative; display: inline-block; }
        .fp-underline::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          height: 3px; width: 0;
          background: #f0c040;
          border-radius: 2px;
          transition: width 0.65s ease 0.2s;
        }
        .fp-underline.show::after { width: 100%; }

        .fp-dot {
          transition: width 0.25s ease, background 0.25s ease;
        }
      `}</style>

      <div ref={sectionRef} className="fp-font bg-white" style={{ paddingTop: "80px", paddingBottom: "60px" }}>

          {/* ── Top row — padded ── */}
          <div className="flex items-center justify-between" style={{ paddingLeft: "40px", paddingRight: "40px", marginBottom: "36px" }}>

            <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <p className="text-[10px] font-extrabold text-[#f0c040] uppercase tracking-widest mb-1.5">Featured</p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a2332]">
                <span className={`fp-underline ${visible ? "show" : ""}`}>Exclusive Properties</span>
              </h2>
            </div>

            <div className={`flex items-center gap-2.5 transition-all duration-500 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
              <button onClick={() => scroll("left")}
                className="fp-arrow flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#1a2332] text-[#1a2332] shadow-sm">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button onClick={() => scroll("right")}
                className="fp-arrow flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#1a2332] text-[#1a2332] shadow-sm">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <a href="/listings"
                className="text-[11px] font-extrabold text-[#1a2332] border-2 border-[#1a2332] px-4 py-1.5 rounded-lg hover:bg-[#1a2332] hover:text-[#f0c040] transition-colors whitespace-nowrap">
                View All →
              </a>
            </div>
          </div>

          {/* ── Cards — full width scroll with left padding ── */}
          <div
            ref={scrollRef}
            className="fp-scroll flex overflow-x-auto"
            style={{ paddingLeft: "40px", paddingRight: "40px", paddingTop: "10px", paddingBottom: "16px", gap: "20px" }}
          >
            {FEATURED.map((listing, i) => (
              <div
                key={listing.id}
                className={`fp-card shrink-0 ${visible ? "show" : ""}`}
                style={{ width: `${CARD_WIDTH}px`, transitionDelay: `${i * 75}ms` }}
              >
                <div className="fp-card-inner relative">
                  <div className="fp-ribbon">FEATURED</div>
                  <PropertyCard
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
                </div>
              </div>
            ))}
          </div>

          {/* Mobile dots */}
          <div className="flex justify-center gap-2 mt-5 sm:hidden">
            {FEATURED.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIdx(i)}
                className={`fp-dot rounded-full h-1.5 ${
                  i === activeIdx ? "w-4 bg-[#1a2332]" : "w-1.5 bg-[#1a2332]/20"
                }`}
              />
            ))}
          </div>

      </div>
    </>
  );
}