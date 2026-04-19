const NAUTICAL_QUERIES = [
  "location bateau",
  "location yacht",
  "jet ski location",
  "activités nautiques",
  "plongée sous-marine",
  "école de voile",
  "croisière bateau",
  "séminaire bateau",
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { region = "France", maxResults = 20 } = req.body;

  try {
    const query = `${NAUTICAL_QUERIES[Math.floor(Math.random() * NAUTICAL_QUERIES.length)]} ${region}`;

    const runRes = await fetch("https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=" + process.env.APIFY_API_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [
          `location bateau ${region}`,
          `activités nautiques ${region}`,
          `jet ski location ${region}`,
        ],
        maxCrawledPlacesPerSearch: Math.ceil(maxResults / 3),
        language: "fr",
        countryCode: "fr",
        includeReviews: false,
        additionalInfo: true,
      }),
    });

    if (!runRes.ok) {
      const err = await runRes.text();
      throw new Error(`Apify run failed: ${err}`);
    }

    const run = await runRes.json();
    const runId = run.data?.id;
    if (!runId) throw new Error("Apify: pas d'ID de run");

    await waitForRun(runId);

    const itemsRes = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}/dataset/items?token=${process.env.APIFY_API_TOKEN}&limit=${maxResults}`
    );
    const items = await itemsRes.json();

    const prospects = items
      .filter(p => p.title && p.address)
      .map(p => ({
        business_name: p.title,
        address: p.address,
        city: p.city || extractCity(p.address),
        phone: p.phone || null,
        website: p.website || null,
        rating: p.totalScore || null,
        reviews_count: p.reviewsCount || null,
        google_maps_url: p.url || null,
        categories: p.categoryName || null,
        status: "new",
        source: "apify_google_maps",
        region,
      }));

    const saved = await saveProspectsToSupabase(prospects);
    const ids = saved.map(p => p.id);

    return res.status(200).json({ count: saved.length, ids });
  } catch (e) {
    console.error("Scraper error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

async function waitForRun(runId, maxWait = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    await sleep(5000);
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/runs/${runId}?token=${process.env.APIFY_API_TOKEN}`
    );
    const status = await statusRes.json();
    if (status.data?.status === "SUCCEEDED") return;
    if (status.data?.status === "FAILED") throw new Error("Apify run failed");
  }
  throw new Error("Apify timeout");
}

async function saveProspectsToSupabase(prospects) {
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
    const err = await res.text();
    throw new Error(`Supabase save error: ${err}`);
  }

  return res.json();
}

function extractCity(address = "") {
  const parts = address.split(",");
  return parts[parts.length - 2]?.trim() || null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
