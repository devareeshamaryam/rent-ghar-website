 "use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Listings", href: "/listings" },
  { label: "Blog", href: "/blog", hasDropdown: true },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);

  return (
    <header className="bg-[#1a2332] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              {/* Replace src with your actual logo path */}
              <Image
                src="/rentgharlogo2.png"
                alt="Logo"
                width={280}
                height={120}
                className="h-28 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
                    className="flex items-center gap-1 text-white font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#f0c040]"
                  >
                    {link.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        blogDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {blogDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-[#1a2332] border border-white/10 rounded shadow-lg z-50">
                      <Link
                        href="/blog/news"
                        className="block px-4 py-2.5 text-sm text-white hover:text-[#f0c040] hover:bg-white/5 transition-colors"
                        onClick={() => setBlogDropdownOpen(false)}
                      >
                        News
                      </Link>
                      <Link
                        href="/blog/articles"
                        className="block px-4 py-2.5 text-sm text-white hover:text-[#f0c040] hover:bg-white/5 transition-colors"
                        onClick={() => setBlogDropdownOpen(false)}
                      >
                        Articles
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#f0c040]"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-white font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#f0c040]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-white font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#f0c040] border border-white/30 hover:border-[#f0c040] px-4 py-1.5 rounded"
            >
              Register Now
            </Link>
            <a
              href="tel:+923111445559"
              className="flex items-center gap-2 border border-white/60 hover:border-[#f0c040] text-white hover:text-[#f0c040] text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +923-111-44-555-9
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white font-medium text-sm hover:text-[#f0c040] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
              <Link
                href="/login"
                className="text-white font-medium text-sm hover:text-[#f0c040] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-white font-medium text-sm hover:text-[#f0c040] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register Now
              </Link>
              <a
                href="tel:+923111445559"
                className="flex items-center gap-2 text-white text-sm font-medium hover:text-[#f0c040] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +923-111-44-555-9
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}