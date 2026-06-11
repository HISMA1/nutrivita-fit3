// Netlify Function: Messages fetch and post
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function sbReq(method, body = null) {
  const url = `${SUPABASE_URL}/rest/v1/messages?select=*&order=ts.asc&limit=100`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

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
      const messages = await sbReq('GET');
      return {
        statusCode: 200,
        body: JSON.stringify(messages)
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
