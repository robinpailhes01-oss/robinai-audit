export default async function handler(req, res) {
  if (!["GET", "PATCH"].includes(req.method)) return res.status(405).end();

  if (req.method === "PATCH") {
    const { id, ...updates } = req.body;
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/prospects?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(updates),
      }
    );
    const result = await response.json();
    return res.status(200).json(result[0]);
  }

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/prospects?order=created_at.desc&limit=200`,
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

  const prospects = await response.json();
  return res.status(200).json({ prospects });
}
