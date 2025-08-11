import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'app', 'lib', 'visitors.json');

  if (!fs.existsSync(filePath)) {
    return new Response('File not found', { status: 404 });
  }

  const data = fs.readFileSync(filePath, 'utf-8');

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="visitors.json"',
    },
  });
}
