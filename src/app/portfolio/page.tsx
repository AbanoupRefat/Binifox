import Header from "@/components/Header";
import Portfolio from "@/components/Portfolio";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Portfolio - Binifox",
  description: "Explore our latest projects and portfolio work across design, development, and digital marketing.",
};

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Our Portfolio</h1>
              <p className="text-white/70 text-lg">
                Showcasing our best work and successful projects
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <Portfolio />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
