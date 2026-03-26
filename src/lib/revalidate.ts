/**
 * Revalidate specific paths after content updates
 * This function can be called from client components
 */
export async function revalidateContent(paths: string[]) {
  const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET
  
  if (!secret) {
    console.warn('REVALIDATION_SECRET not configured')
    return { success: false, error: 'Secret not configured' }
  }

  try {
    const promises = paths.map(path =>
      fetch(`/api/revalidate?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })
    )
    
    const results = await Promise.all(promises)
    const allSuccessful = results.every(r => r.ok)
    
    if (allSuccessful) {
      console.log('✅ Revalidated paths:', paths)
      return { success: true }
    } else {
      console.error('❌ Some paths failed to revalidate')
      return { success: false, error: 'Some paths failed' }
    }
  } catch (error) {
    console.error('Failed to revalidate:', error)
    return { success: false, error }
  }
}

/**
 * Helper to revalidate all pages that display a specific content type
 */
export const revalidateHelpers = {
  team: () => revalidateContent(['/', '/team', '/about']),
  portfolio: () => revalidateContent(['/', '/portfolio']),
  news: () => revalidateContent(['/']),
  services: () => revalidateContent(['/', '/services']),
  stats: () => revalidateContent(['/', '/about']),
  faqs: () => revalidateContent(['/', '/faq']),
  about: () => revalidateContent(['/', '/about']),
  pricing: () => revalidateContent(['/pricing']),
}
