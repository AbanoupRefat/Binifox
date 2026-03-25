"use client";

import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Philimia Darwin",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Hilixa Maria",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Willamson Hilai",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Limonda Pwedie",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title">Our Team</p>
          <h2 className="heading-md text-dark">Expert Members.</h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="group">
              {/* Image */}
              <div className="relative h-80 overflow-hidden mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Social Links Overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-10 h-10 bg-white text-dark flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-teko text-2xl uppercase text-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="w-3 h-3 rounded-full bg-gray-300" />
        </div>
      </div>
    </section>
  );
}
