 "use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Property Agent, Lahore",
    text: "RentGhars ne meri agency ko bilkul badal diya. Pehle leads dhundne mein mahine lagte the, ab roz queries aati hain. Highly recommended for all agents!",
    rating: 5,
    initials: "AR",
    iconBg: "#1a2332",
  },
  {
    name: "Sana Malik",
    role: "Home Owner, Karachi",
    text: "Maine apna apartment sirf 2 din mein rent kar diya RentGhars ki wajah se. Process bht easy tha, aur real tenants mile. Zabardast platform hai bilkul!",
    rating: 5,
    initials: "SM",
    iconBg: "#1a2332",
  },
  {
    name: "Usman Tariq",
    role: "Real Estate Developer, Islamabad",
    text: "Hamari society ka project RentGhars par list kiya — response bahut acha tha. Professional team, fast support. Will list all future projects here.",
    rating: 5,
    initials: "UT",
    iconBg: "#1a2332",
  },
  {
    name: "Fatima Khan",
    role: "Tenant, Rawalpindi",
    text: "Finding a house used to be so stressful. RentGhars made it easy — verified listings, clear pricing, aur direct contact with owners. Bohat acha experience!",
    rating: 5,
    initials: "FK",
    iconBg: "#1a2332",
  },
  {
    name: "Bilal Hassan",
    role: "Property Agent, Faisalabad",
    text: "3 mahine mein 12 properties rent kar li sirf RentGhars ki wajah se. Dashboard easy hai, leads quality hain. Meri agency ka growth 3x ho gaya.",
    rating: 5,
    initials: "BH",
    iconBg: "#1a2332",
  },
  {
    name: "Nadia Aslam",
    role: "Home Owner, Multan",
    text: "Plot listing karna itna easy kabhi nahi tha. Photos upload ki, price set kiya aur ek week mein genuine buyers se calls aane lagi. Great service!",
    rating: 5,
    initials: "NA",
    iconBg: "#1a2332",
  },
];

const blobPaths = [
  "M0,20 C0,8 8,0 20,0 L80,0 C92,0 100,8 100,20 L100,72 C100,84 92,94 80,96 L24,100 C10,100 0,92 0,80 Z",
  "M0,16 C0,6 7,0 18,0 L82,0 C93,0 100,7 100,18 L100,76 C100,88 91,96 78,98 L20,100 C8,100 0,93 0,82 Z",
  "M2,18 C2,7 9,0 20,0 L80,0 C91,0 100,8 100,20 L98,74 C98,86 90,100 78,100 L18,96 C7,94 0,86 0,75 Z",
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function Testimonials() {
  const [ref, inView] = useInView();
  const [page, setPage] = useState(0);
  const total = Math.ceil(testimonials.length / 3);
  const visible = testimonials.slice(page * 3, page * 3 + 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        .tm-font { font-family: 'Nunito', sans-serif; }
        .tm-card-blob {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .tm-card-blob:hover {
          transform: translateY(-6px);
          filter: drop-shadow(0 12px 28px rgba(200,168,75,0.18));
        }
        .tm-fade {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .tm-fade.show { opacity: 1; transform: translateY(0); }
        .tm-arrow-btn {
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.18s;
        }
        .tm-arrow-btn:hover {
          background: #1a2332 !important;
          border-color: #1a2332 !important;
          color: #c8a84b !important;
          transform: scale(1.08);
        }
        .tm-dot-btn {
          transition: width 0.25s ease, background 0.25s ease;
        }
      `}</style>

      <section className="tm-font bg-white py-14 px-5 sm:px-10" ref={ref}>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <p
              className={`tm-fade ${inView ? "show" : ""} text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#c8a84b] mb-2`}
              style={{ transitionDelay: "0s" }}
            >
              What Clients Say
            </p>
            <h2
              className={`tm-fade ${inView ? "show" : ""} text-[28px] sm:text-[36px] font-black text-[#1a2332] leading-tight mb-3`}
              style={{ transitionDelay: "0.08s" }}
            >
              Client Feedback &amp; Testimonial
            </h2>
            <p
              className={`tm-fade ${inView ? "show" : ""} text-sm text-[#6b7a8d] max-w-md mx-auto leading-relaxed`}
              style={{ transitionDelay: "0.15s" }}
            >
              Thousands of agents and property owners across Pakistan trust RentGhars to grow their business.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {visible.map((t, i) => (
              <div
                key={`${page}-${i}`}
                className={`tm-fade tm-card-blob ${inView ? "show" : ""} relative`}
                style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full"
                  style={{ zIndex: 0 }}
                >
                  <path d={blobPaths[i % blobPaths.length]} fill="#f5f3ec" />
                </svg>

                <div className="relative z-10 p-6 pt-10 pb-8 flex flex-col gap-3 h-full">
                  <div
                    className="absolute -top-4 left-5 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: t.iconBg }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                    </svg>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: t.iconBg }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-[#1a2332] font-extrabold text-[13px] leading-tight">{t.name}</p>
                      <p className="text-[#9aaabb] text-[10px] font-semibold">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#c8a84b">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  <p className="text-[12.5px] text-[#4a5a6a] leading-[1.75] flex-1">
                    {t.text}
                  </p>

                  <span
                    className="absolute bottom-3 right-4 text-[72px] leading-none font-black select-none pointer-events-none"
                    style={{ color: "rgba(26,35,50,0.06)", fontFamily: "Georgia, serif" }}
                  >
                    "
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            className={`tm-fade ${inView ? "show" : ""} flex items-center justify-center gap-2.5`}
            style={{ transitionDelay: "0.45s" }}
          >
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="tm-arrow-btn w-8 h-8 rounded-full border-2 border-[#d0d8e4] bg-white text-[#6b7a8d] flex items-center justify-center cursor-pointer"
            >
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="tm-dot-btn rounded-full h-[7px] border-none cursor-pointer p-0"
                style={{
                  width: i === page ? 24 : 7,
                  background: i === page ? "#1a2332" : "#d0d8e4",
                }}
              />
            ))}

            <button
              onClick={() => setPage(p => Math.min(total - 1, p + 1))}
              className="tm-arrow-btn w-8 h-8 rounded-full border-2 border-[#d0d8e4] bg-white text-[#6b7a8d] flex items-center justify-center cursor-pointer"
            >
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}