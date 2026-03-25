import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import Portfolio from "@/components/Portfolio";
import CTA from "@/components/CTA";
import News from "@/components/News";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <About />
      <Stats />
      <Team />
      <FAQ />
      <Portfolio />
      <CTA />
      <News />
      <Footer />
    </main>
  );
}
