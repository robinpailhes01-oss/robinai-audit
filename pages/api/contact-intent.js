export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business_name, contact, answer } = req.body || {};

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const message = answer === "oui"
        ? `📩 *DEMANDE DE RECONTACT*\n\n🏢 ${business_name}\n📲 ${contact}\n\n→ À contacter sous 24h`
        : `👋 *Audit complété sans demande de contact*\n\n🏢 ${business_name}`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    } catch (e) {}
  }

  return res.status(200).json({ ok: true });
}
