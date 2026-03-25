"use client";

export default function CTA() {
  return (
    <section
      className="py-20 lg:py-28 relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url(https://ext.same-assets.com/2464002308/3996784431.jpeg)" }}
    >
      <div className="absolute inset-0 bg-dark/80" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <p className="section-title mb-4">Get to Know Binifox</p>
        <h2 className="heading-lg text-white mb-8 max-w-4xl mx-auto">
          Do you have any question? Feel free to contact us.
        </h2>
        <a
          href="#contact"
          className="inline-block bg-primary text-white px-10 py-4 font-teko text-lg uppercase tracking-wider hover:bg-white hover:text-dark transition-all duration-300"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
