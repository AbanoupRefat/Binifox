import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { getServiceByIdWithSubServices, getServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { getGDriveEmbedUrl } from "@/lib/utils";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Service Details - Binifox",
  description: "Learn more about our service.",
};

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((service) => ({
      id: service.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let service;
  let allServices: any[] = [];

  try {
    service = await getServiceByIdWithSubServices(id);
    allServices = await getServices();
  } catch (error) {
    console.error("Error fetching service:", error);
  }

  if (!service) {
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Service not found" />
        </main>
        <Footer />
      </>
    );
  }

  const IconComponent = getIcon(service.icon_name);
  const currentIndex = allServices.findIndex(s => s.id === service.id);
  const previousService = currentIndex > 0 ? allServices[currentIndex - 1] : allServices[allServices.length - 1];
  const nextService = currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : allServices[0];

  // Parse features and process steps if they're stored as JSON strings
  const features = Array.isArray(service.features) 
    ? service.features 
    : service.features ? JSON.parse(service.features) : [
        "Research beyond the business plan",
        "Marketing options and rates",
        "The ability to turnaround consulting",
        "Customer engagement matters"
      ];

  const processSteps = Array.isArray(service.process_steps)
    ? service.process_steps
    : service.process_steps ? JSON.parse(service.process_steps) : [
        "Consultation & Planning",
        "Design & Development",
        "Testing & QA",
        "Launch & Support"
      ];

  const clients = Array.isArray(service.clients) ? service.clients : [];
  const subServices = service.sub_services || [];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header with Background Image */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-dark/80 z-0" />
          {service.image_url && (
            <div className="absolute inset-0 opacity-20">
              <img 
                src={service.image_url} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center bg-primary/20 rounded-lg border border-primary/50">
                  <IconComponent className="w-12 h-12 text-primary stroke-1" />
                </div>
              </div>
              <h1 className="heading-lg text-white mb-4">{service.title}</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                {service.short_description || "Professional service tailored to meet your business needs"}
              </p>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Main Description */}
              <div className="mb-16">
                <h2 className="text-3xl font-teko font-bold text-dark mb-6">Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {service.description || `Need something changed or is there something not quite working the way you envisaged? Is your service a little old and tired and need refreshing? We provide professional expertise combined with innovative approaches to ensure your project's success.`}
                </p>
              </div>

              {/* Features and Process Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Features */}
                <div>
                  <h3 className="text-2xl font-teko font-bold text-dark mb-8">What We Offer</h3>
                  <ul className="space-y-4">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process Steps */}
                <div>
                  <h3 className="text-2xl font-teko font-bold text-dark mb-8">Our Process</h3>
                  <div className="space-y-4">
                    {processSteps.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                          <span className="font-teko font-bold text-primary text-lg">{idx + 1}</span>
                        </div>
                        <div className="pt-1">
                          <p className="text-gray-700 text-lg font-medium">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clients Section */}
              {clients.length > 0 && (
                <div className="mb-16 bg-gray-50 p-8 lg:p-12 rounded-lg">
                  <h3 className="text-2xl font-teko font-bold text-dark mb-8 text-center">Our Clients</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {clients.map((client: string, idx: number) => (
                      <div
                        key={idx}
                        className="px-6 py-3 bg-white border-2 border-primary/20 rounded-lg hover:border-primary transition-colors"
                      >
                        <span className="text-gray-700 font-medium">{client}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Services Grid */}
              {subServices.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-3xl font-teko font-bold text-dark mb-12 text-center">Our Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subServices.map((subService, idx) => {
                      const embedUrl = subService.gdrive_video_url ? getGDriveEmbedUrl(subService.gdrive_video_url) : null;
                      
                      return (
                        <Link 
                          key={subService.id || idx} 
                          href={`/services/${id}/${subService.id}`}
                          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                        >
                          {/* Sub-Service Image */}
                          {subService.image_url && (
                            <div className="relative w-full h-56 overflow-hidden bg-gray-200">
                              <img
                                src={subService.image_url}
                                alt={subService.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-primary text-white px-4 py-2 rounded-lg font-teko font-bold uppercase tracking-wider text-lg">View Details</span>
                              </div>
                            </div>
                          )}

                          <div className="p-8">
                            {/* Sub-Service Title */}
                            <h4 className="text-2xl font-teko font-bold text-dark mb-4 group-hover:text-primary transition-colors">{subService.title}</h4>

                            {/* Sub-Service Description */}
                            {subService.description && (
                              <p className="text-gray-700 text-base mb-6 leading-relaxed line-clamp-3">
                                {subService.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-primary font-teko font-bold uppercase tracking-widest text-lg group-hover:gap-3 transition-all">
                              Read More <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Description */}
              <div className="bg-gray-50 p-8 lg:p-12 rounded-lg mb-16">
                <h3 className="text-2xl font-teko font-bold text-dark mb-4">Why Choose Us</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  Our team of experts is dedicated to delivering high-quality solutions that exceed your expectations. We combine industry best practices with innovative approaches to ensure your project's success. With years of experience in the industry, we understand the unique challenges you face and provide tailored solutions.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  We pride ourselves on our commitment to excellence, timely delivery, and 24/7 support to ensure your complete satisfaction with our services.
                </p>
              </div>

              {/* CTA Section */}
              <div className="bg-primary text-white p-12 rounded-lg text-center mb-16">
                <h3 className="text-3xl font-teko font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-lg mb-8 text-white/90">
                  Let's discuss how this service can benefit your business and help you achieve your goals.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-primary px-8 py-3 font-teko font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors rounded-lg text-lg"
                >
                  Get a Free Estimate
                </Link>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200 gap-6">
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold text-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Services
                </Link>
                <div className="flex gap-3">
                  <Link
                    href={`/services/${previousService.id}`}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary transition-colors"
                    title={`Previous: ${previousService.title}`}
                  >
                    <ChevronLeft className="w-5 h-5 text-dark" />
                  </Link>
                  <Link
                    href={`/services/${nextService.id}`}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-primary transition-colors"
                    title={`Next: ${nextService.title}`}
                  >
                    <ChevronRight className="w-5 h-5 text-dark" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Services */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-3xl font-teko font-bold text-dark mb-12 text-center">
              All Services
            </h3>
            <Services />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
