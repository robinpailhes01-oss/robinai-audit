export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { runId, maxResults = 20, region = "" } = req.query;
  if (!runId) return res.status(400).json({ error: "runId requis" });

  const statusRes = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}?token=${process.env.APIFY_API_TOKEN}`
  );
  const statusData = await statusRes.json();
  const status = statusData.data?.status;

  if (status === "RUNNING" || status === "READY" || status === "ABORTING") {
    return res.status(200).json({ status: "running" });
  }

  if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
    return res.status(200).json({ status: "failed", error: `Apify run ${status}` });
  }

  if (status !== "SUCCEEDED") {
    return res.status(200).json({ status: "running" });
  }

  // Run succeeded — fetch results
  const itemsRes = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}/dataset/items?token=${process.env.APIFY_API_TOKEN}&limit=${maxResults}`
  );
  const items = await itemsRes.json();

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(200).json({ status: "done", count: 0, ids: [] });
  }

  const prospects = items
    .filter(p => p.title && (p.address || p.city))
    .map(p => ({
      business_name: p.title,
      address: p.address || null,
      city: p.city || extractCity(p.address) || region,
      phone: p.phone || null,
      website: p.website || null,
      email: p.email || null,
      rating: p.totalScore || null,
      reviews_count: p.reviewsCount || null,
      google_maps_url: p.url || null,
      categories: p.categoryName || null,
      status: "new",
      source: "apify_google_maps",
      region,
    }));

  const saved = await saveToSupabase(prospects);
  const ids = saved.map(p => p.id).filter(Boolean);

  // Trigger analysis in background (non-blocking)
  if (ids.length > 0) {
    fetch(`${getBaseUrl(req)}/api/scraper/analyze`, {
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
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function extractCity(address = "") {
  const parts = (address || "").split(",");
  return parts[parts.length - 2]?.trim() || null;
}

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}
