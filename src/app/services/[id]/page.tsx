import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { getServiceById, getServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { ErrorFallback } from "@/components/ErrorFallback";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  params: { id: string };
}) {
  let service;

  try {
    service = await getServiceById(params.id);
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

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Service Details</h1>
              <p className="text-white/70 text-lg">
                Learn more about our services
              </p>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Service Icon */}
              <div className="flex justify-center mb-12">
                <div className="w-24 h-24 flex items-center justify-center bg-primary/10 rounded-lg">
                  <IconComponent className="w-16 h-16 text-primary stroke-1" />
                </div>
              </div>

              {/* Service Title */}
              <h2 className="text-4xl font-teko font-bold text-dark mb-8 text-center">
                {service.title}
              </h2>

              {/* Service Description */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed text-center mb-8">
                  This is a detailed service page. You can add more content here such as:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-teko font-bold text-dark mb-4">What We Offer</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>✓ Professional expertise</li>
                      <li>✓ Customized solutions</li>
                      <li>✓ Timely delivery</li>
                      <li>✓ 24/7 support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-teko font-bold text-dark mb-4">Our Process</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>1. Consultation & Planning</li>
                      <li>2. Design & Development</li>
                      <li>3. Testing & QA</li>
                      <li>4. Launch & Support</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Our team of experts is dedicated to delivering high-quality solutions that exceed your expectations.
                  We combine industry best practices with innovative approaches to ensure your project's success.
                </p>
              </div>

              {/* CTA Section */}
              <div className="bg-primary text-white p-12 rounded-lg text-center mb-12">
                <h3 className="text-2xl font-teko font-bold mb-4">Ready to Get Started?</h3>
                <p className="mb-6">
                  Let's discuss how this service can benefit your business.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-white text-primary px-8 py-3 font-teko font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors rounded-lg"
                >
                  Contact Us
                </Link>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Services
                </Link>
                <div className="flex gap-2">
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-dark" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-5 h-5 text-dark" />
                  </button>
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
