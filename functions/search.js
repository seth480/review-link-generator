export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight CORS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders(),
    });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query || !query.trim()) {
    return json({ error: 'Missing query parameter' }, 400);
  }

  const apiKey = env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return json({ error: 'API key not configured' }, 500);
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  return json(data, 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
