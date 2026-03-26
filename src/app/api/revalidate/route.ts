import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  // Validate secret token to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 })
    }

    // Revalidate the specified path
    revalidatePath(path)
    
    return NextResponse.json({ revalidated: true, path, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 })
  }
}
