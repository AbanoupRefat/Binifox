import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export async function uploadImage(file: File, folderName: string = 'uploads'): Promise<string | null> {
  try {
    // 1. Generate a unique, safe filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;

    // 2. Upload to the 'public-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('public-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 3. Get the CDN Public URL to save in PostgreSQL
    const { data } = supabase.storage
      .from('public-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
