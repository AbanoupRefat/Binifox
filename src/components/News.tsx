"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, MessageCircle, ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/queries";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorFallback } from "./ErrorFallback";

type Article = {
  id: string;
  image: string;
  date: string;
  author: string;
  comments: number;
  title: string;
  created_at: string;
};

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getArticles()
      .then((data) => { setArticles(data); setLoading(false); })
      .catch((err) => {
        console.error('Failed to fetch articles:', err);
        setError('Unable to load articles. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <section id="news" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8"><LoadingSpinner /></div>
    </section>
  );

  if (error) return <ErrorFallback message={error} />;

  return (
    <section id="news" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16">
          <p className="section-title">Features News</p>
          <h2 className="heading-md text-dark">Latest News & Articles.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.title} className="group">
              <div className="relative h-64 overflow-hidden mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 font-teko text-sm uppercase">
                  {article.date}
                </div>
              </div>
              <div className="flex items-center gap-6 mb-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2"><User className="w-4 h-4" />{article.author}</span>
                <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" />{article.comments} Comments</span>
              </div>
              <h3 className="font-teko text-2xl uppercase text-dark mb-4 group-hover:text-primary transition-colors duration-300">
                {article.title}
              </h3>
              <a href="#" className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white hover:bg-dark transition-colors duration-300">
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
