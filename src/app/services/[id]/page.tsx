import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServiceWithSubServices, getServices } from "@/lib/queries";
import ServiceAccordion from "@/components/ServiceAccordion";

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [service, allServices] = await Promise.all([
    getServiceWithSubServices(id),
    getServices()
  ]);

  if (!service) return (
    <>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Service not found.</p>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="pt-20">
        
        {/* ── Page Title Area ── */}
        <section className="relative py-24 bg-gray-900 flex items-center justify-center overflow-hidden">
          {service.image_url && (
            <div className="absolute inset-0 opacity-20">
              <Image 
                src={service.image_url} 
                alt="bg" 
                width={1920} 
                height={1080} 
                className="w-full h-full object-cover" 
                priority 
              />
            </div>
          )}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-teko uppercase font-bold text-white mb-4 tracking-wider">
              {service.title}
            </h2>
            <nav aria-label="breadcrumb">
              <ol className="flex justify-center items-center space-x-2 text-sm text-gray-400 font-medium">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><span className="text-gray-500">/</span></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><span className="text-gray-500">/</span></li>
                <li className="text-white bg-primary/20 px-2 py-0.5 rounded" aria-current="page">{service.title}</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* ── Service Details Area ── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Develop Wrapper */}
                <div className="space-y-6">
                  {service.image_url && (
                    <div className="relative w-full rounded-lg overflow-hidden shrink-0 flex justify-center bg-gray-50">
                      <Image 
                        src={service.image_url} 
                        alt={service.title} 
                        width={1200}
                        height={1200}
                        className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-sm" 
                      />
                    </div>
                  )}
                  
                  <div className="content">
                    <h3 className="text-3xl md:text-4xl font-teko font-bold uppercase text-dark mb-4 tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                      {service.description || "Detailed description coming soon."}
                    </p>
                  </div>
                </div>

                {/* Planning & Strategy (Features) */}
                {(service.features && service.features.length > 0) && (
                  <div className="bg-gray-50 rounded-xl p-8 md:p-12 border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="flex justify-center">
                         {service.sub_services?.[0]?.image_url ? (
                           <div className="relative w-full rounded-lg overflow-hidden shadow-sm flex justify-center bg-white">
                             <Image 
                               src={service.sub_services[0].image_url} 
                               alt="Planning" 
                               width={800} 
                               height={800} 
                               className="w-full h-auto max-h-[400px] object-contain rounded-lg" 
                             />
                           </div>
                         ) : (
                           <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 font-teko text-xl tracking-widest uppercase">Planning</span>
                           </div>
                         )}
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-2xl font-teko font-bold uppercase text-dark tracking-wide">Planning & Strategy</h4>
                        <p className="text-gray-600 text-sm">Strategic approaches tailored to ensure the best outcome for your project goals.</p>
                        <ul className="space-y-3 mt-4">
                          {service.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ChevronRight className="w-3 h-3 text-primary" />
                              </span>
                              <span className="text-gray-700 font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accordion: Process Steps */}
                <ServiceAccordion processSteps={service.process_steps || []} />

              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Categories Widget */}
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                  <h4 className="text-2xl font-teko font-bold uppercase tracking-wider text-dark mb-6 border-b border-gray-200 pb-3">
                    Categories
                  </h4>
                  <ul className="space-y-0">
                    {allServices.map((s: any) => {
                      const isActive = s.id === service.id;
                      return (
                        <li key={s.id} className="border-b border-gray-200 last:border-0">
                          <Link 
                            href={`/services/${s.id}`}
                            className={`flex items-center justify-between py-3 font-medium transition-colors ${
                              isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                            }`}
                          >
                            <span>{s.title}</span>
                            <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Estimate / Contact Widget */}
                <div className="bg-dark p-8 rounded-xl text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 blur-xl">
                    <div className="w-32 h-32 bg-primary rounded-full" />
                  </div>
                  <h4 className="text-3xl font-teko font-bold uppercase tracking-widest text-white relative z-10">
                    Need Assitance?
                  </h4>
                  <p className="text-white/70 text-sm relative z-10">
                    Reach out to us directly for any complex or bespoke requirements!
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
                    <Link href="/about" className="block w-full bg-primary hover:bg-white hover:text-dark text-white text-center py-3 font-teko uppercase tracking-wider transition-colors duration-300 rounded">
                      Get a free estimate
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
