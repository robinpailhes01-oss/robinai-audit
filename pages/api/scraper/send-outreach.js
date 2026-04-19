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

  let sent = 0;
  for (const prospect of prospects) {
    if (!prospect.email_draft || !prospect.email) continue;

    try {
      let draft;
      try { draft = JSON.parse(prospect.email_draft); } catch { continue; }

      await sendEmail(prospect.email, draft.subject, draft.body, prospect.business_name);
      await updateProspect(prospect.id, { status: "contacted", emailed_at: new Date().toISOString() });
      sent++;
    } catch (e) {
      console.log(`Send error for ${prospect.business_name}:`, e.message);
    }
  }

  return res.status(200).json({ sent });
}

async function sendEmail(to, subject, body, businessName) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family:Georgia,serif;max-width:580px;margin:0 auto;padding:40px 20px;color:#1a1a1a;line-height:1.7;">
  <p>${body.replace(/\n/g, "<br>")}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
  <p style="font-size:12px;color:#9ca3af;">Robin Pailhès — RobinAI Consulting<br>Tu reçois cet email car ton entreprise apparaît sur Google Maps.</p>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend: ${err}`);
  }
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
