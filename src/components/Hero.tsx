"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Outstanding",
    subtitle: "Design.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
  },
  {
    title: "Smart Think",
    subtitle: "So Easy.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Content */}
          <div className={`relative h-full flex items-center justify-center transition-all duration-700 delay-300 ${
            index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="text-center text-white px-4">
              <p className="text-sm md:text-base tracking-[4px] uppercase mb-4 font-rubik">
                Welcome to Binifox Pro Agency
              </p>
              <h1 className="font-teko text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none mb-2">
                {slide.title}
              </h1>
              <h1 className="font-teko text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none mb-8">
                {slide.subtitle}
              </h1>
              <a
                href="#about"
                className="inline-block bg-primary text-white px-10 py-4 font-teko text-lg uppercase tracking-wider hover:bg-primary/90 transition-all duration-300"
              >
                Discover More
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-dark flex items-center justify-center transition-all duration-300 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-dark flex items-center justify-center transition-all duration-300 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Decorative Bars */}
      <div className="absolute bottom-0 left-0 z-20">
        <div className="w-40 h-6 bg-primary" />
        <div className="w-20 h-6 bg-primary/70 -mt-3 ml-4" />
      </div>
      <div className="absolute bottom-0 right-0 z-20">
        <div className="w-24 h-32 bg-primary" />
      </div>
    </section>
  );
}
