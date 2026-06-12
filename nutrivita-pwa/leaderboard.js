// Vercel Serverless Function: Leaderboard upsert and fetch
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
    headers['Prefer'] = 'resolution=merge-duplicates,return=representation';
  }

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });

  if (method === 'GET') {
    return await res.json();
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase error ${res.status}: ${errText}`);
  }

  return res.ok;
}

module.exports = async (req, res) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    res.status(500).json({ error: 'Missing Supabase credentials' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const users = await sbReq('GET');
      res.status(200).json(users);
      return;
    }

    if (req.method === 'POST') {
      const data = req.body;
      await sbReq('POST', data);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).send('Method not allowed');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
