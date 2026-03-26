"use client";

import { useState } from 'react';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function NewsAdmin() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('0');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !author || !date) return;

    setIsUploading(true);
    setMessage('');

    try {
      const imageUrl = await uploadImage(file, 'news-images');
      
      if (!imageUrl) throw new Error('Image upload failed');

      const { error } = await supabase
        .from('news')
        .insert({
          title,
          author,
          comments_count: parseInt(comments),
          image_url: imageUrl
        });

      if (error) throw error;

      setMessage('News article successfully added!');
      setTitle('');
      setAuthor('');
      setDate('');
      setComments('0');
      setFile(null);
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add News Article</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Article Title *</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., New Design Trends for 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
          <input 
            type="text" 
            required 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input 
            type="text" 
            required 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., 15 Jan, 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments Count</label>
          <input 
            type="number" 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Article Image *</label>
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
          {isUploading ? 'Uploading & Saving...' : 'Save Article'}
        </button>
      </form>
    </div>
  );
}
