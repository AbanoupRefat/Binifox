"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface ServiceAccordionProps {
  processSteps: string[];
}

export default function ServiceAccordion({ processSteps }: ServiceAccordionProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  if (!processSteps || processSteps.length === 0) return null;

  return (
    <div className="pt-6">
      <h4 className="text-3xl font-teko font-bold uppercase text-dark tracking-wide mb-6">Our Process Workflow</h4>
      <div className="space-y-3">
        {processSteps.map((step, idx) => {
          const isOpen = openAccordion === idx;
          return (
            <div 
              key={idx} 
              className={`border rounded-lg transition-all duration-300 ${isOpen ? 'border-primary shadow-sm bg-white' : 'border-gray-200 bg-gray-50'}`}
            >
              <button
                type="button"
                onClick={() => setOpenAccordion(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className={`font-teko text-xl uppercase tracking-wider ${isOpen ? 'text-primary' : 'text-dark'}`}>
                  {idx + 1}. {step}
                </span>
                {isOpen ? (
                  <span className="bg-primary text-white p-1 rounded"><Minus className="w-4 h-4" /></span>
                ) : (
                  <span className="bg-gray-200 text-gray-500 p-1 rounded"><Plus className="w-4 h-4" /></span>
                )}
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                  We meticulously execute this phase of the project focusing on the highest standard of deliverables to ensure the success of your objective. Our team is fully committed during the {step.toLowerCase()} step.
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
