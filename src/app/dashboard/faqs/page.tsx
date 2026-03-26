"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';

export default function FaqsAdmin() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('faqs')
        .insert({
          question,
          answer,
          display_order: parseInt(displayOrder)
        });

      if (error) throw error;

      // Revalidate pages that show FAQs
      await revalidateHelpers.faqs();

      setMessage('FAQ successfully added!');
      setQuestion('');
      setAnswer('');
      setDisplayOrder('1');
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add FAQ</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
          <input 
            type="text" 
            required 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., What services do you offer?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
          <textarea 
            required 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="Enter the answer to this question..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input 
            type="number" 
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="1"
            min="1"
          />
          <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save FAQ'}
        </button>
      </form>
    </div>
  );
}
