import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolioClientById, getServiceByIdWithSubServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Service Portfolio - Binifox",
  description: "Explore the sub-services and proof of concept for this client service.",
};

export const revalidate = 60;

export default async function ServicePortfolioPage({
  params,
}: {
  params: Promise<{ clientId: string; serviceId: string }>;
}) {
  const { clientId, serviceId } = await params;
  let client;
  let service;

  try {
    client = await getPortfolioClientById(clientId);
    service = await getServiceByIdWithSubServices(serviceId);
  } catch (error) {
    console.error("Error fetching service portfolio details:", error);
  }

  if (!client || !service) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Portfolio details not found" />
        </main>
        <Footer />
      </>
    );
  }

  const IconComponent = getIcon(service.icon_name);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Link 
                href={`/portfolio/${clientId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to {client.name} Portfolio
              </Link>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/50 flex-shrink-0">
                  <IconComponent className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="heading-lg text-white mb-4 uppercase tracking-wider">{service.title}</h1>
                  <p className="text-white/70 text-lg">
                    {service.short_description || `Specific ${service.title} sub-services and proof of concept for ${client.name}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Services Grid */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-teko font-bold text-dark mb-4 uppercase tracking-wider">Sub-Services Gallery</h2>
              <p className="text-gray-600 text-lg">Select a sub-service to view the proof of concept and project gallery.</p>
            </div>

            {service.sub_services && service.sub_services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.sub_services.map((subService) => (
                  <Link 
                    key={subService.id} 
                    href={`/portfolio/${clientId}/${serviceId}/${subService.id}`}
                    className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                  >
                    {/* Sub-Service Image */}
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      {subService.image_url ? (
                        <img 
                          src={subService.image_url} 
                          alt={subService.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark">
                          <IconComponent className="w-16 h-16 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-primary text-white px-6 py-2 rounded-lg font-teko font-bold uppercase tracking-wider text-lg">View Gallery</span>
                      </div>
                    </div>

                    {/* Sub-Service Info */}
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-teko font-bold text-dark mb-4 group-hover:text-primary transition-colors uppercase tracking-wider">
                        {subService.title}
                      </h3>
                      <p className="text-gray-600 mb-8 line-clamp-3 flex-1">
                        {subService.description || "Detailed overview of our specialized work and results for this category."}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-teko font-bold uppercase tracking-widest text-lg group-hover:gap-4 transition-all">
                        Proof of Concept <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 max-w-2xl mx-auto">
                <p className="text-gray-500 text-xl font-teko uppercase tracking-wider">No sub-services found.</p>
                <p className="text-gray-400 mt-2">Sub-services for this category will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
