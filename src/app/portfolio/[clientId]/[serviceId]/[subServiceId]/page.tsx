"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioClientById, getSubServiceByIdWithMedia, getPortfolioProofMedia, type PortfolioProofMedia, type PortfolioClientWithServices, type SubServiceWithMedia } from "@/lib/queries";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";

export default function ProofOfConceptGalleryPage() {
  const params = useParams();
  const clientId = params?.clientId as string;
  const serviceId = params?.serviceId as string;
  const subServiceId = params?.subServiceId as string;
  
  const [client, setClient] = useState<PortfolioClientWithServices | null>(null);
  const [subService, setSubService] = useState<SubServiceWithMedia | null>(null);
  const [proofMedia, setProofMedia] = useState<PortfolioProofMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId || !subServiceId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getPortfolioClientById(clientId),
      getSubServiceByIdWithMedia(subServiceId),
      getPortfolioProofMedia(clientId, subServiceId)
    ])
      .then(([clientData, subServiceData, proofMediaData]) => {
        setClient(clientData);
        setSubService(subServiceData);
        setProofMedia(proofMediaData);
      })
      .catch((error) => console.error("Error fetching gallery details:", error))
      .finally(() => setLoading(false));
  }, [clientId, subServiceId]);


  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (!client || !subService) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Gallery details not found" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-dark">
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-dark/80 z-0" />
          {subService.image_url && (
            <div className="absolute inset-0 opacity-20">
              <img 
                src={subService.image_url} 
                alt={subService.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Link 
                href={`/portfolio/${clientId}/${serviceId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Sub-Services
              </Link>
              <h1 className="heading-lg text-white mb-6 uppercase tracking-wider">{subService.title}</h1>
              <p className="text-white/70 text-xl leading-relaxed mb-8">
                Proof of concept and project gallery for <span className="text-primary font-bold">{client.name}</span>.
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                  {proofMedia.length} Gallery Items
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            {proofMedia.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {proofMedia.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg bg-gray-100 border border-gray-100 cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.caption || subService.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                      <p className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {item.caption || subService.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-teko font-bold text-dark mb-4 uppercase tracking-wider">Gallery Coming Soon</h3>
                <p className="text-gray-500 text-lg">We are currently curating the proof of concept images for this sub-service. Please check back later.</p>
              </div>
            )}
          </div>
        </section>

        {/* Client Branding Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-xl mx-auto">
              <p className="section-title">Showcasing Excellence</p>
              <h2 className="text-3xl font-teko font-bold text-dark mb-8 uppercase tracking-wider">Work Delivered for {client.name}</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8" />
              <p className="text-gray-600 text-lg italic leading-relaxed">
                "We take pride in our ability to deliver high-quality, professional solutions that meet the unique needs of each of our clients."
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
