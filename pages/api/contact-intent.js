const SECTOR_LABELS = {
  nautique_location: "Location de bateaux / yachts",
  nautique_activites: "Activités nautiques (jet ski, plongée, voile)",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business_name, first_name, email, business_sector, maturity_score, contact, answer } = req.body || {};

  if (answer === "oui" && contact && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      await sendContactNotification({ business_name, first_name, email, business_sector, maturity_score, contact });
    } catch (e) {
      console.log("⚠️ Erreur email contact-intent:", e.message);
    }
  }

  return res.status(200).json({ ok: true });
}

async function sendContactNotification({ business_name, first_name, email, business_sector, maturity_score, contact }) {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL || "robin.pailhes01@gmail.com";
  const sectorLabel = SECTOR_LABELS[business_sector] || business_sector || "Non précisé";
  const scoreColor = !maturity_score ? "#999" : maturity_score < 30 ? "#ef4444" : maturity_score < 60 ? "#f59e0b" : "#10b981";

  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Demande de recontact</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 20px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
  <tr><td style="background:#050f1c;padding:22px 32px;">
    <h2 style="color:#c9a259;margin:0;font-size:17px;">📩 Demande de recontact — RobinAI</h2>
  </td></tr>
  <tr><td style="padding:32px;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Nom</span><br>
          <span style="font-size:16px;font-weight:bold;color:#111;">${first_name || "Non renseigné"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Entreprise</span><br>
          <span style="font-size:15px;color:#333;">${business_name || "—"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Email</span><br>
          <span style="font-size:15px;color:#2563eb;">${email && email !== "no-email@audit.local" ? email : "Non renseigné"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Contact fourni</span><br>
          <span style="font-size:15px;font-weight:bold;color:#111;">${contact}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Activité nautique</span><br>
          <span style="font-size:15px;color:#333;">${sectorLabel}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Score d'audit</span><br>
          ${maturity_score != null
            ? `<span style="font-size:22px;font-weight:bold;color:${scoreColor};">${maturity_score}<span style="font-size:13px;color:#999;">/100</span></span>`
            : `<span style="font-size:15px;color:#999;">Non disponible</span>`
          }
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Date et heure</span><br>
          <span style="font-size:14px;color:#555;">${dateStr} à ${timeStr}</span>
        </td>
      </tr>
    </table>

    <div style="background:#fffbeb;border-left:4px solid #c9a259;padding:16px 20px;border-radius:0 6px 6px 0;">
      <p style="margin:0;font-size:14px;color:#555;font-style:italic;">→ À contacter sous 24h</p>
    </div>

  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [ownerEmail],
      subject: `📩 Recontact demandé — ${business_name || "Prospect"} (score ${maturity_score ?? "??"}/100)`,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend: ${err}`);
  }

  return response.json();
}
