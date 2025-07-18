import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { getSettings, updateSettings } from '@/app/lib/settings'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newSettings = await request.json()
    const success = await updateSettings(newSettings)
    
    if (success) {
      return NextResponse.json({ message: 'Settings updated successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 })
  }
}