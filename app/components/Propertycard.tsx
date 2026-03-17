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

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
      else setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
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

        .arrow-btn {
          transition: opacity 0.2s ease, background 0.2s ease;
          opacity: 1;
        }

        .prop-img { transition: transform 0.45s ease; }
        .img-wrap:hover .prop-img { transform: scale(1.04); }

        .prop-btn {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          height: 28px; border-radius: 8px; font-size: 10px; font-weight: 600;
          cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s;
          font-family: 'Nunito', sans-serif;
        }
        .prop-btn-whatsapp {
          flex: 1; border: 1px solid #e0eaf5; color: #1a2332; background: white;
        }
        .prop-btn-whatsapp:hover { background: #1a2332; color: white; border-color: #1a2332; }
        .prop-btn-call {
          flex: 1; border: 1px solid #e0eaf5; color: #1a2332; background: white; border: none;
        }
        .prop-btn-call:hover { background: #1a2332; color: white; border-color: #1a2332; }
        .prop-btn-save {
          padding: 0 8px; border: 1px solid #e0eaf5; color: #1a2332; background: white;
        }
        .prop-btn-save.saved { border-color: #f0c040; background: #fffbea; color: #c89000; }
        .prop-btn-save:hover { border-color: #f0c040; color: #c89000; }
      `}</style>

      <Link href={href} className="prop-font block">
        <div className="prop-card" style={{ background: "white", border: "1px solid #e8edf5", borderRadius: "12px", overflow: "hidden" }}>

          {/* ── Image slider ── */}
          <div
            className="img-wrap"
            style={{ position: "relative", height: "160px", overflow: "hidden", userSelect: "none" }}
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

            {/* Price badge — bigger, cream-yellow semi-transparent bg */}
            <div style={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(255, 248, 180, 0.82)",
              backdropFilter: "blur(4px)",
              color: "#1a2332",
              fontSize: "12px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "8px",
              zIndex: 10,
              border: "1px solid rgba(240,210,60,0.45)",
              letterSpacing: "0.01em"
            }}>
              Rs {price}
            </div>

            {/* Always-visible arrows */}
            <button onClick={prev} className="arrow-btn" style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(26,35,50,0.65)", color: "white", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, border: "none", cursor: "pointer" }}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={next} className="arrow-btn" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(26,35,50,0.65)", color: "white", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, border: "none", cursor: "pointer" }}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            {/* Dot indicators */}
            {images.length > 1 && (
              <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, zIndex: 10 }}>
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                    style={{ borderRadius: "9999px", width: i === imgIndex ? 12 : 6, height: 6, background: i === imgIndex ? "white" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Card Body ── */}
          <div style={{ padding: "12px" }}>

            {/* Title */}
            <p style={{ color: "#1a2332", fontWeight: 700, fontSize: "13px", lineHeight: 1.4, marginBottom: 8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
              {title}
            </p>

            {/* Beds / Baths / Area */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "11px", color: "#1a2332", fontWeight: 600, marginBottom: 8 }}>
              {beds > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v2"/></svg>
                  {beds}
                </span>
              )}
              {baths > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/></svg>
                  {baths}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                {area}
              </span>
            </div>

            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "11px", color: "#1a2332", marginBottom: 8 }}>
              <svg width="9" height="9" fill="none" stroke="#1a4a8a" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{location}</span>
            </div>

            {/* Type + Date */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              {/* Type badge — now black text on light bg */}
              <span style={{ color: "#1a2332", fontSize: "10px", fontWeight: 700, background: "#f0f0f0", border: "1px solid #d0d0d0", padding: "2px 6px", borderRadius: "6px" }}>
                {type}
              </span>
              <span style={{ fontSize: "10px", color: "#6b7a8d" }}>{date}</span>
            </div>

            {/* Action buttons — both same style (outlined), WhatsApp + Call */}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={(e) => e.preventDefault()} className="prop-btn prop-btn-whatsapp" style={{ flex: 1, border: "1px solid #e0eaf5" }}>
                {/* WhatsApp icon */}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              <button onClick={(e) => e.preventDefault()} className="prop-btn prop-btn-call" style={{ flex: 1, border: "1px solid #e0eaf5" }}>
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                Call
              </button>
              <button onClick={(e) => { e.preventDefault(); setSaved(!saved); }} className={`prop-btn prop-btn-save ${saved ? "saved" : ""}`}>
                <svg width="10" height="10" fill={saved ? "#f0c040" : "none"} stroke={saved ? "#f0c040" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}