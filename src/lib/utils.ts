import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Google Drive sharing link to an embeddable preview URL
 * Input: https://drive.google.com/file/d/[VIDEO_ID]/view?usp=sharing
 * Output: https://drive.google.com/file/d/[VIDEO_ID]/preview
 */
export function getGDriveEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  try {
    // Extract VIDEO_ID from various Google Drive URL formats
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9-_]+)/,
      /docs\.google\.com\/[^/]+\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Google Drive URL:', error);
    return null;
  }
}
