"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { getPortfolioClients, type PortfolioClient } from "@/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  const [clients, setClients] = useState<PortfolioClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioClients()
      .then((data) => {
        setClients(data);
      })
      .catch((error) => {
        console.error("Error fetching portfolio clients:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Companies Portfolio</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Discover the successful projects and collaborations we've delivered for our valued clients.
              </p>
            </div>
          </div>
        </section>

        {/* Clients Grid */}
        <section className="py-20 lg:py-28 bg-white min-h-[50vh]">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : clients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clients.map((client) => (
                  <Link 
                    key={client.id} 
                    href={`/portfolio/${client.id}`}
                    className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                  >
                    {/* Client Logo/Cover */}
                    <div className="relative h-64 bg-white p-12 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                      {client.logo_url ? (
                        <img 
                          src={client.logo_url} 
                          alt={client.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-4xl font-teko font-bold text-primary uppercase text-center">{client.name}</div>
                      )}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                    </div>

                    {/* Client Info */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="mb-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                          {client.category || "Client"}
                        </span>
                      </div>
                      <h2 className="text-3xl font-teko font-bold text-dark mb-4 group-hover:text-primary transition-colors uppercase tracking-wider">
                        {client.name}
                      </h2>
                      <p className="text-gray-600 mb-8 line-clamp-3 flex-1">
                        {client.description || "Leading company in their industry, collaborating with Binifox for professional digital solutions."}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-teko font-bold uppercase tracking-widest text-lg group-hover:gap-4 transition-all">
                        View Portfolio <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-xl font-teko uppercase tracking-wider">No portfolio clients found.</p>
                <p className="text-gray-400 mt-2">Add clients through the dashboard to showcase your work.</p>
              </div>
            )}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
