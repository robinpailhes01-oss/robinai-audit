const SUPABASE_URL = ‘https://utyfpmjhtfoxsxncfoxe.supabase.co’;
const SUPABASE_KEY = ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eWZwbWpodGZveHN4bmNmb3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzgzMTUsImV4cCI6MjA4OTYxNDMxNX0.OGLR8d0GOZVMM48WlhUYrGsnthaaNNxBGPUHpJoSong’;

const PIXEL = Buffer.from(‘R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7’, ‘base64’);

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
event_type: ‘email_opened’,
email_number: emailNumber ? parseInt(emailNumber) : null,
user_agent: req.headers[‘user-agent’] || null,
ip_address: req.headers[‘x-forwarded-for’] || null
})
}).catch(() => {});
}

res.setHeader(‘Content-Type’, ‘image/gif’);
res.setHeader(‘Cache-Control’, ‘no-store, no-cache, must-revalidate, max-age=0’);
res.status(200).send(PIXEL);
}
