 "use client";

import Image from "next/image";
import Link from "next/link";

const cities = [
  { name: "Lahore", count: 107 },
  { name: "Islamabad", count: 84 },
  { name: "Karachi", count: 63 },
  { name: "Multan", count: 41 },
  { name: "Faisalabad", count: 29 },
  { name: "Rawalpindi", count: 22 },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Listings", href: "/listings" },
  { label: "Contact Us", href: "/contact" },
  { label: "Profile", href: "/profile" },
  { label: "Houses for Rent", href: "/listings?type=house" },
  { label: "Apartments", href: "/listings?type=apartment" },
  { label: "Rooms", href: "/listings?type=room" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2332] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#f0c040]/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <Image
                src="/rentgharlogo2.png"
                alt="RentGhar Logo"
                width={140}
                height={40}
                className="h-10 w-auto object-contain mb-3"
              />
            </Link>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Pakistan's most trusted rental platform. Find your home with ease.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" aria-label="Facebook"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#f0c040] hover:text-[#f0c040] text-white/60 transition-colors duration-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#f0c040] hover:text-[#f0c040] text-white/60 transition-colors duration-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a href="https://wa.me/923111445559" aria-label="WhatsApp"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-[#f0c040] hover:text-[#f0c040] text-white/60 transition-colors duration-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.535 5.878L.057 23.625a.75.75 0 00.92.919l5.84-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.091-1.4l-.364-.217-3.773.944.99-3.683-.237-.379A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#f0c040] font-semibold text-xs uppercase tracking-widest mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-white/60 text-xs hover:text-[#f0c040] transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#f0c040]/40 group-hover:bg-[#f0c040] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-[#f0c040] font-semibold text-xs uppercase tracking-widest mb-3">
              Popular Cities
            </h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.name}>
                  <Link
                    href={`/listings?city=${city.name.toLowerCase()}`}
                    className="text-white/60 text-xs hover:text-[#f0c040] transition-colors duration-200 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#f0c040]/40 group-hover:bg-[#f0c040] transition-colors" />
                      {city.name}
                    </span>
                    <span className="text-white/30 group-hover:text-[#f0c040]/60 transition-colors">
                      {city.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#f0c040] font-semibold text-xs uppercase tracking-widest mb-3">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+923111445559"
                  className="flex items-start gap-2 text-white/60 text-xs hover:text-[#f0c040] transition-colors duration-200">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +92-311-144-5559
                </a>
              </li>
              <li>
                <a href="mailto:info@rentghar.com"
                  className="flex items-start gap-2 text-white/60 text-xs hover:text-[#f0c040] transition-colors duration-200">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@rentghar.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-xs">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Islamabad, Pakistan
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} RentGhar. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/40 text-xs hover:text-[#f0c040] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 text-xs hover:text-[#f0c040] transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}