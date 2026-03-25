"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getFaqs } from "@/lib/queries";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorFallback } from "./ErrorFallback";
import type { Database } from "@/lib/database.types";

type Faq = Database['public']['Tables']['faqs']['Row'];

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const data = await getFaqs();
        setFaqs(data);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Unable to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="dark-section py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dark-section py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <ErrorFallback message={error} />
        </div>
      </section>
    );
  }

  return (
    <section className="dark-section py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <p className="section-title">Frequently Asked Questions</p>
            <h2 className="heading-md text-white mb-6">How Can We Help?</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremq laudantium totam rem aperiam eaque ipsa quae
              ab illo inventore veritatis quasi architecto
            </p>
            <a
              href="#contact"
              className="inline-block border-2 border-primary text-primary px-10 py-4 font-teko text-lg uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`border border-white/10 ${
                  openIndex === index ? "bg-primary" : ""
                } transition-all duration-300`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <span className="font-teko text-lg uppercase tracking-wider text-white">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
