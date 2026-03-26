import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPricing } from "@/lib/queries";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing Plans - Binifox",
  description: "Explore our flexible pricing plans tailored to your business needs.",
};

export default async function PricingPage() {
  let pricingPlans;

  try {
    pricingPlans = await getPricing();
  } catch (error) {
    console.error("Failed to fetch pricing:", error);
    return (
      <>
        <Header />
        <main className="pt-20">
          <ErrorFallback message="Unable to load pricing plans" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Our Pricing Plans</h1>
              <p className="text-white/70 text-lg">
                Choose the perfect plan for your business
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                    plan.is_popular
                      ? "ring-2 ring-primary shadow-2xl transform lg:scale-105"
                      : "border border-gray-200 shadow-lg"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.is_popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold">
                      POPULAR
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Name */}
                    <h3 className="text-2xl font-teko font-bold text-dark mb-2">
                      {plan.name}
                    </h3>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                    )}

                    {/* Price */}
                    <div className="mb-8">
                      <span className="text-5xl font-bold text-dark">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-3 px-6 font-teko font-bold uppercase tracking-wider rounded-lg transition-colors mb-8 ${
                        plan.is_popular
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-100 text-dark hover:bg-primary hover:text-white"
                      }`}
                    >
                      Get Started
                    </button>

                    {/* Features */}
                    <div className="space-y-4">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No features listed</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pricingPlans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No pricing plans available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
