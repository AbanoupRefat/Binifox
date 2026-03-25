"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Facebook, Youtube, Linkedin, Twitter, Instagram } from "lucide-react";

const departments = [
  { name: "Home", href: "#" },
  { name: "About us", href: "#about" },
  { name: "Blog", href: "#news" },
  { name: "FAQ", href: "#" },
  { name: "Contact us", href: "#contact" },
  { name: "Locations", href: "#" },
  { name: "Caregivers", href: "#" },
  { name: "New & Blog", href: "#news" },
  { name: "Gallery", href: "#" },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
];

export default function Footer() {
  return (
    <footer id="contact" className="dark-section">
      {/* Main Footer */}
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & About */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-white font-teko text-2xl font-bold tracking-wider">
                  BINIFOX
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Lorem ipsum dolor sit amet consecte tur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua tepo
                the.
              </p>
              <h4 className="font-teko text-lg uppercase text-white mb-4">
                Subscribe
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="flex-1 bg-white/10 border-0 px-4 py-3 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  className="bg-primary px-4 py-3 text-white hover:bg-primary/80 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="font-teko text-xl uppercase text-white mb-6">
                Departments
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {departments.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white/60 text-sm hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Feed */}
            <div>
              <h4 className="font-teko text-xl uppercase text-white mb-6">
                Latest Feed
              </h4>
              <div className="space-y-4">
                {["Lorem ipsum dolor sit amet, consectetur.", "We Are Trying To Do Best Work.", "Nature is The best place for fresh mind."].map((title, index) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden">
                      <Image
                        src={instagramImages[index]}
                        alt="Feed"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {title}
                      </p>
                      <p className="text-white/40 text-xs mt-1">14 July 2019</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instagram */}
            <div>
              <h4 className="font-teko text-xl uppercase text-white mb-6">
                Instagram
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {instagramImages.map((img, index) => (
                  <div key={index} className="relative h-20 overflow-hidden group cursor-pointer">
                    <Image
                      src={img}
                      alt={`Instagram ${index + 1}`}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            Copyright 2021 Themepure. All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Youtube, Linkedin, Twitter, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
