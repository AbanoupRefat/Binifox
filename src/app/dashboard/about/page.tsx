"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';
import { CheckCircle, Award, Target, Users, Zap, TrendingUp } from 'lucide-react';

const iconOptions = [
  { name: 'CheckCircle', component: CheckCircle },
  { name: 'Award', component: Award },
  { name: 'Target', component: Target },
  { name: 'Users', component: Users },
  { name: 'Zap', component: Zap },
  { name: 'TrendingUp', component: TrendingUp },
];

export default function AboutAdmin() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('CheckCircle');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('about_features')
        .insert({
          title,
          description,
          icon_name: iconName,
          display_order: parseInt(displayOrder)
        });

      if (error) throw error;

      // Revalidate pages that show about features
      await revalidateHelpers.about();

      setMessage('About feature successfully added!');
      setTitle('');
      setDescription('');
      setIconName('CheckCircle');
      setDisplayOrder('1');
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedIcon = iconOptions.find(opt => opt.name === iconName)?.component || CheckCircle;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add About Feature</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., Quality Assurance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea 
            required 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="Enter a brief description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon *</label>
          <select 
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
          >
            {iconOptions.map(icon => (
              <option key={icon.name} value={icon.name}>{icon.name}</option>
            ))}
          </select>
          
          <div className="mt-4 p-4 bg-gray-50 rounded flex items-center gap-3">
            <SelectedIcon className="w-8 h-8 text-primary" />
            <span className="text-sm text-gray-600">Preview: {iconName}</span>
          </div>
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
          {isSubmitting ? 'Saving...' : 'Save About Feature'}
        </button>
      </form>
    </div>
  );
}
