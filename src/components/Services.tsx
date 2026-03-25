import { getServices } from "@/lib/queries";
import { getIcon } from "@/lib/iconMap";
import { ErrorFallback } from "./ErrorFallback";

export default async function Services() {
  let services;
  
  try {
    services = await getServices();
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return <ErrorFallback message="Unable to load services" />;
  }
  return (
    <section id="services" className="dark-section py-20 lg:py-28 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white" />
        <div className="absolute top-20 right-20 w-16 h-16 border border-white" />
        <div className="absolute bottom-10 left-1/4 w-12 h-12 border border-white" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border border-white" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-title">Features Services</p>
          <h2 className="heading-md text-white">Explore Our Services.</h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon_name);
            
            return (
              <div
                key={service.id}
                className="group relative p-8 lg:p-10 border border-white/10 hover:bg-primary transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="mb-6">
                  <IconComponent className="w-16 h-16 text-primary group-hover:text-white transition-colors duration-300 stroke-1" />
                </div>

                {/* Title */}
                <h3 className="font-teko text-xl uppercase tracking-wider text-white mb-4">
                  {service.title}
                </h3>

                {/* Orange Bar */}
                <div className="w-8 h-1 bg-primary group-hover:bg-white transition-colors duration-300" />

                {/* Index Number */}
                <span className="absolute bottom-4 right-4 font-teko text-4xl text-white/10 group-hover:text-white/30 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }} />
    </section>
  );
}
