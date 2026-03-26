"use client";

import { useState } from 'react';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { revalidateHelpers } from '@/lib/revalidate';

export default function TeamAdmin() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !role) return;

    setIsUploading(true);
    setMessage('');

    try {
      const imageUrl = await uploadImage(file, 'team-images');
      
      if (!imageUrl) throw new Error('Image upload failed');

      const { error } = await supabase
        .from('team_members')
        .insert({
          name,
          role,
          image_url: imageUrl,
          facebook_url: facebookUrl || '#',
          twitter_url: twitterUrl || '#',
          instagram_url: instagramUrl || '#',
          linkedin_url: linkedinUrl || '#'
        });

      if (error) throw error;

      // Revalidate pages that show team members
      await revalidateHelpers.team();

      setMessage('Team member successfully added!');
      setName('');
      setRole('');
      setFile(null);
      setFacebookUrl('');
      setTwitterUrl('');
      setInstagramUrl('');
      setLinkedinUrl('');
      
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold font-teko uppercase tracking-wide text-dark mb-6">Add Team Member</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <input 
            type="text" 
            required 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            placeholder="e.g., CEO & Founder"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image *</label>
          <input 
            type="file" 
            required 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Social Media Links (Optional)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
              <input 
                type="url" 
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                placeholder="https://facebook.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
              <input 
                type="url" 
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input 
                type="url" 
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input 
                type="url" 
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="bg-primary text-white px-6 py-3 font-teko uppercase tracking-wider disabled:opacity-50 hover:bg-dark transition-colors"
        >
          {isUploading ? 'Uploading & Saving...' : 'Save Team Member'}
        </button>
      </form>
    </div>
  );
}
