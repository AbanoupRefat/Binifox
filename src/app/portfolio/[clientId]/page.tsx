import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioClientById, getPortfolioClients, type PortfolioClientWithServices, type PortfolioClient } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, Facebook, Instagram, Send, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ClientPortfolioPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  
  if (!clientId) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Invalid client ID" />
        </main>
        <Footer />
      </>
    );
  }

  const [client, allClients] = await Promise.all([
    getPortfolioClientById(clientId),
    getPortfolioClients()
  ]);

  const suggestedClients = allClients.filter((c: PortfolioClient) => c.id !== clientId).slice(0, 3);

  if (!client) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Client not found" />
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
          {client.logo_url && (
            <div className="absolute inset-0 opacity-10">
              <img
                src={client.logo_url}
                alt={client.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to All Clients
              </Link>

              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 text-center md:text-left">
                  <h1 className="heading-lg text-white mb-6 uppercase tracking-wider">
                    {client.name}
                  </h1>
                  <p className="text-white/70 text-xl leading-relaxed mb-8">
                    {client.description ||
                      "Leading company collaborating with Binifox for professional digital solutions."}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    {client.facebook_url && (
                      <a
                        href={client.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-primary text-white flex items-center justify-center rounded-full transition-all"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {client.instagram_url && (
                      <a
                        href={client.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-primary text-white flex items-center justify-center rounded-full transition-all"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {client.snapchat_url && (
                      <a
                        href={client.snapchat_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-primary text-white flex items-center justify-center rounded-full transition-all"
                      >
                        <Send className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Card */}
                <div className="w-full md:w-80 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-primary font-teko font-bold uppercase tracking-widest text-lg mb-1">
                        Category
                      </h4>
                      <p className="text-white text-xl font-teko uppercase">
                        {client.category || "Client"}
                      </p>
                    </div>
                    {client.join_date && (
                      <div>
                        <h4 className="text-primary font-teko font-bold uppercase tracking-widest text-lg mb-1">
                          Client Since
                        </h4>
                        <p className="text-white text-xl font-teko uppercase">
                          {client.join_date}
                        </p>
                      </div>
                    )}
                    {client.services && client.services.length > 0 && (
                      <div>
                        <h4 className="text-primary font-teko font-bold uppercase tracking-widest text-lg mb-1">
                          Services
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {client.services.map(s => (
                            <span key={s.id} className="text-sm font-medium bg-primary/20 text-white px-3 py-1 rounded-lg border border-primary/30">
                              {s.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        {client.vision_mission && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-teko font-bold text-dark mb-8 uppercase tracking-wider">
                  Vision &amp; Mission
                </h2>
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-700 text-xl leading-relaxed italic">
                    &quot;{client.vision_mission}&quot;
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services Provided */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-teko font-bold text-dark mb-4 uppercase tracking-wider">
                Services Provided
              </h2>
              <p className="text-gray-600 text-lg">
                Explore the specific services we&apos;ve delivered for {client.name}.
              </p>
            </div>

            {(() => {
              const allSubServices = client.services
                ?.flatMap(s => s.sub_services?.map(sub => ({ ...sub, parentService: s })) || [])
                .filter(sub => client.active_sub_service_ids?.includes(sub.id)) || [];
              
              if (allSubServices.length === 0) {
                return (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 max-w-2xl mx-auto">
                    <p className="text-gray-500 text-xl font-teko uppercase tracking-wider">
                      No services assigned yet.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Services provided to this client will appear here.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allSubServices.map((subService) => {
                    const IconComponent = getIcon(subService.parentService.icon_name);
                    return (
                      <Link
                        key={subService.id}
                        href={`/portfolio/${clientId}/${subService.service_id}/${subService.id}`}
                        className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                      >
                        {/* Sub-Service Image */}
                        <div className="relative h-56 bg-gray-200 overflow-hidden">
                          {subService.image_url || subService.parentService.image_url ? (
                            <img
                              src={subService.image_url || subService.parentService.image_url || ''}
                              alt={subService.title}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-dark">
                              <IconComponent className="w-16 h-16 text-primary/40" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 w-auto px-4 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                            <span className="text-white font-teko font-bold uppercase tracking-wider">{subService.parentService.title}</span>
                          </div>
                        </div>

                        {/* Sub-Service Info */}
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-2xl font-teko font-bold text-dark mb-4 group-hover:text-primary transition-colors uppercase tracking-wider">
                            {subService.title}
                          </h3>
                          <p className="text-gray-600 mb-8 line-clamp-3 flex-1">
                            {subService.description ||
                              "Specialized professional service delivered with excellence and innovation."}
                          </p>
                          <div className="flex items-center gap-2 text-primary font-teko font-bold uppercase tracking-widest text-lg group-hover:gap-4 transition-all">
                            View Proof Media <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
        {/* Suggested Clients */}
        {suggestedClients.length > 0 && (
          <section className="py-20 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-teko font-bold text-dark mb-4 uppercase tracking-wider">
                  Explore More Work
                </h2>
                <p className="text-gray-600 text-lg">
                  See how we've helped other partners achieve their goals.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {suggestedClients.map(suggested => (
                  <Link
                    key={suggested.id}
                    href={`/portfolio/${suggested.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center p-8"
                  >
                    <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary transition-colors bg-gray-50 p-2">
                      {suggested.logo_url ? (
                        <img src={suggested.logo_url} alt={suggested.name} className="w-full h-full object-contain" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl uppercase">
                          {suggested.name.charAt(0)}
                         </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{suggested.name}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{suggested.category || 'Client'}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
