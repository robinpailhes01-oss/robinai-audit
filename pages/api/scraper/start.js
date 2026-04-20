export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { region = "Côte d'Azur", maxResults = 20 } = req.body;

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${process.env.APIFY_API_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: [
          `location bateau ${region}`,
          `activités nautiques ${region}`,
          `jet ski location ${region}`,
        ],
        maxCrawledPlaces: Math.ceil(maxResults / 3),
        language: "fr",
        country: "FR",
        maxImages: 0,
        maxReviews: 0,
      }),
    }
  );

  const runBody = await runRes.text();

  if (!runRes.ok) {
    return res.status(500).json({ error: `Apify start failed (${runRes.status}): ${runBody}` });
  }

  let run;
  try { run = JSON.parse(runBody); } catch {
    return res.status(500).json({ error: `Apify réponse invalide: ${runBody}` });
  }

  const runId = run.data?.id;
  if (!runId) return res.status(500).json({ error: `Pas d'ID de run — réponse: ${runBody}` });

  return res.status(200).json({ runId, region, maxResults });
}
