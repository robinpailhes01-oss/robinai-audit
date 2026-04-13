const SUPABASE_URL = ‘https://utyfpmjhtfoxsxncfoxe.supabase.co’;
const SUPABASE_KEY = ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eWZwbWpodGZveHN4bmNmb3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzgzMTUsImV4cCI6MjA4OTYxNDMxNX0.OGLR8d0GOZVMM48WlhUYrGsnthaaNNxBGPUHpJoSong’;
const AUDIT_URL = ‘https://robinai-audit.vercel.app’;

export default async function handler(req, res) {
const { p: prospectId, e: emailNumber } = req.query;

if (prospectId) {
fetch(`${SUPABASE_URL}/rest/v1/email_events`, {
method: ‘POST’,
headers: {
‘apikey’: SUPABASE_KEY,
‘Authorization’: `Bearer ${SUPABASE_KEY}`,
‘Content-Type’: ‘application/json’,
‘Prefer’: ‘return=minimal’
},
body: JSON.stringify({
prospect_id: prospectId,
event_type: ‘email_clicked’,
email_number: emailNumber ? parseInt(emailNumber) : null,
user_agent: req.headers[‘user-agent’] || null,
ip_address: req.headers[‘x-forwarded-for’] || null
})
}).catch(() => {});
}

const redirectUrl = prospectId
? `${AUDIT_URL}/?ref=${encodeURIComponent(prospectId)}&utm_source=email&utm_campaign=email_${emailNumber || '1'}`
: AUDIT_URL;

res.setHeader(‘Cache-Control’, ‘no-store’);
res.redirect(302, redirectUrl);
}
