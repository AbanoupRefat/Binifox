"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';
import { uploadImage } from '@/lib/storage';
import { Briefcase, Code, Palette, TrendingUp, Users, Zap, Target, Award, X, Edit2, Trash2, Plus, ChevronDown, Search, Upload, Image as ImageIcon, Video } from 'lucide-react';

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

interface SubServiceMedia {
  id?: string;
  sub_service_id?: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  display_order: number;
}

interface SubService {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  gdrive_video_url: string;
  display_order?: number;
  sub_service_media?: SubServiceMedia[];
}

interface Service {
  id: string;
  title: string;
  icon_name: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  features?: string[];
  process_steps?: string[];
  clients?: string[];
  created_at: string;
  sub_services?: SubService[];
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
    clients: false,
    subServices: false,
  });

  // Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Briefcase');
  const [features, setFeatures] = useState<string[]>(['']);
  const [processSteps, setProcessSteps] = useState<string[]>(['']);
  const [clients, setClients] = useState<string[]>(['']);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*, sub_services(*, sub_service_media(*))')
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
    setClients(['']);
    setSubServices([]);
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
    setClients(Array.isArray(service.clients) ? service.clients : (service.clients ? JSON.parse(service.clients as any) : ['']));
    
    // Ensure sub_service_media is an array for each sub_service
    const mappedSubServices = (service.sub_services || []).map(ss => ({
      ...ss,
      sub_service_media: ss.sub_service_media || []
    }));
    setSubServices(mappedSubServices);
    
    setEditingId(service.id);
    setShowAddForm(true);
    setMessage('');
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This will also delete all associated sub-services.')) return;

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSubService: boolean = false, subServiceIndex?: number, mediaIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, 'services');
      if (url) {
        if (isSubService && subServiceIndex !== undefined) {
          const newSubServices = [...subServices];
          if (mediaIndex !== undefined) {
            // Media item image upload
            const media = [...(newSubServices[subServiceIndex].sub_service_media || [])];
            media[mediaIndex].url = url;
            newSubServices[subServiceIndex].sub_service_media = media;
          } else {
            // Sub-service main image upload
            newSubServices[subServiceIndex].image_url = url;
          }
          setSubServices(newSubServices);
        } else {
          setImageUrl(url);
        }
        setMessage('Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error uploading image');
      }
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const filteredFeatures = features.filter(f => f.trim());
      const filteredSteps = processSteps.filter(s => s.trim());
      const filteredClients = clients.filter(c => c.trim());

      const serviceData = {
        title,
        icon_name: iconName,
        short_description: shortDescription || null,
        description: description || null,
        image_url: imageUrl || null,
        features: filteredFeatures.length > 0 ? filteredFeatures : null,
        process_steps: filteredSteps.length > 0 ? filteredSteps : null,
        clients: filteredClients.length > 0 ? filteredClients : null,
      };

      let serviceId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage('Service updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([serviceData])
          .select();

        if (error) throw error;
        serviceId = data?.[0]?.id;
        setMessage('Service added successfully!');
      }

      // Handle sub-services and their media
      if (serviceId) {
        // Delete existing sub-services (and their media via cascade) if updating
        if (editingId) {
          await supabase.from('sub_services').delete().eq('service_id', serviceId);
        }

        for (let i = 0; i < subServices.length; i++) {
          const ss = subServices[i];
          if (!ss.title.trim()) continue;

          const { data: newSS, error: ssError } = await supabase
            .from('sub_services')
            .insert([{
              service_id: serviceId,
              title: ss.title,
              description: ss.description || null,
              image_url: ss.image_url || null,
              gdrive_video_url: ss.gdrive_video_url || null,
              display_order: i,
            }])
            .select()
            .single();

          if (ssError) throw ssError;

          // Handle sub-service media
          if (newSS && ss.sub_service_media && ss.sub_service_media.length > 0) {
            const mediaToInsert = ss.sub_service_media
              .filter(m => m.url.trim())
              .map((m, mIdx) => ({
                sub_service_id: newSS.id,
                type: m.type,
                url: m.url,
                caption: m.caption || null,
                display_order: mIdx,
              }));

            if (mediaToInsert.length > 0) {
              const { error: mError } = await supabase
                .from('sub_service_media')
                .insert(mediaToInsert);
              if (mError) throw mError;
            }
          }
        }
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

  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const handleProcessStepChange = (index: number, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = value;
    setProcessSteps(newSteps);
  };

  const handleAddProcessStep = () => setProcessSteps([...processSteps, '']);
  const handleRemoveProcessStep = (index: number) => setProcessSteps(processSteps.filter((_, i) => i !== index));

  const handleClientChange = (index: number, value: string) => {
    const newClients = [...clients];
    newClients[index] = value;
    setClients(newClients);
  };

  const handleAddClient = () => setClients([...clients, '']);
  const handleRemoveClient = (index: number) => setClients(clients.filter((_, i) => i !== index));

  const handleSubServiceChange = (index: number, field: keyof SubService, value: any) => {
    const newSubServices = [...subServices];
    newSubServices[index] = { ...newSubServices[index], [field]: value };
    setSubServices(newSubServices);
  };

  const handleAddSubService = () => {
    setSubServices([...subServices, { title: '', description: '', image_url: '', gdrive_video_url: '', sub_service_media: [] }]);
  };

  const handleRemoveSubService = (index: number) => {
    setSubServices(subServices.filter((_, i) => i !== index));
  };

  // Sub-service media handlers
  const handleAddMedia = (ssIndex: number, type: 'image' | 'video') => {
    const newSubServices = [...subServices];
    const media = [...(newSubServices[ssIndex].sub_service_media || [])];
    media.push({ type, url: '', caption: '', display_order: media.length });
    newSubServices[ssIndex].sub_service_media = media;
    setSubServices(newSubServices);
  };

  const handleRemoveMedia = (ssIndex: number, mIndex: number) => {
    const newSubServices = [...subServices];
    const media = [...(newSubServices[ssIndex].sub_service_media || [])];
    media.splice(mIndex, 1);
    newSubServices[ssIndex].sub_service_media = media;
    setSubServices(newSubServices);
  };

  const handleMediaChange = (ssIndex: number, mIndex: number, field: keyof SubServiceMedia, value: string) => {
    const newSubServices = [...subServices];
    const media = [...(newSubServices[ssIndex].sub_service_media || [])];
    media[mIndex] = { ...media[mIndex], [field]: value };
    newSubServices[ssIndex].sub_service_media = media;
    setSubServices(newSubServices);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SelectedIcon = iconOptions.find(opt => opt.name === iconName)?.component || Briefcase;
  const filteredServices = services.filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-teko font-bold text-dark uppercase tracking-wider">Services Management</h1>
          <p className="text-gray-600">Create and manage your business services and sub-services</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) resetForm();
            else setShowAddForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider hover:bg-dark transition-colors rounded shadow-md"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-2xl font-teko font-bold text-dark mb-8 uppercase tracking-wider border-b pb-4">
            {editingId ? 'Edit Service' : 'Create New Service'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g., Digital Marketing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Short Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Brief one-line summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Service Icon</label>
                  <div className="grid grid-cols-4 gap-3">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setIconName(icon.name)}
                        className={`p-4 flex flex-col items-center gap-2 rounded-lg border-2 transition-all ${
                          iconName === icon.name 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-100 hover:border-gray-300 text-gray-500'
                        }`}
                      >
                        <icon.component size={24} />
                        <span className="text-[10px] font-bold uppercase">{icon.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Main Image</label>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-all group">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary mb-3" />
                          <p className="text-sm text-gray-500 group-hover:text-primary">Click to upload main image</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} disabled={uploading} />
                    </label>
                    {imageUrl && (
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')}
                        className="text-sm text-red-500 hover:underline font-medium"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('description')}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-bold text-dark uppercase tracking-wider">Full Description</h3>
                <ChevronDown className={`transform transition-transform duration-300 ${expandedSections.description ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.description && (
                <div className="p-6 border-t border-gray-200">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary min-h-[200px]"
                    placeholder="Write a detailed description of this service..."
                  />
                </div>
              )}
            </div>

            {/* Sub-Services Section */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('subServices')}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-bold text-dark uppercase tracking-wider">Sub-Services & Gallery</h3>
                <ChevronDown className={`transform transition-transform duration-300 ${expandedSections.subServices ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.subServices && (
                <div className="p-6 border-t border-gray-200 space-y-8">
                  {subServices.map((ss, ssIdx) => (
                    <div key={ssIdx} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveSubService(ssIdx)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub-Service Title</label>
                            <input
                              type="text"
                              value={ss.title}
                              onChange={(e) => handleSubServiceChange(ssIdx, 'title', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary"
                              placeholder="e.g., SEO Optimization"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea
                              value={ss.description}
                              onChange={(e) => handleSubServiceChange(ssIdx, 'description', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary h-24"
                              placeholder="Brief description..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Image</label>
                              <div className="relative h-32 bg-white border rounded-lg overflow-hidden group/img">
                                {ss.image_url ? (
                                  <img src={ss.image_url} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon size={24} />
                                  </div>
                                )}
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                  <Upload className="text-white" size={20} />
                                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, true, ssIdx)} />
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GDrive Video URL</label>
                              <input
                                type="text"
                                value={ss.gdrive_video_url}
                                onChange={(e) => handleSubServiceChange(ssIdx, 'gdrive_video_url', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary"
                                placeholder="Drive Link"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Sub-Service Media Gallery */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Additional Media (Gallery)</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddMedia(ssIdx, 'image')}
                                className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase hover:bg-primary/20 transition-colors flex items-center gap-1"
                              >
                                <Plus size={12} /> Image
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddMedia(ssIdx, 'video')}
                                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase hover:bg-blue-100 transition-colors flex items-center gap-1"
                              >
                                <Plus size={12} /> Video
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {ss.sub_service_media?.map((m, mIdx) => (
                              <div key={mIdx} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded overflow-hidden border">
                                  {m.type === 'image' ? (
                                    m.url ? <img src={m.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-gray-300" />
                                  ) : (
                                    <Video className="w-full h-full p-3 text-blue-300" />
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={m.url}
                                      onChange={(e) => handleMediaChange(ssIdx, mIdx, 'url', e.target.value)}
                                      className="flex-1 text-xs p-2 border rounded"
                                      placeholder={m.type === 'image' ? "Image URL" : "GDrive Video URL"}
                                    />
                                    {m.type === 'image' && (
                                      <label className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                                        <Upload size={14} />
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, true, ssIdx, mIdx)} />
                                      </label>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={m.caption}
                                    onChange={(e) => handleMediaChange(ssIdx, mIdx, 'caption', e.target.value)}
                                    className="w-full text-xs p-2 border rounded"
                                    placeholder="Caption (optional)"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(ssIdx, mIdx)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                            {(!ss.sub_service_media || ss.sub_service_media.length === 0) && (
                              <p className="text-center text-xs text-gray-400 py-4">No gallery items added yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSubService}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-all font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> Add Sub-Service
                  </button>
                </div>
              )}
            </div>

            {/* Features & Process (Summarized for space) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => toggleSection('features')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Key Features</h3>
                    <ChevronDown className={`transform transition-transform ${expandedSections.features ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections.features && (
                    <div className="p-4 space-y-3">
                      {features.map((f, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={f} onChange={(e) => handleFeatureChange(i, e.target.value)} className="flex-1 p-2 border rounded text-sm" placeholder="Feature" />
                          <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-400"><X size={18} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddFeature} className="text-xs text-primary font-bold uppercase">+ Add</button>
                    </div>
                  )}
               </div>
               <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => toggleSection('process')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wider">Process Steps</h3>
                    <ChevronDown className={`transform transition-transform ${expandedSections.process ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSections.process && (
                    <div className="p-4 space-y-3">
                      {processSteps.map((s, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={s} onChange={(e) => handleProcessStepChange(i, e.target.value)} className="flex-1 p-2 border rounded text-sm" placeholder="Step" />
                          <button type="button" onClick={() => handleRemoveProcessStep(i)} className="text-red-400"><X size={18} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddProcessStep} className="text-xs text-primary font-bold uppercase">+ Add</button>
                    </div>
                  )}
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-teko text-xl uppercase tracking-widest hover:bg-dark transition-all shadow-lg disabled:opacity-50"
              >
                {editingId ? 'Update Service' : 'Create Service'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-200 text-gray-500 rounded-xl font-teko text-xl uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => {
          const Icon = iconOptions.find(o => o.name === service.icon_name)?.component || Briefcase;
          return (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-gray-100">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg text-primary">
                  <Icon size={24} />
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditService(service)} className="p-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteService(service.id)} className="p-2 bg-white text-red-600 rounded-lg shadow hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-teko font-bold text-dark uppercase mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{service.short_description || 'No description provided.'}</p>
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>{service.sub_services?.length || 0} Sub-services</span>
                  <span>{new Date(service.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
