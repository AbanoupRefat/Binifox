"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getProjects } from "@/lib/queries";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorFallback } from "./ErrorFallback";
import type { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const categories = ["Show All", "Design", "Logo", "Business", "Agency"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Show All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Unable to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects =
    activeCategory === "Show All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-title">Features Project</p>
            <h2 className="heading-md text-dark">Explore Our Project.</h2>
          </div>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-title">Features Project</p>
            <h2 className="heading-md text-dark">Explore Our Project.</h2>
          </div>
          <ErrorFallback message={error} />
        </div>
      </section>
    );
  }

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
