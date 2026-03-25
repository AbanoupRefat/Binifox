"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

const categories = ["Show All", "Design", "Logo", "Business", "Agency"];

const projects = [
  {
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80",
    title: "Binifox Business",
    category: "Business",
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    title: "Marketing Analysis",
    category: "Design",
  },
  {
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    title: "Business Idea",
    category: "Logo",
  },
  {
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
    title: "Consultation",
    category: "Agency",
  },
  {
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    title: "Digital Marketing",
    category: "Business",
  },
  {
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&q=80",
    title: "Super Experience",
    category: "Design",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Show All");

  const filteredProjects =
    activeCategory === "Show All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="section-title">Features Project</p>
          <h2 className="heading-md text-dark">Explore Our Project.</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-teko text-lg uppercase tracking-wider transition-colors duration-300 ${
                activeCategory === category
                  ? "text-primary"
                  : "text-dark hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.title}
              className="group relative h-72 overflow-hidden cursor-pointer"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-primary flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-teko text-2xl uppercase text-white mb-1">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
