"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';
import { Briefcase, Code, Palette, TrendingUp, Users, Zap, Target, Award, X, Edit2, Trash2, Plus, ChevronDown, Search } from 'lucide-react';

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

interface Service {
  id: string;
  title: string;
  icon_name: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  features?: string[];
  process_steps?: string[];
  created_at: string;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    description: false,
    features: false,
    process: false,
  });

  // Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Briefcase');
  const [features, setFeatures] = useState<string[]>(['']);
  const [processSteps, setProcessSteps] = useState<string[]>(['']);

  // Load services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setShortDescription('');
    setDescription('');
    setImageUrl('');
    setIconName('Briefcase');
    setFeatures(['']);
    setProcessSteps(['']);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditService = (service: Service) => {
    setTitle(service.title);
    setShortDescription(service.short_description || '');
    setDescription(service.description || '');
    setImageUrl(service.image_url || '');
    setIconName(service.icon_name);
    setFeatures(Array.isArray(service.features) ? service.features : (service.features ? JSON.parse(service.features as any) : ['']));
    setProcessSteps(Array.isArray(service.process_steps) ? service.process_steps : (service.process_steps ? JSON.parse(service.process_steps as any) : ['']));
    setEditingId(service.id);
    setShowAddForm(true);
    setMessage('');
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;

      setServices(services.filter(s => s.id !== id));
      setMessage('Service deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      await revalidateHelpers.services();
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const filteredFeatures = features.filter(f => f.trim());
      const filteredSteps = processSteps.filter(s => s.trim());

      const serviceData = {
        title,
        icon_name: iconName,
        short_description: shortDescription || null,
        description: description || null,
        image_url: imageUrl || null,
        features: filteredFeatures.length > 0 ? filteredFeatures : null,
        process_steps: filteredSteps.length > 0 ? filteredSteps : null,
      };

      if (editingId) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage('Service updated successfully!');
      } else {
        // Add new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        setMessage('Service added successfully!');
      }

      await revalidateHelpers.services();
      await fetchServices();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    }
  };

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

  const SelectedIcon = iconOptions.find(opt => opt.name === iconName)?.component || Briefcase;

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-teko uppercase tracking-wide text-dark mb-2">
            Manage Services
          </h1>
          <p className="text-gray-600">
            {services.length} service{services.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-teko uppercase tracking-wider hover:bg-dark transition-colors"
        >
          <Plus size={20} />
          {showAddForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-lg">×</button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold font-teko uppercase tracking-wide text-dark mb-6">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-dark">Basic Information</h3>
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
                <h3 className="text-lg font-semibold text-dark">Detailed Description</h3>
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
                <h3 className="text-lg font-semibold text-dark">Features & Benefits</h3>
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
                <h3 className="text-lg font-semibold text-dark">Process Steps</h3>
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

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider hover:bg-dark transition-colors rounded"
              >
                {editingId ? 'Update Service' : 'Save Service'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-teko uppercase tracking-wider hover:bg-gray-50 transition-colors rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Services Table */}
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {services.length === 0 ? 'No services yet. Create your first service!' : 'No services match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Features</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-dark">{service.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{service.icon_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {service.short_description || service.description || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {Array.isArray(service.features) ? service.features.length : 0} features
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
