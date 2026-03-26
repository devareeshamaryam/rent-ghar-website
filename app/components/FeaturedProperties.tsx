 "use client";

// components/FeaturedProperties.tsx
// ✅ Real DB data — hardcoded array hata diya
// ✅ href => /listings/[slug] — existing detail page use hoga
// ✅ price formatting — marla/kanal + PKR formatting same as detail page

import { useRef, useEffect, useState } from "react";
import PropertyCard from "./Propertycard";

// ── Types ────────────────────────────────────────────────────
interface FeaturedProperty {
  _id: string;
  property: {
    _id:          string;
    title:        string;
    slug:         string;
    purpose:      string;
    price:        number;
    marla:        number;
    kanal:        number;
    bedrooms:     number;
    bathrooms:    number;
    mainPhoto:    string;
    city?:         { name: string; slug: string };
    area?:         { name: string; slug: string };
    propertyType?: { name: string };
  };
}

// ── Price formatter — same as detail page ────────────────────
function formatPrice(n: number) {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000)    return `${(n / 100_000).toFixed(1)} Lac`;
  return n.toLocaleString();
}

function formatSize(marla: number, kanal: number) {
  if (kanal > 0) return `${kanal} Kanal`;
  if (marla > 0) return `${marla} Marla`;
  return "—";
}

const CARD_WIDTH = 280;

export default function FeaturedProperties() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [visible,   setVisible]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [featured,  setFeatured]  = useState<FeaturedProperty[]>([]);
  const [loading,   setLoading]   = useState(true);

  // ── Fetch from DB ────────────────────────────────────────
  useEffect(() => {
    fetch("/api/featured")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFeatured(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Intersection observer ────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Scroll tracker ───────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (CARD_WIDTH + 16));
      setActiveIdx(Math.min(idx, featured.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [featured.length]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + 16) : CARD_WIDTH + 16,
      behavior: "smooth",
    });
  };

  const scrollToIdx = (i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * (CARD_WIDTH + 16), behavior: "smooth" });
  };

  // ── Don't render if no featured listings ────────────────
  if (!loading && featured.length === 0) return null;

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

        .fp-dot { transition: width 0.25s ease, background 0.25s ease; }

        .fp-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: fp-shimmer 1.4s infinite;
          border-radius: 14px;
        }
        @keyframes fp-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div ref={sectionRef} className="fp-font bg-white" style={{ paddingTop: "80px", paddingBottom: "60px" }}>

        {/* ── Top row ── */}
        <div
          className="flex items-center justify-between"
          style={{ paddingLeft: "40px", paddingRight: "40px", marginBottom: "36px" }}
        >
          <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <p className="text-[10px] font-extrabold text-[#f0c040] uppercase tracking-widest mb-1.5">Featured</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a2332]">
              <span className={`fp-underline ${visible ? "show" : ""}`}>Exclusive Properties</span>
            </h2>
          </div>

          <div className={`flex items-center gap-2.5 transition-all duration-500 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
            <button
              onClick={() => scroll("left")}
              className="fp-arrow flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#1a2332] text-[#1a2332] shadow-sm"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="fp-arrow flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#1a2332] text-[#1a2332] shadow-sm"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <a
              href="/listings"
              className="text-[11px] font-extrabold text-[#1a2332] border-2 border-[#1a2332] px-4 py-1.5 rounded-lg hover:bg-[#1a2332] hover:text-[#f0c040] transition-colors whitespace-nowrap"
            >
              View All →
            </a>
          </div>
        </div>

        {/* ── Cards ── */}
        {loading ? (
          // Skeleton loading
          <div
            className="flex overflow-hidden"
            style={{ paddingLeft: "40px", paddingRight: "40px", gap: "20px" }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="fp-skeleton shrink-0"
                style={{ width: `${CARD_WIDTH}px`, height: "340px" }}
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="fp-scroll flex overflow-x-auto"
            style={{
              paddingLeft: "40px",
              paddingRight: "40px",
              paddingTop: "10px",
              paddingBottom: "16px",
              gap: "20px",
            }}
          >
            {featured.map((item, i) => {
              const p = item.property;
              const location = [p.area?.name, p.city?.name].filter(Boolean).join(", ");
              const typeLabel = p.propertyType?.name || "Property";
              const purposeLabel = p.purpose === "rent" ? "for Rent" : "for Sale";

              return (
                <div
                  key={item._id}
                  className={`fp-card shrink-0 ${visible ? "show" : ""}`}
                  style={{ width: `${CARD_WIDTH}px`, transitionDelay: `${i * 75}ms` }}
                >
                  <div className="fp-card-inner relative">
                    <div className="fp-ribbon">FEATURED</div>
                    <PropertyCard
                      id={p._id}
                      images={p.mainPhoto ? [p.mainPhoto] : []}
                      price={`PKR ${formatPrice(p.price)}`}
                      title={`${typeLabel} ${purposeLabel} in ${p.area?.name || p.city?.name || ""}`}
                      beds={p.bedrooms}
                      baths={p.bathrooms}
                      area={formatSize(p.marla, p.kanal)}
                      location={location}
                      type={`${typeLabel} ${purposeLabel}`}
                      date=""
                      // ✅ Existing detail page ka slug use hoga
                      href={`/listings/${p.slug}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile dots */}
        {!loading && (
          <div className="flex justify-center gap-2 mt-5 sm:hidden">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIdx(i)}
                className={`fp-dot rounded-full h-1.5 ${
                  i === activeIdx ? "w-4 bg-[#1a2332]" : "w-1.5 bg-[#1a2332]/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}