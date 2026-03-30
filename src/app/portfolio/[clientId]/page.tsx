import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioClientById, getPortfolioClients, type PortfolioClientWithServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, Facebook, Instagram, Send, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Client Portfolio - Binifox",
  description: "Explore the services we've provided for this client.",
};

export async function generateStaticParams() {
  try {
    const clients = await getPortfolioClients();
    return clients.map((client) => ({
      clientId: client.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ClientPortfolioPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  let client: PortfolioClientWithServices | null = null;

  try {
    client = await getPortfolioClientById(clientId);
  } catch (error) {
    console.error("Error fetching client details:", error);
  }

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

            {client.services && client.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {client.services.map((service) => {
                  const IconComponent = getIcon(service.icon_name);
                  return (
                    <Link
                      key={service.id}
                      href={`/portfolio/${clientId}/${service.id}`}
                      className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                    >
                      {/* Service Image */}
                      <div className="relative h-56 bg-gray-200 overflow-hidden">
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-dark">
                            <IconComponent className="w-16 h-16 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="text-2xl font-teko font-bold text-dark mb-4 group-hover:text-primary transition-colors uppercase tracking-wider">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-8 line-clamp-3 flex-1">
                          {service.short_description ||
                            "Specialized professional service delivered with excellence and innovation."}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-teko font-bold uppercase tracking-widest text-lg group-hover:gap-4 transition-all">
                          View Sub-Services <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 max-w-2xl mx-auto">
                <p className="text-gray-500 text-xl font-teko uppercase tracking-wider">
                  No services assigned yet.
                </p>
                <p className="text-gray-400 mt-2">
                  Services provided to this client will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
