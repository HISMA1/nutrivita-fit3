// Vercel Serverless Function: Activities post
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function sbReq(method, body = null) {
  const url = `${SUPABASE_URL}/rest/v1/activities`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });

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
