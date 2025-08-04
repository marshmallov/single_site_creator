import { extractIP } from '@/app/services/visitorsServer';
import { saveVisitorData } from '@/app/lib/visitorLog';

export async function POST(req) {
  const ip = extractIP(req.headers);
  const body = await req.json();

  const visitorData = {
    ip,
    ...body,
    timestamp: new Date().toISOString(),
  };

  // Save to disk
  saveVisitorData(visitorData);

  return new Response(JSON.stringify({ status: 'logged' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
