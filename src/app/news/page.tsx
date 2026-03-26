import Header from "@/components/Header";
import News from "@/components/News";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Latest News & Blog - Binifox",
  description: "Read our latest articles, insights, and updates about digital marketing and web development.",
};

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-dark to-dark/80 py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center">
              <h1 className="heading-lg text-white mb-4">Latest News & Blog</h1>
              <p className="text-white/70 text-lg">
                Stay updated with our latest articles and insights
              </p>
            </div>
          </div>
        </section>

        {/* News Section */}
        <News />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
