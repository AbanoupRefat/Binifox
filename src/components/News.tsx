"use client";

import Image from "next/image";
import { User, MessageCircle, ArrowRight } from "lucide-react";

const articles = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
    date: "15 March 21",
    author: "Diboli",
    comments: 23,
    title: "Time is money but its not full demand.",
  },
  {
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    date: "22 March 21",
    author: "Diboli",
    comments: 23,
    title: "We Are Trying To Do Best Work.",
  },
  {
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    date: "28 March 21",
    author: "Diboli",
    comments: 23,
    title: "Nature is The best place for fresh mind.",
  },
];

export default function News() {
  return (
    <section id="news" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <p className="section-title">Features News</p>
          <h2 className="heading-md text-dark">Latest News & Articles.</h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.title} className="group">
              {/* Image */}
              <div className="relative h-64 overflow-hidden mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 font-teko text-sm uppercase">
                  {article.date}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 mb-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {article.comments} Comments
                </span>
              </div>

              {/* Title */}
              <h3 className="font-teko text-2xl uppercase text-dark mb-4 group-hover:text-primary transition-colors duration-300">
                {article.title}
              </h3>

              {/* Read More */}
              <a
                href="#"
                className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white hover:bg-dark transition-colors duration-300"
              >
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
