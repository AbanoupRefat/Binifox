"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServiceWithSubServices, type ServiceWithSubs } from "@/lib/queries";
import { getGDriveEmbedUrl } from "@/lib/utils";
import { getIcon } from "@/lib/iconMap";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceWithSubs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getServiceWithSubServices(id)
      .then(setService)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </main>
      <Footer />
    </>
  );

  if (!service) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Service not found.</p>
      </main>
      <Footer />
    </>
  );

  const Icon = getIcon(service.icon_name);

  return (
    <>
      <Header />
      <main className="pt-20">

        {/* ── Hero ── */}
        <section className="relative min-h-[420px] flex items-end overflow-hidden bg-dark">
          {service.image_url && (
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="object-cover opacity-40"
              priority
            />
          )}
          <div className="relative z-10 container mx-auto px-4 lg:px-8 py-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-primary font-teko text-lg uppercase tracking-widest">Our Service</p>
            </div>
            <h1 className="font-teko text-5xl lg:text-7xl uppercase text-white mb-4 leading-none">
              {service.title}
            </h1>
            {service.short_description && (
              <p className="text-white/70 text-lg max-w-2xl">{service.short_description}</p>
            )}
          </div>
        </section>

        {/* ── Description ── */}
        {service.description && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>
          </section>
        )}

        {/* ── Clients ── */}
        {service.clients && service.clients.length > 0 && (
          <section className="py-14 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto px-4 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary text-center mb-8">
                Trusted By
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {service.clients.map((client) => (
                  <span key={client}
                    className="px-5 py-2 bg-white border border-gray-200 rounded-full font-teko text-lg uppercase tracking-wider text-dark shadow-sm hover:border-primary hover:text-primary transition-colors">
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Sub-Services ── */}
        {service.sub_services && service.sub_services.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-14">
                <p className="section-title">What We Offer</p>
                <h2 className="heading-md text-dark">Service Breakdown</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {service.sub_services.map((sub) => {
                  const embedUrl = sub.gdrive_video_url ? getGDriveEmbedUrl(sub.gdrive_video_url) : null;
                  return (
                    <div key={sub.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Sub-service image */}
                      {sub.image_url && (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image src={sub.image_url} alt={sub.title} fill className="object-cover" />
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-8 bg-primary rounded-full flex-shrink-0 mt-1" />
                          <h3 className="font-teko text-2xl uppercase text-dark leading-tight">{sub.title}</h3>
                        </div>

                        {sub.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">{sub.description}</p>
                        )}

                        {/* GDrive video embed */}
                        {embedUrl && (
                          <div className="pt-2">
                            <iframe
                              src={embedUrl}
                              className="w-full aspect-video rounded-lg shadow-md"
                              allow="autoplay"
                              allowFullScreen
                              title={sub.title}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
