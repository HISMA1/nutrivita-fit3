// Netlify Function: Leaderboard upsert and fetch
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function sbReq(method, body = null) {
  const url = `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=pts.desc.nullslast`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  if (method === 'POST') {
    headers['Prefer'] = 'resolution=merge-duplicates';
  }

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return method === 'GET' ? await res.json() : res.ok;
}

exports.handler = async (event, context) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Supabase credentials' })
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const users = await sbReq('GET');
      return {
        statusCode: 200,
        body: JSON.stringify(users)
      };
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      await sbReq('POST', data);
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
