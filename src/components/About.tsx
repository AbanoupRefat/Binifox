"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getAboutFeatures } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorFallback } from "./ErrorFallback";
import type { Database } from "@/lib/database.types";

type AboutFeature = Database['public']['Tables']['about_features']['Row'];

const images = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
];

export default function About() {
  const [features, setFeatures] = useState<AboutFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAboutFeatures()
      .then((data) => { setFeatures(data); setLoading(false); })
      .catch((err) => {
        console.error('Failed to fetch about features:', err);
        setError('Unable to load about features');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8"><LoadingSpinner /></div>
    </section>
  );

  if (error) return <ErrorFallback message={error} />;

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image src={images[0]} alt="Team working" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image src={images[2]} alt="Office meeting" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image src={images[1]} alt="Collaboration" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image src={images[3]} alt="Team discussion" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-8 py-6 text-center z-10">
              <p className="font-teko text-xl uppercase tracking-wider">Since</p>
              <p className="font-teko text-4xl font-bold">2012</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-title">About Us</p>
            <h2 className="heading-md text-dark mb-2">
              We are trusted by more than <span className="text-primary">6,800</span>
            </h2>
            <h2 className="heading-md text-primary mb-8">Clients.</h2>

            <div className="space-y-6 mb-8">
              {features.map((feature) => {
                const IconComponent = getIcon(feature.icon_name);
                return (
                  <div key={feature.id} className="flex gap-4">
                    <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-teko text-xl uppercase text-dark mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a href="#contact" className="inline-block bg-primary text-white px-10 py-4 font-teko text-lg uppercase tracking-wider hover:bg-dark transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
