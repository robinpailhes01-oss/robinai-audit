export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/audits?order=created_at.desc&limit=200`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  const audits = await response.json();
  return res.status(200).json({ audits });
}
