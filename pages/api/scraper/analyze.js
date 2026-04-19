export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prospectIds } = req.body;
  if (!prospectIds?.length) return res.status(400).json({ error: "Pas d'IDs" });

  const prospectsRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/prospects?id=in.(${prospectIds.join(",")})`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const prospects = await prospectsRes.json();

  let count = 0;
  for (const prospect of prospects) {
    try {
      const emailDraft = await generateOutreachEmail(prospect);
      await updateProspect(prospect.id, { email_draft: emailDraft, analyzed_at: new Date().toISOString() });
      count++;
    } catch (e) {
      console.log(`Analyze error for ${prospect.business_name}:`, e.message);
    }
  }

  return res.status(200).json({ count });
}

async function generateOutreachEmail(prospect) {
  const prompt = `Tu es Robin, consultant en automatisation pour les entreprises nautiques. Tu contactes des prospects pour leur proposer de faire un audit gratuit de leur présence digitale.

Infos sur le prospect :
- Entreprise : ${prospect.business_name}
- Ville : ${prospect.city || prospect.address || "France"}
- Catégorie : ${prospect.categories || "activité nautique"}
- Note Google : ${prospect.rating ? `${prospect.rating}/5 (${prospect.reviews_count} avis)` : "non disponible"}
- Site web : ${prospect.website || "pas de site web détecté"}

Rédige un email d'approche court, chaleureux et sans friction. L'objectif est de les inviter à faire un audit gratuit sur notre site.

Règles :
- Tutoiement
- Max 5 phrases
- Ton humain, pas commercial, comme un message d'un entrepreneur à un autre
- Mentionne un détail spécifique (ville, avis Google, ou absence de site)
- Termine par un lien vers l'audit : https://robinai-audit.vercel.app
- Pas de signature corporative, juste "Robin"
- Objet de l'email : accrocheur et personnalisé, max 8 mots

Réponds UNIQUEMENT avec ce JSON :
{
  "subject": "...",
  "body": "..."
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const result = await response.json();
  const text = result.content[0].text;
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const json = JSON.parse(cleaned.substring(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
  return JSON.stringify(json);
}

async function updateProspect(id, updates) {
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/prospects?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
}
