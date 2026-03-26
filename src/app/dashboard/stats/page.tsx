"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, Users, Briefcase, TrendingUp, Target, Zap } from 'lucide-react';

const iconOptions = [
  { name: 'Award', component: Award },
  { name: 'Users', component: Users },
  { name: 'Briefcase', component: Briefcase },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'Target', component: Target },
  { name: 'Zap', component: Zap },
];

export default function StatsAdmin() {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [iconName, setIconName] = useState('Award');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !value) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('stats')
        .insert({
          label,
          value: parseInt(value),
          icon_name: iconName,
          display_order: parseInt(displayOrder)
        });

      if (error) throw error;

      setMessage('Stat successfully added!');
      setLabel('');
      setValue('');
      setIconName('Award');
      setDisplayOrder('1');
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedIcon = iconOptions.find(opt => opt.name === iconName)?.component || Award;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add Stat</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
          <input 
            type="text" 
            required 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., Happy Clients"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
          <input 
            type="number" 
            required 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., 250"
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
          {isSubmitting ? 'Saving...' : 'Save Stat'}
        </button>
      </form>
    </div>
  );
}
