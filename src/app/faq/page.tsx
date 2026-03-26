import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQ - Binifox",
  description: "Frequently asked questions about Binifox services and solutions.",
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-white/70 text-lg">
                Find answers to common questions about our services
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
