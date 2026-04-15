"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'media_production', label: 'Media Production' },
  { key: 'media_buying', label: 'Media Buying Results' },
  { key: 'social_media', label: 'Social Media Results' },
];

export default function ClientsAdmin() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [about, setAbout] = useState('');
  const [visionMission, setVisionMission] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [snapchatUrl, setSnapchatUrl] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Photo upload state
  const [clientId, setClientId] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    setIsSubmitting(true);
    setMessage('');
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name,
          category,
          about: about || null,
          vision_mission: visionMission || null,
          facebook_url: facebookUrl || null,
          instagram_url: instagramUrl || null,
          snapchat_url: snapchatUrl || null,
          join_date: joinDate || null,
        } as any)
        .select('id')
        .single() as any;
      if (error) throw error;
      setMessage(`Client added! ID: ${data.id} — use this ID to upload photos below.`);
      setClientId(data.id);
      setName(''); setCategory(''); setAbout(''); setVisionMission('');
      setFacebookUrl(''); setInstagramUrl(''); setSnapchatUrl(''); setJoinDate('');
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !photoFiles || photoFiles.length === 0) return;
    setIsUploading(true);
    setPhotoMessage('');
    try {
      for (const file of Array.from(photoFiles)) {
        const imageUrl = await uploadImage(file, 'client-photos');
        if (!imageUrl) throw new Error('Upload failed for ' + file.name);
        const { error } = await supabase
          .from('client_photos')
          .insert({ client_id: clientId, platform, image_url: imageUrl } as any);
        if (error) throw error;
      }
      setPhotoMessage(`${photoFiles.length} photo(s) uploaded to ${platform}!`);
      setPhotoFiles(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setPhotoMessage('Error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      {/* Add Client */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add Client</h1>

        {message && (
          <div className={`p-4 mb-6 rounded text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded" placeholder="e.g., Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <input type="text" required value={category} onChange={e => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded" placeholder="e.g., E-Commerce" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Client</label>
            <textarea rows={3} value={about} onChange={e => setAbout(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded" placeholder="Brief description about the client..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Our Vision &amp; Mission</label>
            <textarea rows={3} value={visionMission} onChange={e => setVisionMission(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded" placeholder="Vision and mission statement..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Snapchat URL</label>
              <input type="url" value={snapchatUrl} onChange={e => setSnapchatUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded" placeholder="https://snapchat.com/..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <input type="text" value={joinDate} onChange={e => setJoinDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded" placeholder="e.g., Jan 2024" />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors">
            {isSubmitting ? 'Saving...' : 'Save Client'}
          </button>
        </form>
      </div>

      {/* Upload Photos */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Upload Client Photos</h2>

        {photoMessage && (
          <div className={`p-4 mb-6 rounded text-sm ${photoMessage.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {photoMessage}
          </div>
        )}

        <form onSubmit={handlePhotoUpload} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID *</label>
            <input type="text" required value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm"
              placeholder="Paste the client ID from above" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform / Section *</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded">
              {PLATFORMS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos * (select multiple)</label>
            <input type="file" required multiple accept="image/*"
              onChange={e => setPhotoFiles(e.target.files)}
              className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <button type="submit" disabled={isUploading}
            className="bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors">
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </form>
      </div>
    </div>
  );
}
