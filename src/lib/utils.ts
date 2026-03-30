/**
 * Converts a Google Drive sharing link to an embeddable preview URL.
 * Handles formats:
 *   https://drive.google.com/file/d/[ID]/view?usp=sharing
 *   https://drive.google.com/open?id=[ID]
 *   https://docs.google.com/*/d/[ID]/
 */
export function getGDriveEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
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
