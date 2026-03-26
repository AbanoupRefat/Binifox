"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';
import { Briefcase, Code, Palette, TrendingUp, Users, Zap, Target, Award, X } from 'lucide-react';

const iconOptions = [
  { name: 'Briefcase', component: Briefcase },
  { name: 'Code', component: Code },
  { name: 'Palette', component: Palette },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'Users', component: Users },
  { name: 'Zap', component: Zap },
  { name: 'Target', component: Target },
  { name: 'Award', component: Award },
];

export default function ServicesAdmin() {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Briefcase');
  const [features, setFeatures] = useState<string[]>(['']);
  const [processSteps, setProcessSteps] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    description: false,
    features: false,
    process: false,
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleProcessStepChange = (index: number, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = value;
    setProcessSteps(newSteps);
  };

  const handleAddProcessStep = () => {
    setProcessSteps([...processSteps, '']);
  };

  const handleRemoveProcessStep = (index: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== index));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Filter out empty features and process steps
      const filteredFeatures = features.filter(f => f.trim());
      const filteredSteps = processSteps.filter(s => s.trim());

      const { error } = await supabase
        .from('services')
        .insert({ 
          title, 
          icon_name: iconName,
          short_description: shortDescription || null,
          description: description || null,
          image_url: imageUrl || null,
          features: filteredFeatures.length > 0 ? filteredFeatures : null,
          process_steps: filteredSteps.length > 0 ? filteredSteps : null,
        } as any);
      
      if (error) throw error;
      
      await revalidateHelpers.services();
      setMessage('Service successfully added!');
      
      // Reset form
      setTitle('');
      setShortDescription('');
      setDescription('');
      setImageUrl('');
      setIconName('Briefcase');
      setFeatures(['']);
      setProcessSteps(['']);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedIcon = iconOptions.find(opt => opt.name === iconName)?.component || Briefcase;

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-2">Add Service</h1>
      <p className="text-gray-600 mb-6">Create a new service with detailed information and features</p>

      {message && (
        <div className={`p-4 mb-6 rounded flex items-center justify-between ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-lg">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information Section */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-semibold text-dark">Basic Information</h2>
            <span className={`transform transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {expandedSections.basic && (
            <div className="p-6 space-y-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  placeholder="e.g., Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  placeholder="Brief description shown in service header"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{shortDescription.length}/150</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-w-xs h-auto rounded border border-gray-200"
                      onError={() => setMessage('Error: Invalid image URL')}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-semibold text-dark">Detailed Description</h2>
            <span className={`transform transition-transform ${expandedSections.description ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {expandedSections.description && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary font-mono text-sm"
                  placeholder="Enter detailed description of the service..."
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">Supports plain text and markdown formatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('features')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-semibold text-dark">Features & Benefits</h2>
            <span className={`transform transition-transform ${expandedSections.features ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {expandedSections.features && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Add key features and benefits of this service</p>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors font-medium text-sm"
              >
                + Add Feature
              </button>
            </div>
          )}
        </div>

        {/* Process Steps Section */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('process')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-semibold text-dark">Process Steps</h2>
            <span className={`transform transition-transform ${expandedSections.process ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {expandedSections.process && (
            <div className="p-6 space-y-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Define the steps involved in delivering this service</p>
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary flex items-center justify-center font-teko font-bold text-primary">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleProcessStepChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                    placeholder={`Step ${index + 1}`}
                  />
                  {processSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProcessStep(index)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddProcessStep}
                className="px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors font-medium text-sm"
              >
                + Add Step
              </button>
            </div>
          )}
        </div>

        {/* SQL Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Database Schema</h3>
          <p className="text-sm text-blue-800 mb-3">The following SQL schema is used for the services table:</p>
          <pre className="bg-white p-3 rounded border border-blue-200 text-xs overflow-x-auto text-gray-700">
{`CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  icon_name VARCHAR(100),
  short_description VARCHAR(150),
  description TEXT,
  image_url VARCHAR(500),
  features TEXT[] (JSON array),
  process_steps TEXT[] (JSON array),
  created_at TIMESTAMP DEFAULT NOW()
);`}
          </pre>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors rounded"
        >
          {isSubmitting ? 'Saving...' : 'Save Service'}
        </button>
      </form>

      {/* Supabase Connection Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-dark mb-2">Supabase Setup Instructions</h3>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to SQL Editor</li>
          <li>Run the SQL schema above to create/update the services table</li>
          <li>Ensure Row Level Security (RLS) is configured appropriately</li>
          <li>Test the connection using the form above</li>
        </ol>
      </div>
    </div>
  );
}
