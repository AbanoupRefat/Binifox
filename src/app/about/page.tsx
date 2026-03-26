import Header from "@/components/Header";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us - Binifox",
  description: "Learn more about Binifox digital agency, our team, and our mission.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">About Us</h1>
              <p className="text-white/70 text-lg">
                Discover our story, values, and the talented team behind Binifox
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <About />

        {/* Stats Section */}
        <Stats />

        {/* Team Section */}
        <Team />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
