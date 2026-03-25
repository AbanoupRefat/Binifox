"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Pages", href: "#team" },
    { name: "News", href: "#news" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-teko text-2xl font-bold tracking-wider">
              BINIFOX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white font-rubik text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                {item.name}
                {(item.name === "Home" || item.name === "Services" || item.name === "Pages" || item.name === "News") && (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            <button type="button" className="text-white hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="#contact"
              className="bg-white text-dark px-6 py-3 font-teko text-sm font-semibold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-white font-rubik text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="#contact"
              className="inline-block mt-4 bg-primary text-white px-6 py-3 font-teko text-sm font-semibold uppercase tracking-wider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
