"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", hasDropdown: false },
    { name: "About", href: "/about", hasDropdown: false },
    {
      name: "Services",
      href: "/services",
      hasDropdown: false,
    },
    {
      name: "Pages",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "About", href: "/about" },
        { name: "Pricing", href: "/pricing" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Team", href: "/team" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      name: "News",
      href: "/news",
      hasDropdown: false,
    },
    { name: "Contact", href: "/contact", hasDropdown: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark shadow-lg py-2" : "bg-dark/60 backdrop-blur-sm py-4"
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
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-white/90 font-rubik text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1 py-2"
                >
                  {item.name}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.dropdownItems && (
                  <div className="absolute left-0 mt-0 w-48 bg-white text-dark rounded-none shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-4 border-primary">
                    {item.dropdownItems.map((dropdownItem, index) => (
                      <Link
                        key={index}
                        href={dropdownItem.href}
                        className="block px-6 py-3 text-sm font-rubik uppercase tracking-wider hover:bg-gray-100 hover:text-primary transition-colors first:rounded-t-none last:rounded-b-none"
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            <button type="button" className="text-white hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/contact"
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
              <div key={item.name}>
                <div
                  className="flex items-center justify-between py-3 text-white font-rubik text-sm font-medium uppercase tracking-wider"
                  onClick={() =>
                    item.hasDropdown
                      ? setOpenDropdown(
                          openDropdown === item.name ? null : item.name
                        )
                      : null
                  }
                >
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors flex-1"
                    onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <span
                      className={`text-primary transition-transform ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </div>

                {/* Mobile Dropdown */}
                {item.hasDropdown &&
                  item.dropdownItems &&
                  openDropdown === item.name && (
                    <div className="bg-white/10 border-l-2 border-primary">
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <Link
                          key={index}
                          href={dropdownItem.href}
                          className="block py-2 pl-6 text-white font-rubik text-xs uppercase tracking-wider hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            <Link
              href="/contact"
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
