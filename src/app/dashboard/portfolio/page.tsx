// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, LayoutGrid, Users, Image as ImageIcon, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function PortfolioAdmin() {
  const [activeTab, setActiveTab] = useState<'clients' | 'links' | 'proof'>('clients');
  
  // Data states
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states - Client
  const [clientForm, setClientForm] = useState({
    name: '',
    description: '',
    vision_mission: '',
    category: '',
    facebook_url: '',
    instagram_url: '',
    snapchat_url: '',
    join_date: '',
    logo_file: null as File | null
  });

  // Form states - Link
  const [linkForm, setLinkForm] = useState({
    client_id: '',
    service_id: ''
  });

  // Form states - Proof
  const [proofForm, setProofForm] = useState({
    client_id: '',
    sub_service_id: '',
    caption: '',
    media_files: [] as File[]
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [clientsRes, servicesRes, subServicesRes] = await Promise.all([
        supabase.from('portfolio_clients').select('*, portfolio_client_services(service:services(title))').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('title'),
        supabase.from('sub_services').select('*, service:services(title)').order('title')
      ]);

      if (clientsRes.data) setClients(clientsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (subServicesRes.data) setSubServices(subServicesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      let logoUrl = '';
      if (clientForm.logo_file) {
        logoUrl = await uploadImage(clientForm.logo_file, 'client-logos') || '';
      }

      const { error } = await supabase.from('portfolio_clients').insert({
        name: clientForm.name,
        description: clientForm.description,
        vision_mission: clientForm.vision_mission,
        category: clientForm.category,
        facebook_url: clientForm.facebook_url,
        instagram_url: clientForm.instagram_url,
        snapchat_url: clientForm.snapchat_url,
        join_date: clientForm.join_date || null,
        logo_url: logoUrl
      });

      if (error) throw error;
      
      setMessage('Client added successfully!');
      setClientForm({
        name: '', description: '', vision_mission: '', category: '',
        facebook_url: '', instagram_url: '', snapchat_url: '',
        join_date: '', logo_file: null
      });
      fetchInitialData();
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.client_id || !linkForm.service_id) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.from('portfolio_client_services').insert({
        client_id: linkForm.client_id,
        service_id: linkForm.service_id
      });

      if (error) throw error;
      setMessage('Service linked to client successfully!');
      setLinkForm({ client_id: '', service_id: '' });
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.client_id || !proofForm.sub_service_id || proofForm.media_files.length === 0) return;
    setIsSaving(true);

    try {
      const uploadPromises = proofForm.media_files.map(async (file) => {
        const url = await uploadImage(file, 'portfolio-proof');
        if (!url) return null;
        
        return {
          client_id: proofForm.client_id,
          sub_service_id: proofForm.sub_service_id,
          url: url,
          caption: proofForm.caption
        };
      });

      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(Boolean);

      const { error } = await supabase.from('portfolio_proof_media').insert(validResults);

      if (error) throw error;
      setMessage(`${validResults.length} proof images added successfully!`);
      setProofForm({ client_id: '', sub_service_id: '', caption: '', media_files: [] });
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client? All linked services and proof media will be removed.')) return;
    try {
      await supabase.from('portfolio_clients').delete().eq('id', id);
      fetchInitialData();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) return <div className="p-8">Loading portfolio manager...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-teko font-bold uppercase tracking-wider text-dark">Portfolio Manager</h1>
          <p className="text-gray-500">Manage clients, link services, and upload proof of concept galleries.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-teko uppercase tracking-wider transition-all ${activeTab === 'clients' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'}`}
          >
            <Users className="w-4 h-4" /> Clients
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-teko uppercase tracking-wider transition-all ${activeTab === 'links' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Link Services
          </button>
          <button 
            onClick={() => setActiveTab('proof')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-teko uppercase tracking-wider transition-all ${activeTab === 'proof' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'}`}
          >
            <ImageIcon className="w-4 h-4" /> Proof Gallery
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
          {message.includes('Error') ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="font-medium">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            {activeTab === 'clients' && (
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <h2 className="text-2xl font-teko font-bold uppercase tracking-wide text-dark mb-4">Add New Client</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input type="text" required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={clientForm.category} onChange={e => setClientForm({...clientForm, category: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Real Estate" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea rows={2} value={clientForm.description} onChange={e => setClientForm({...clientForm, description: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Briefly describe the client..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision & Mission</label>
                  <textarea rows={3} value={clientForm.vision_mission} onChange={e => setClientForm({...clientForm, vision_mission: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Client's vision statement..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <input type="file" accept="image/*" onChange={e => setClientForm({...clientForm, logo_file: e.target.files?.[0] || null})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input type="text" value={clientForm.facebook_url} onChange={e => setClientForm({...clientForm, facebook_url: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" placeholder="URL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input type="text" value={clientForm.instagram_url} onChange={e => setClientForm({...clientForm, instagram_url: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" placeholder="URL" />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-3 rounded-lg font-teko uppercase tracking-widest hover:bg-dark transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Add Client'}
                </button>
              </form>
            )}

            {activeTab === 'links' && (
              <form onSubmit={handleLinkSubmit} className="space-y-4">
                <h2 className="text-2xl font-teko font-bold uppercase tracking-wide text-dark mb-4">Link Service to Client</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                  <select required value={linkForm.client_id} onChange={e => setLinkForm({...linkForm, client_id: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none">
                    <option value="">Choose a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                  <select required value={linkForm.service_id} onChange={e => setLinkForm({...linkForm, service_id: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none">
                    <option value="">Choose a service...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-3 rounded-lg font-teko uppercase tracking-widest hover:bg-dark transition-colors disabled:opacity-50">
                  {isSaving ? 'Linking...' : 'Create Link'}
                </button>
              </form>
            )}

            {activeTab === 'proof' && (
              <form onSubmit={handleProofSubmit} className="space-y-4">
                <h2 className="text-2xl font-teko font-bold uppercase tracking-wide text-dark mb-4">Upload Proof Images</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                  <select required value={proofForm.client_id} onChange={e => setProofForm({...proofForm, client_id: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none">
                    <option value="">Choose a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Sub-Service</label>
                  <select required value={proofForm.sub_service_id} onChange={e => setProofForm({...proofForm, sub_service_id: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none">
                    <option value="">Choose a sub-service...</option>
                    {subServices.map(ss => (
                      <option key={ss.id} value={ss.id}>
                        {ss.service?.title} - {ss.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
                  <input type="text" value={proofForm.caption} onChange={e => setProofForm({...proofForm, caption: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none" placeholder="Image description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setProofForm({...proofForm, media_files: Array.from(e.target.files || [])})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  <p className="text-[10px] text-gray-400 mt-1">You can select multiple images at once.</p>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-primary text-white py-3 rounded-lg font-teko uppercase tracking-widest hover:bg-dark transition-colors disabled:opacity-50">
                  {isSaving ? 'Uploading...' : 'Upload Gallery'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: List/Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-teko font-bold uppercase tracking-wide text-dark">Existing Clients</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{clients.length} Total</span>
            </div>
            <div className="divide-y divide-gray-50">
              {clients.length > 0 ? (
                clients.map(client => (
                  <div key={client.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {client.logo_url ? <img src={client.logo_url} className="w-full h-full object-contain" /> : <Users className="w-6 h-6 text-gray-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-dark group-hover:text-primary transition-colors">{client.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{client.category || 'No Category'}</p>
                        {client.portfolio_client_services && client.portfolio_client_services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.portfolio_client_services.map((pcs: any, idx: number) => (
                              <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                {pcs.service?.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteClient(client.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 italic">No clients added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
