import fs from 'fs'
import path from 'path'

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  try {
    const files = fs.readdirSync(imagesDir)
    const imageFiles = files.filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))

    return new Response(JSON.stringify(imageFiles.map(name => `/images/${name}`)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to read images' }), { status: 500 })
  }
}