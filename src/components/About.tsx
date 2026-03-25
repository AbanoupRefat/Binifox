"use client";

import Image from "next/image";
import { Star, Shield } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
];

const features = [
  {
    icon: Star,
    title: "Pleasant Consulting",
    description: "Lorem Ipsum nibh vel velit auctor aliquet. Aenean sollic tudin, lorem is simply free text quis bibendum.",
  },
  {
    icon: Shield,
    title: "Trusted Services",
    description: "Lorem Ipsum nibh vel velit auctor aliquet. Aenean sollic tudin, lorem is simply free text quis bibendum.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={images[0]}
                    alt="Team working"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={images[2]}
                    alt="Office meeting"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={images[1]}
                    alt="Collaboration"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={images[3]}
                    alt="Team discussion"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Since Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-8 py-6 text-center z-10">
              <p className="font-teko text-xl uppercase tracking-wider">Since</p>
              <p className="font-teko text-4xl font-bold">2012</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-title">About Us</p>
            <h2 className="heading-md text-dark mb-2">
              We are trusted by more than{" "}
              <span className="text-primary">6,800</span>
            </h2>
            <h2 className="heading-md text-primary mb-8">Clients.</h2>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-teko text-xl uppercase text-dark mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <a
              href="#contact"
              className="inline-block bg-primary text-white px-10 py-4 font-teko text-lg uppercase tracking-wider hover:bg-dark transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
