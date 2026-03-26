"use client";

import { useState } from 'react';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function PortfolioAdmin() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Design');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    setMessage('');

    try {
      // 1. Upload the image using our utility
      const imageUrl = await uploadImage(file, 'portfolio-images');
      
      if (!imageUrl) throw new Error('Image upload failed');

      // 2. Save the text data + image URL to PostgreSQL
      const { error } = await supabase
        .from('projects')
        .insert({
          title,
          category,
          image_url: imageUrl
        });

      if (error) throw error;

      setMessage('Project successfully added!');
      setTitle('');
      setFile(null); // Reset form
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add New Project</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., Modern Web Redesign"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
          >
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Agency">Agency</option>
            <option value="Logo">Logo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
          <input 
            type="file" 
            required 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors"
        >
          {isUploading ? 'Uploading & Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}
