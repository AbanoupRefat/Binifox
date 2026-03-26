import Header from "@/components/Header";
import Team from "@/components/Team";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Team - Binifox",
  description: "Meet the talented team members behind Binifox digital agency.",
};

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Our Team</h1>
              <p className="text-white/70 text-lg">
                Meet the experts who bring your vision to life
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <Team />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
