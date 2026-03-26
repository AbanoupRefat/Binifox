"use client";

import { useState, useEffect } from "react";
import { getServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorFallback } from "./ErrorFallback";
import Link from "next/link";
import type { Database } from "@/lib/database.types";

type Service = Database['public']['Tables']['services']['Row'];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServices()
      .then((data) => { setServices(data); setLoading(false); })
      .catch((err) => {
        console.error('Failed to fetch services:', err);
        setError('Unable to load services');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <section className="dark-section py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8"><LoadingSpinner /></div>
    </section>
  );

  if (error) return (
    <section className="dark-section py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8"><ErrorFallback message={error} /></div>
    </section>
  );

  return (
    <section id="services" className="dark-section py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white" />
        <div className="absolute top-20 right-20 w-16 h-16 border border-white" />
        <div className="absolute bottom-10 left-1/4 w-12 h-12 border border-white" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border border-white" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="section-title">Features Services</p>
          <h2 className="heading-md text-white">Explore Our Services.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon_name);
            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group relative p-8 lg:p-10 border border-white/10 hover:bg-primary transition-all duration-300 cursor-pointer"
              >
                <div className="mb-6">
                  <IconComponent className="w-16 h-16 text-primary group-hover:text-white transition-colors duration-300 stroke-1" />
                </div>
                <h3 className="font-teko text-xl uppercase tracking-wider text-white mb-4">
                  {service.title}
                </h3>
                <div className="w-8 h-1 bg-primary group-hover:bg-white transition-colors duration-300" />
                <span className="absolute bottom-4 right-4 font-teko text-4xl text-white/10 group-hover:text-white/30 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }} />
    </section>
  );
}
