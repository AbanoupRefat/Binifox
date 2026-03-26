import Header from "@/components/Header";
import Services from "@/components/Services";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Services - Binifox",
  description: "Explore our comprehensive range of digital services including web design, app development, SEO marketing, and more.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Our Services</h1>
              <p className="text-white/70 text-lg">
                Comprehensive digital solutions tailored to your business needs
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <Services />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
