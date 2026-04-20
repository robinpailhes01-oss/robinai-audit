export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { region = "Côte d'Azur", maxResults = 20 } = req.body;

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${process.env.APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [
          `location bateau ${region}`,
          `activités nautiques ${region}`,
          `jet ski ${region}`,
        ],
        maxCrawledPlaces: maxResults,
        language: "fr",
        countryCode: "fr",
        includeReviews: false,
      }),
    }
  );

  if (!runRes.ok) {
    const err = await runRes.text();
    return res.status(500).json({ error: `Apify start failed: ${err}` });
  }

  const run = await runRes.json();
  const runId = run.data?.id;
  if (!runId) return res.status(500).json({ error: `Pas d'ID de run — réponse: ${JSON.stringify(run)}` });

  return res.status(200).json({ runId, region, maxResults });
}
