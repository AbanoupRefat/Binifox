"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How can we help your business?",
    answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "What are the advantages of Binifox?",
    answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Let's find an office near you?",
    answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    question: "Binifox WordPress theme for business?",
    answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

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
                key={faq.question}
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
