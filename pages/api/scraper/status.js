export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { runId, maxResults = 20, region = "" } = req.query;
  if (!runId) return res.status(400).json({ error: "runId requis" });

  // Correct endpoint: actor-runs (not acts/actor/runs)
  const statusRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}?token=${process.env.APIFY_API_TOKEN}`
  );

  if (!statusRes.ok) {
    return res.status(200).json({ status: "running" });
  }

  const statusData = await statusRes.json();
  const apifyStatus = statusData.data?.status;

  if (!apifyStatus || ["RUNNING", "READY", "ABORTING"].includes(apifyStatus)) {
    return res.status(200).json({ status: "running" });
  }

  if (["FAILED", "ABORTED", "TIMED-OUT"].includes(apifyStatus)) {
    return res.status(200).json({ status: "failed", error: `Apify run ${apifyStatus}` });
  }

  if (apifyStatus !== "SUCCEEDED") {
    return res.status(200).json({ status: "running" });
  }

  // Correct endpoint: actor-runs/{runId}/dataset/items
  const itemsRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${process.env.APIFY_API_TOKEN}&limit=${maxResults}&format=json`
  );

  if (!itemsRes.ok) {
    return res.status(200).json({ status: "failed", error: "Impossible de récupérer les items Apify" });
  }

  const items = await itemsRes.json();

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(200).json({ status: "done", count: 0, ids: [] });
  }

  const prospects = items
    .filter(p => p.title)
    .map(p => ({
      business_name: p.title,
      address: p.address || p.street || null,
      city: p.city || extractCity(p.address) || region,
      phone: p.phone || p.phoneNumber || null,
      website: p.website || null,
      email: p.email || null,
      rating: p.totalScore ?? p.rating ?? null,
      reviews_count: p.reviewsCount ?? p.reviewCount ?? null,
      google_maps_url: p.url || null,
      categories: p.categoryName || (Array.isArray(p.categories) ? p.categories[0] : null) || null,
      status: "new",
      source: "apify_google_maps",
      region,
    }));

  if (prospects.length === 0) {
    return res.status(200).json({ status: "done", count: 0, ids: [] });
  }

  const saved = await saveToSupabase(prospects);
  const ids = saved.map(p => p.id).filter(Boolean);

  if (ids.length > 0) {
    const base = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers["x-forwarded-host"] || req.headers.host}`;
    fetch(`${base}/api/scraper/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectIds: ids }),
    }).catch(() => {});
  }

  return res.status(200).json({ status: "done", count: saved.length, ids });
}

async function saveToSupabase(prospects) {
  if (!prospects.length) return [];
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/prospects`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=ignore-duplicates",
    },
    body: JSON.stringify(prospects),
  });
  if (!res.ok) {
    console.error("Supabase save error:", await res.text());
    return [];
  }
  return res.json();
}

function extractCity(address = "") {
  const parts = (address || "").split(",");
  return parts[parts.length - 2]?.trim() || null;
}
