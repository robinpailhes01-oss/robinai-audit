import { useState, useEffect } from ‘react’;

const API_ENDPOINT = ‘/api/submit-audit’;

const SUPABASE_URL = ‘https://utyfpmjhtfoxsxncfoxe.supabase.co’;
const SUPABASE_KEY = ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eWZwbWpodGZveHN4bmNmb3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzgzMTUsImV4cCI6MjA4OTYxNDMxNX0.OGLR8d0GOZVMM48WlhUYrGsnthaaNNxBGPUHpJoSong’;

const SECTORS = [
{ value: ‘nautique_location’, label: ‘Location de bateaux / yachts’, icon: ‘⛵’ },
{ value: ‘nautique_activites’, label: ‘Activités nautiques (jet ski, plongée, voile…)’, icon: ‘🏄’ },
];

const TEAM_SIZES = [
{ value: ‘solo’, label: ‘Solo’ },
{ value: ‘2_3’, label: ‘2 à 3 personnes’ },
{ value: ‘4_10’, label: ‘4 à 10 personnes’ },
{ value: ‘10_plus’, label: ‘Plus de 10’ },
];

const CHANNELS = [
{ value: ‘instagram_dm’, label: ‘Instagram DM’ },
{ value: ‘whatsapp’, label: ‘WhatsApp’ },
{ value: ‘phone’, label: ‘Appels téléphoniques’ },
{ value: ‘email’, label: ‘Email’ },
{ value: ‘website’, label: ‘Formulaire site web’ },
{ value: ‘facebook’, label: ‘Facebook Messenger’ },
];

const WEEKLY_DEMANDS = [
{ value: ‘less_20’, label: ‘Moins de 20’ },
{ value: ‘20_50’, label: ‘20 à 50’ },
{ value: ‘50_100’, label: ‘50 à 100’ },
{ value: ‘100_200’, label: ‘100 à 200’ },
{ value: ‘more_200’, label: ‘Plus de 200’ },
];

const RESPONSE_TIMES = [
{ value: ‘less_10min’, label: ‘Moins de 10 minutes’, emoji: ‘⚡’ },
{ value: ‘10_60min’, label: ‘10 min à 1h’, emoji: ‘🟢’ },
{ value: ‘1_6h’, label: ‘1 à 6 heures’, emoji: ‘🟡’ },
{ value: ‘6_24h’, label: ‘6 à 24 heures’, emoji: ‘🟠’ },
{ value: ‘more_24h’, label: `Plus d'une journée`, emoji: ‘🔴’ },
];

const CURRENT_MGMT = [
{ value: ‘head’, label: ‘Tout dans ma tête’ },
{ value: ‘paper’, label: ‘Notes papier / carnet’ },
{ value: ‘excel’, label: ‘Excel ou Google Sheets’ },
{ value: ‘basic_crm’, label: ‘CRM basique’ },
{ value: ‘advanced_crm’, label: ‘CRM avancé’ },
];

const AVG_BASKETS = [
{ value: ‘less_50’, label: ‘Moins de 50 €’ },
{ value: ‘50_150’, label: ‘50 à 150 €’ },
{ value: ‘150_400’, label: ‘150 à 400 €’ },
{ value: ‘400_1000’, label: ‘400 à 1 000 €’ },
{ value: ‘1000_3000’, label: ‘1 000 à 3 000 €’ },
{ value: ‘more_3000’, label: ‘Plus de 3 000 €’ },
];

const MONTHLY_REVENUES = [
{ value: ‘less_5k’, label: ‘Moins de 5 000 €’ },
{ value: ‘5k_15k’, label: ‘5 000 à 15 000 €’ },
{ value: ‘15k_40k’, label: ‘15 000 à 40 000 €’ },
{ value: ‘40k_100k’, label: ‘40 000 à 100 000 €’ },
{ value: ‘more_100k’, label: ‘Plus de 100 000 €’ },
];

const MAIN_PAINS = [
{ value: ‘responding_dm’, label: ‘Répondre aux messages / DM en continu’ },
{ value: ‘managing_bookings’, label: ‘Gérer les réservations et plannings’ },
{ value: ‘follow_ups’, label: ‘Relancer les clients hésitants’ },
{ value: ‘tracking’, label: `Suivre les leads et l'historique clients` },
{ value: ‘all_at_once’, label: ‘Tout en même temps, je suis débordé’ },
{ value: ‘autre’, label: ‘Autre — précisez’, isOther: true },
];

const MAIN_GOALS = [
{ value: ‘free_time’, label: ‘Gagner du temps libre’ },
{ value: ‘more_leads’, label: ‘Générer plus de leads’ },
{ value: ‘better_conversion’, label: ‘Améliorer ma conversion’ },
{ value: ‘less_stress’, label: ‘Moins de stress au quotidien’ },
{ value: ‘scale’, label: ‘Faire grandir mon business’ },
{ value: ‘automate’, label: ‘Automatiser mes process’ },
];

function BackgroundLayers() {
return (
<div style={{ position: ‘fixed’, inset: 0, zIndex: 0, overflow: ‘hidden’, pointerEvents: ‘none’ }}>
<div style={{ position: ‘absolute’, inset: 0, background: ‘radial-gradient(ellipse at top, #0a1929 0%, #050f1c 40%, #020810 100%)’ }} />
<div style={{ position: ‘absolute’, inset: 0, backgroundImage: ‘radial-gradient(circle at 20% 30%, rgba(201, 162, 89, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(201, 162, 89, 0.05) 0%, transparent 50%)’ }} />
<svg style={{ position: ‘absolute’, bottom: 0, left: 0, width: ‘100%’, height: ‘40%’, opacity: 0.15 }} viewBox=‘0 0 1440 320’ preserveAspectRatio=‘none’>
<path fill='#c9a259' d='M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L0,320Z' />
</svg>
<svg style={{ position: ‘absolute’, bottom: 0, left: 0, width: ‘100%’, height: ‘30%’, opacity: 0.08 }} viewBox=‘0 0 1440 320’ preserveAspectRatio=‘none’>
<path fill='#c9a259' d='M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,256C840,256,960,224,1080,218.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L0,320Z' />
</svg>
</div>
);
}

function Logo() {
return (
<div style={{ display: ‘flex’, alignItems: ‘center’, gap: 14 }}>
<svg width='38' height='38' viewBox='0 0 40 40' fill='none'>
<circle cx='20' cy='20' r='19' stroke='#c9a259' strokeWidth='0.8' />
<circle cx='20' cy='20' r='14' stroke='#c9a259' strokeWidth='0.6' opacity='0.6' />
<path d='M20 6 L20 34 M6 20 L34 20' stroke='#c9a259' strokeWidth='0.6' opacity='0.4' />
<path d='M20 10 L24 20 L20 18 L16 20 Z' fill='#c9a259' />
<circle cx='20' cy='20' r='1.5' fill='#c9a259' />
</svg>
<div style={{ display: ‘flex’, flexDirection: ‘column’, lineHeight: 1 }}>
<span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 20, color: ‘#f5e9d0’, fontWeight: 500, letterSpacing: ‘0.08em’ }}>ROBINAI</span>
<span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, color: ‘#c9a259’, letterSpacing: ‘0.3em’, marginTop: 2 }}>CONSULTING</span>
</div>
</div>
);
}

function ProgressCompass({ step, total }) {
const progress = (step / total) * 100;
return (
<div style={{ marginBottom: 40 }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’, marginBottom: 14 }}>
<span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 13, color: ‘#c9a259’, letterSpacing: ‘0.25em’, textTransform: ‘uppercase’ }}>Cap sur votre analyse</span>
<span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 13, color: ‘rgba(245, 233, 208, 0.6)’, letterSpacing: ‘0.1em’ }}>
{String(step).padStart(2, ‘0’)} / {String(total).padStart(2, ‘0’)}
</span>
</div>
<div style={{ height: 1.5, background: ‘rgba(201, 162, 89, 0.15)’, position: ‘relative’, overflow: ‘hidden’ }}>
<div style={{ height: ‘100%’, width: `${progress}%`, background: ‘linear-gradient(90deg, #c9a259 0%, #e9d4a3 100%)’, transition: ‘width 0.8s cubic-bezier(0.4, 0, 0.2, 1)’, boxShadow: ‘0 0 20px rgba(201, 162, 89, 0.5)’ }} />
</div>
</div>
);
}

function OptionCard({ option, selected, onClick, multi }) {
return (
<button onClick={onClick} style={{
width: ‘100%’, textAlign: ‘left’, padding: ‘20px 24px’,
background: selected ? ‘rgba(201, 162, 89, 0.12)’ : ‘rgba(255, 255, 255, 0.025)’,
border: selected ? ‘1px solid rgba(201, 162, 89, 0.6)’ : ‘1px solid rgba(201, 162, 89, 0.15)’,
borderRadius: 2, cursor: ‘pointer’, color: ‘#f5e9d0’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 17, fontWeight: 400, letterSpacing: ‘0.02em’,
transition: ‘all 0.3s cubic-bezier(0.4, 0, 0.2, 1)’,
display: ‘flex’, alignItems: ‘center’, gap: 16,
}}>
{multi && (
<div style={{
width: 20, height: 20, borderRadius: 2,
border: selected ? ‘2px solid #c9a259’ : ‘1px solid rgba(201, 162, 89, 0.4)’,
background: selected ? ‘#c9a259’ : ‘transparent’,
display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, flexShrink: 0,
}}>
{selected && (
<svg width='12' height='12' viewBox='0 0 20 20' fill='none'>
<path d='M4 10 L8 14 L16 6' stroke='#050f1c' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
</svg>
)}
</div>
)}
{option.icon && <span style={{ fontSize: 22 }}>{option.icon}</span>}
{option.emoji && <span style={{ fontSize: 20 }}>{option.emoji}</span>}
<span style={{ flex: 1 }}>{option.label}</span>
{!multi && selected && (
<svg width='18' height='18' viewBox='0 0 20 20' fill='none'>
<path d='M4 10 L8 14 L16 6' stroke='#c9a259' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
</svg>
)}
</button>
);
}

function NextButton({ onClick, disabled, label = ‘Continuer’ }) {
return (
<button onClick={onClick} disabled={disabled} style={{
width: ‘100%’, marginTop: 24,
background: !disabled ? ‘linear-gradient(135deg, #c9a259 0%, #a8863e 100%)’ : ‘rgba(201, 162, 89, 0.15)’,
color: !disabled ? ‘#050f1c’ : ‘rgba(245, 233, 208, 0.4)’,
border: ‘none’, padding: ‘20px’, borderRadius: 2,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 15, fontWeight: 600,
letterSpacing: ‘0.25em’, textTransform: ‘uppercase’,
cursor: !disabled ? ‘pointer’ : ‘not-allowed’,
transition: ‘all 0.4s’,
boxShadow: !disabled ? ‘0 10px 40px rgba(201, 162, 89, 0.3)’ : ‘none’,
}}>
{label} →
</button>
);
}

function Hero({ onStart }) {
return (
<div style={{ minHeight: ‘100vh’, display: ‘flex’, flexDirection: ‘column’, position: ‘relative’, zIndex: 1, padding: ‘40px 24px’ }}>
<div style={{ maxWidth: 1100, margin: ‘0 auto’, width: ‘100%’, flex: 1, display: ‘flex’, flexDirection: ‘column’, justifyContent: ‘space-between’ }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’, paddingBottom: 40 }}>
<Logo />
<div style={{ display: ‘flex’, alignItems: ‘center’, gap: 14 }}>
<div style={{ width: 40, height: 1, background: ‘rgba(201, 162, 89, 0.4)’ }} />
<span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, color: ‘#c9a259’, letterSpacing: ‘0.3em’, textTransform: ‘uppercase’ }}>Audit Premium</span>
</div>
</div>

```
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 820 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 30, height: 1, background: '#c9a259' }} />
        <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 13, color: '#c9a259', letterSpacing: '0.35em', textTransform: 'uppercase' }}>Diagnostic Stratégique Gratuit</span>
      </div>

      <h1 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(42px, 7vw, 82px)', fontWeight: 400, lineHeight: 1.05, color: '#f5e9d0', margin: 0, marginBottom: 32, letterSpacing: '-0.02em' }}>
        Combien votre <em style={{ color: '#c9a259', fontStyle: 'italic' }}>business nautique</em> perd-il de clients chaque mois&nbsp;?
      </h1>

      <p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.6, color: 'rgba(245, 233, 208, 0.75)', marginBottom: 48, maxWidth: 700, fontWeight: 300 }}>
        En <span style={{ color: '#c9a259', fontWeight: 400 }}>5 minutes</span>, obtenez une analyse personnalisée de votre maturité digitale,
        une estimation précise de vos leads perdus, et <em>trois leviers concrets</em> pour les récupérer.
        Zéro engagement, aucune carte bancaire.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <button onClick={onStart} style={{
          background: 'linear-gradient(135deg, #c9a259 0%, #a8863e 100%)',
          color: '#050f1c', border: 'none', padding: '20px 48px', borderRadius: 2,
          fontFamily: `'Cormorant Garamond', serif`, fontSize: 16, fontWeight: 600,
          letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 10px 40px rgba(201, 162, 89, 0.3)',
        }}>
          Démarrer l&apos;audit →
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 14, color: 'rgba(245, 233, 208, 0.5)', letterSpacing: '0.05em' }}>~ 5 minutes</span>
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 14, color: 'rgba(245, 233, 208, 0.5)', letterSpacing: '0.05em' }}>Résultat instantané</span>
        </div>
      </div>
    </div>

    <div style={{ paddingTop: 60, display: 'flex', gap: 60, flexWrap: 'wrap', borderTop: '1px solid rgba(201, 162, 89, 0.12)', marginTop: 60 }}>
      {[
        { label: 'Analyse IA', value: 'Par Claude' },
        { label: 'Secteurs couverts', value: 'Nautique' },
        { label: 'Durée', value: '5 minutes' },
        { label: 'Tarif', value: 'Offert' },
      ].map((stat, i) => (
        <div key={i}>
          <div style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, color: '#c9a259', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
          <div style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 22, color: '#f5e9d0', fontWeight: 400 }}>{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
</div>
```

);
}

function StepHeader({ title, subtitle }) {
return (
<>
<h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: ‘clamp(30px, 4.5vw, 46px)’, fontWeight: 400, color: ‘#f5e9d0’, margin: 0, marginBottom: 14, letterSpacing: ‘-0.01em’, lineHeight: 1.15 }}>{title}</h2>
<p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 18, color: ‘rgba(245, 233, 208, 0.55)’, margin: 0, marginBottom: 40, fontStyle: ‘italic’, fontWeight: 300 }}>{subtitle}</p>
</>
);
}

function SingleSelectStep({ title, subtitle, options, value, onChange, onNext, autoAdvance }) {
return (
<div>
<StepHeader title={title} subtitle={subtitle} />
<div style={{ display: ‘flex’, flexDirection: ‘column’, gap: 12 }}>
{options.map(opt => (
<OptionCard
key={opt.value}
option={opt}
selected={value === opt.value}
onClick={() => {
onChange(opt.value);
if (autoAdvance) setTimeout(onNext, 300);
}}
/>
))}
</div>
{!autoAdvance && <NextButton onClick={onNext} disabled={!value} />}
</div>
);
}

function MultiSelectStep({ title, subtitle, options, values, otherValue, onToggle, onOtherChange, onNext, canProceed, otherPlaceholder, submitLabel, loading }) {
const isOtherSelected = values.includes(‘autre’);
const btnLabel = submitLabel || ‘Continuer’;
const isDisabled = !canProceed || (isOtherSelected && !otherValue) || loading;

return (
<div>
<StepHeader title={title} subtitle={subtitle} />
<div style={{ display: ‘flex’, flexDirection: ‘column’, gap: 12 }}>
{options.map(opt => (
<OptionCard
key={opt.value}
option={opt}
selected={values.includes(opt.value)}
onClick={() => onToggle(opt.value)}
multi
/>
))}
</div>
{isOtherSelected && onOtherChange && (
<div style={{ marginTop: 20 }}>
<input
type=‘text’
value={otherValue || ‘’}
onChange={e => onOtherChange(e.target.value)}
placeholder={otherPlaceholder}
autoFocus
style={{
width: ‘100%’, padding: ‘16px 20px’,
background: ‘rgba(255, 255, 255, 0.04)’,
border: ‘1px solid rgba(201, 162, 89, 0.4)’,
borderRadius: 2, color: ‘#f5e9d0’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 17,
outline: ‘none’, boxSizing: ‘border-box’,
}}
/>
</div>
)}
<button
onClick={onNext}
disabled={isDisabled}
style={{
width: ‘100%’, marginTop: 24,
background: !isDisabled ? ‘linear-gradient(135deg, #c9a259 0%, #a8863e 100%)’ : ‘rgba(201, 162, 89, 0.15)’,
color: !isDisabled ? ‘#050f1c’ : ‘rgba(245, 233, 208, 0.4)’,
border: ‘none’, padding: ‘20px’, borderRadius: 2,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 15, fontWeight: 600,
letterSpacing: ‘0.25em’, textTransform: ‘uppercase’,
cursor: !isDisabled ? ‘pointer’ : ‘not-allowed’,
transition: ‘all 0.4s’,
boxShadow: !isDisabled ? ‘0 10px 40px rgba(201, 162, 89, 0.3)’ : ‘none’,
}}>
{loading ? ‘Analyse en cours…’ : `${btnLabel} →`}
</button>
</div>
);
}

function TextStep({ title, subtitle, value, onChange, placeholder, onNext, canProceed }) {
return (
<div>
<StepHeader title={title} subtitle={subtitle} />
<input
type=‘text’
value={value}
onChange={e => onChange(e.target.value)}
placeholder={placeholder}
autoFocus
onKeyDown={e => { if (e.key === ‘Enter’ && canProceed) onNext(); }}
style={{
width: ‘100%’, padding: ‘20px 24px’,
background: ‘rgba(255, 255, 255, 0.03)’,
border: ‘1px solid rgba(201, 162, 89, 0.3)’,
borderRadius: 2, color: ‘#f5e9d0’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 22,
outline: ‘none’, boxSizing: ‘border-box’,
}}
/>
<NextButton onClick={onNext} disabled={!canProceed} />
</div>
);
}

function AuditForm({ onSubmit, onBack }) {
const [step, setStep] = useState(1);
const [data, setData] = useState({
business_sector: ‘’,
business_name: ‘’,
team_size: ‘’,
main_channel: [],
weekly_demands: ‘’,
response_time: ‘’,
current_management: ‘’,
avg_basket: ‘’,
monthly_revenue: ‘’,
main_pain: [],
main_pain_other: ‘’,
main_goal: [],
});
const [loading, setLoading] = useState(false);

const totalSteps = 11;

function updateField(key, value) {
setData(d => ({ …d, [key]: value }));
}

function toggleMulti(key, value) {
setData(d => {
const current = d[key] || [];
if (current.includes(value)) return { …d, [key]: current.filter(v => v !== value) };
return { …d, [key]: […current, value] };
});
}

function nextStep() {
if (step < totalSteps) setStep(s => s + 1);
if (typeof window !== ‘undefined’) window.scrollTo({ top: 0, behavior: ‘smooth’ });
}

function prevStep() {
if (step > 1) setStep(s => s - 1);
else onBack();
if (typeof window !== ‘undefined’) window.scrollTo({ top: 0, behavior: ‘smooth’ });
}

async function submitForm() {
setLoading(true);
try {
const res = await fetch(API_ENDPOINT, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify(data),
});
if (res.ok) {
const result = await res.json();
onSubmit(data, result.analysis);
} else {
alert(‘Une erreur est survenue. Merci de réessayer.’);
setLoading(false);
}
} catch (e) {
alert(‘Erreur de connexion. Merci de réessayer.’);
setLoading(false);
}
}

function renderStep() {
switch (step) {
case 1:
return (
<SingleSelectStep
title=‘Quelle est votre activité ?’
subtitle=‘Afin de personnaliser précisément votre analyse.’
options={SECTORS}
value={data.business_sector}
onChange={v => updateField(‘business_sector’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 2:
return (
<TextStep
title=`Comment s'appelle votre entreprise ?`
subtitle=`Pour personnaliser votre rapport d'audit.`
value={data.business_name}
onChange={v => updateField(‘business_name’, v)}
placeholder=‘Yacht Évasion Carnon’
onNext={nextStep}
canProceed={!!data.business_name.trim()}
/>
);
case 3:
return (
<SingleSelectStep
title=`Combien êtes-vous dans l'équipe ?`
subtitle=‘Pour comprendre votre capacité opérationnelle.’
options={TEAM_SIZES}
value={data.team_size}
onChange={v => updateField(‘team_size’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 4:
return (
<MultiSelectStep
title=‘Par quels canaux arrivent vos demandes ?’
subtitle=‘Plusieurs choix possibles.’
options={CHANNELS}
values={data.main_channel}
onToggle={v => toggleMulti(‘main_channel’, v)}
onNext={nextStep}
canProceed={data.main_channel.length > 0}
/>
);
case 5:
return (
<SingleSelectStep
title=‘Combien de demandes par semaine en haute saison ?’
subtitle=‘Même une estimation approximative convient.’
options={WEEKLY_DEMANDS}
value={data.weekly_demands}
onChange={v => updateField(‘weekly_demands’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 6:
return (
<SingleSelectStep
title=‘Quel est votre temps de réponse moyen ?’
subtitle=`C'est souvent ici que se joue la conversion.`
options={RESPONSE_TIMES}
value={data.response_time}
onChange={v => updateField(‘response_time’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 7:
return (
<SingleSelectStep
title=`Comment gérez-vous vos clients aujourd'hui ?`
subtitle=‘Votre système actuel de gestion.’
options={CURRENT_MGMT}
value={data.current_management}
onChange={v => updateField(‘current_management’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 8:
return (
<SingleSelectStep
title=‘Quel est votre panier moyen par client ?’
subtitle=‘Une estimation par prestation suffit.’
options={AVG_BASKETS}
value={data.avg_basket}
onChange={v => updateField(‘avg_basket’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 9:
return (
<SingleSelectStep
title=‘Votre CA mensuel en haute saison ?’
subtitle=‘Information confidentielle, utilisée uniquement pour le calcul.’
options={MONTHLY_REVENUES}
value={data.monthly_revenue}
onChange={v => updateField(‘monthly_revenue’, v)}
onNext={nextStep}
autoAdvance
/>
);
case 10:
return (
<MultiSelectStep
title=`Qu'est-ce qui vous pèse le plus ?`
subtitle=‘Plusieurs choix possibles.’
options={MAIN_PAINS}
values={data.main_pain}
otherValue={data.main_pain_other}
onToggle={v => toggleMulti(‘main_pain’, v)}
onOtherChange={v => updateField(‘main_pain_other’, v)}
onNext={nextStep}
canProceed={data.main_pain.length > 0}
otherPlaceholder=‘Décrivez ce qui vous pèse…’
/>
);
case 11:
return (
<MultiSelectStep
title=‘Vos objectifs principaux cette année ?’
subtitle=`Sélectionnez vos priorités — l'analyse sera générée instantanément.`
options={MAIN_GOALS}
values={data.main_goal}
onToggle={v => toggleMulti(‘main_goal’, v)}
onNext={submitForm}
canProceed={data.main_goal.length > 0}
submitLabel=‘Voir mon analyse’
loading={loading}
/>
);
default:
return null;
}
}

return (
<div style={{ minHeight: ‘100vh’, padding: ‘40px 24px’, position: ‘relative’, zIndex: 1 }}>
<div style={{ maxWidth: 720, margin: ‘0 auto’ }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’, marginBottom: 60 }}>
<Logo />
<button onClick={prevStep} style={{
background: ‘transparent’, border: ‘1px solid rgba(201, 162, 89, 0.3)’,
color: ‘#c9a259’, padding: ‘10px 20px’, borderRadius: 2, cursor: ‘pointer’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 12,
letterSpacing: ‘0.2em’, textTransform: ‘uppercase’, transition: ‘all 0.3s’,
}}>
← Retour
</button>
</div>

```
    <ProgressCompass step={step} total={totalSteps} />

    {renderStep()}
  </div>
</div>
```

);
}

function LoadingScreen() {
const [phase, setPhase] = useState(0);
const phases = [
‘Analyse de votre profil…’,
‘Calcul de votre score de maturité…’,
‘Estimation des leads perdus…’,
‘Génération des recommandations…’,
];

useEffect(() => {
const interval = setInterval(() => {
setPhase(p => (p + 1) % phases.length);
}, 1500);
return () => clearInterval(interval);
}, []);

return (
<div style={{ minHeight: ‘100vh’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, padding: ‘40px 24px’, position: ‘relative’, zIndex: 1 }}>
<div style={{ textAlign: ‘center’, maxWidth: 500 }}>
<div style={{ marginBottom: 50, position: ‘relative’, display: ‘inline-block’ }}>
<svg width=‘100’ height=‘100’ viewBox=‘0 0 100 100’ style={{ animation: ‘rotate 3s linear infinite’ }}>
<circle cx='50' cy='50' r='46' stroke='rgba(201, 162, 89, 0.15)' strokeWidth='1' fill='none' />
<circle cx='50' cy='50' r='46' stroke='#c9a259' strokeWidth='1.5' fill='none' strokeDasharray='50 250' strokeLinecap='round' />
<circle cx='50' cy='50' r='36' stroke='rgba(201, 162, 89, 0.2)' strokeWidth='0.5' fill='none' />
<circle cx='50' cy='6' r='2' fill='#c9a259' />
</svg>
</div>
<h2 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 36, color: ‘#f5e9d0’, fontWeight: 400, margin: 0, marginBottom: 16, letterSpacing: ‘-0.01em’ }}>
Analyse en cours
</h2>
<p key={phase} style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 18, color: ‘#c9a259’, fontStyle: ‘italic’, animation: ‘fadeIn 0.5s ease-out’ }}>
{phases[phase]}
</p>
</div>
</div>
);
}

function ContactBlock({ businessName }) {
const [answer, setAnswer] = useState(null);
const [contact, setContact] = useState(’’);
const [sent, setSent] = useState(false);

async function handleSend() {
if (!contact.trim()) return;
try {
await fetch(’/api/contact-intent’, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’ },
body: JSON.stringify({ business_name: businessName, contact, answer }),
});
} catch (e) {}
setSent(true);
}

return (
<div className=‘no-print’ style={{ marginBottom: 40, padding: ‘50px 40px’, background: ‘linear-gradient(135deg, rgba(201, 162, 89, 0.08) 0%, rgba(201, 162, 89, 0.02) 100%)’, border: ‘1px solid rgba(201, 162, 89, 0.3)’, animation: ‘fadeInUp 1s ease-out 1.2s both’ }}>
<h3 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: ‘clamp(24px, 3.5vw, 34px)’, color: ‘#f5e9d0’, margin: 0, marginBottom: 12, fontWeight: 400 }}>
<em>Tu veux être recontacté par Robin ?</em>
</h3>
<p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 17, color: ‘rgba(245, 233, 208, 0.6)’, margin: 0, marginBottom: 32, fontStyle: ‘italic’ }}>
Zéro engagement — juste un échange entre entrepreneurs nautiques.
</p>
{!sent ? (
<>
{answer === null && (
<div style={{ display: ‘flex’, gap: 16, justifyContent: ‘center’, flexWrap: ‘wrap’ }}>
<button onClick={() => setAnswer(‘oui’)} style={{
padding: ‘18px 56px’, border: ‘1px solid rgba(201, 162, 89, 0.6)’,
background: ‘transparent’, color: ‘#c9a259’, cursor: ‘pointer’, borderRadius: 2,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 22, fontWeight: 500,
letterSpacing: ‘0.15em’, transition: ‘all 0.3s’,
}}>OUI</button>
<button onClick={() => setAnswer(‘non’)} style={{
padding: ‘18px 56px’, border: ‘1px solid rgba(245, 233, 208, 0.15)’,
background: ‘transparent’, color: ‘rgba(245, 233, 208, 0.4)’, cursor: ‘pointer’, borderRadius: 2,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 22, fontWeight: 400,
letterSpacing: ‘0.15em’, transition: ‘all 0.3s’,
}}>NON</button>
</div>
)}
{answer === ‘oui’ && (
<div style={{ maxWidth: 480, margin: ‘0 auto’ }}>
<p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 16, color: ‘#c9a259’, letterSpacing: ‘0.15em’, textTransform: ‘uppercase’, marginBottom: 12 }}>
Ton Instagram ou WhatsApp
</p>
<input
type=‘text’
value={contact}
onChange={e => setContact(e.target.value)}
placeholder=’@toncompte ou +33 6 XX XX XX XX’
autoFocus
onKeyDown={e => { if (e.key === ‘Enter’ && contact.trim()) handleSend(); }}
style={{
width: ‘100%’, padding: ‘16px 20px’, boxSizing: ‘border-box’,
background: ‘rgba(255,255,255,0.04)’, border: ‘1px solid rgba(201, 162, 89, 0.4)’,
borderRadius: 2, color: ‘#f5e9d0’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 18,
outline: ‘none’, marginBottom: 16,
}}
/>
<button onClick={handleSend} disabled={!contact.trim()} style={{
width: ‘100%’, padding: ‘18px’,
background: contact.trim() ? ‘linear-gradient(135deg, #c9a259 0%, #a8863e 100%)’ : ‘rgba(201,162,89,0.15)’,
color: contact.trim() ? ‘#050f1c’ : ‘rgba(245,233,208,0.4)’,
border: ‘none’, borderRadius: 2,
cursor: contact.trim() ? ‘pointer’ : ‘not-allowed’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 15, fontWeight: 600,
letterSpacing: ‘0.25em’, textTransform: ‘uppercase’, transition: ‘all 0.3s’,
}}>
Envoyer →
</button>
<button onClick={() => setAnswer(null)} style={{
display: ‘block’, margin: ‘12px auto 0’, background: ‘transparent’, border: ‘none’,
color: ‘rgba(245,233,208,0.35)’, cursor: ‘pointer’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 14, fontStyle: ‘italic’,
}}>← Retour</button>
</div>
)}
{answer === ‘non’ && (
<p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 18, color: ‘rgba(245,233,208,0.6)’, textAlign: ‘center’, fontStyle: ‘italic’, margin: 0 }}>
Pas de souci — ton analyse reste disponible ici. Bonne saison ! ⛵
</p>
)}
</>
) : (
<div style={{ textAlign: ‘center’ }}>
<div style={{ fontSize: 48, marginBottom: 16 }}>⛵</div>
<p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 22, color: ‘#c9a259’, fontStyle: ‘italic’, margin: 0 }}>
Reçu ! Robin te contacte sous 24h.
</p>
</div>
)}
</div>
);
}

function ResultsPage({ data, analysis, onRestart }) {
const [animatedScore, setAnimatedScore] = useState(0);
const [animatedLeads, setAnimatedLeads] = useState(0);
const [animatedRevenue, setAnimatedRevenue] = useState(0);

useEffect(() => {
const scoreTarget = analysis.maturity_score;
const leadsTarget = analysis.estimated_lost_leads_per_month;
const revenueTarget = analysis.estimated_lost_revenue_per_month;
const duration = 2000;
const start = Date.now();

```
const animate = () => {
  const elapsed = Date.now() - start;
  const progress = Math.min(elapsed / duration, 1);
  const easeOut = 1 - Math.pow(1 - progress, 3);
  setAnimatedScore(Math.floor(scoreTarget * easeOut));
  setAnimatedLeads(Math.floor(leadsTarget * easeOut));
  setAnimatedRevenue(Math.floor(revenueTarget * easeOut));
  if (progress < 1) requestAnimationFrame(animate);
  else {
    setAnimatedScore(scoreTarget);
    setAnimatedLeads(leadsTarget);
    setAnimatedRevenue(revenueTarget);
  }
};
setTimeout(() => requestAnimationFrame(animate), 400);
```

}, [analysis]);

const scoreColor = analysis.maturity_score < 30 ? ‘#ef4444’ : analysis.maturity_score < 60 ? ‘#f59e0b’ : ‘#10b981’;
const displayName = data.first_name && data.first_name !== ‘Prospect’ ? data.first_name : null;

function handlePrint() {
if (typeof window !== ‘undefined’) window.print();
}

return (
<>
<style>{`@media print { body { background: white !important; } .no-print { display: none !important; } .print-section { page-break-inside: avoid; } }`}</style>
<div style={{ minHeight: ‘100vh’, padding: ‘40px 24px’, position: ‘relative’, zIndex: 1 }}>
<div style={{ maxWidth: 860, margin: ‘0 auto’ }}>
<div className=‘no-print’ style={{ display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’, marginBottom: 60 }}>
<Logo />
<button onClick={onRestart} style={{
background: ‘transparent’, border: ‘1px solid rgba(201, 162, 89, 0.3)’,
color: ‘#c9a259’, padding: ‘10px 20px’, borderRadius: 2, cursor: ‘pointer’,
fontFamily: `'Cormorant Garamond', serif`, fontSize: 12,
letterSpacing: ‘0.2em’, textTransform: ‘uppercase’,
}}>
Nouveau test
</button>
</div>

```
      <div className='print-section' style={{ marginBottom: 50, animation: 'fadeInUp 0.8s ease-out' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 30, height: 1, background: '#c9a259' }} />
          <span style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 12, color: '#c9a259', letterSpacing: '0.35em', textTransform: 'uppercase' }}>Votre rapport personnalisé</span>
        </div>
        <h1 style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, color: '#f5e9d0', margin: 0, marginBottom: 20, lineHeight: 1.1 }}>
          {displayName ? <>Bonjour <em style={{ color: '#c9a259' }}>{displayName}</em>,</> : <>Voici votre analyse</>}
        </h1>
        <p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 20, color: 'rgba(245, 233, 208, 0.75)', lineHeight: 1.6, fontWeight: 300 }}>
          Analyse complète de <strong style={{ color: '#c9a259' }}>{data.business_name}</strong>, basée sur vos réponses.
        </p>
      </div>

      <div className='print-section' style={{ padding: '60px 40px', background: 'rgba(201, 162, 89, 0.06)', border: '1px solid rgba(201, 162, 89, 0.3)', marginBottom: 30, textAlign: 'center', animation: 'fadeInUp 1s ease-out 0.2s both' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24 }}>Score de Maturité Digitale</div>
        <div style={{ fontSize: 'clamp(100px, 18vw, 180px)', fontWeight: 300, color: scoreColor, lineHeight: 1, fontFamily: `'Cormorant Garamond', serif`, textShadow: `0 0 60px ${scoreColor}40` }}>
          {animatedScore}<span style={{ fontSize: '0.3em', color: 'rgba(245, 233, 208, 0.4)', marginLeft: 8 }}>/100</span>
        </div>
        <div style={{ marginTop: 24, color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 24, fontStyle: 'italic' }}>
          « {analysis.score_label} »
        </div>
      </div>

      <div className='print-section' style={{ marginBottom: 30, padding: '40px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(201, 162, 89, 0.15)', animation: 'fadeInUp 1s ease-out 0.4s both' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18 }}>◆ Diagnostic</div>
        <p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 20, lineHeight: 1.7, color: 'rgba(245, 233, 208, 0.9)', margin: 0 }}>{analysis.diagnostic}</p>
      </div>

      <div className='print-section' style={{ marginBottom: 30, padding: '40px', background: 'rgba(239, 68, 68, 0.06)', borderLeft: '4px solid #c9a259', animation: 'fadeInUp 1s ease-out 0.6s both' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18 }}>Ton manque à gagner estimé</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 30, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 'clamp(48px, 7vw, 72px)', color: '#f5e9d0', fontFamily: `'Cormorant Garamond', serif`, lineHeight: 1, fontWeight: 300 }}>{animatedLeads}</div>
            <div style={{ marginTop: 8, fontSize: 16, color: 'rgba(245, 233, 208, 0.6)', fontFamily: `'Cormorant Garamond', serif`, fontStyle: 'italic' }}>leads perdus / mois</div>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, lineHeight: 1, fontWeight: 400 }}>{animatedRevenue.toLocaleString('fr-FR')} €</div>
            <div style={{ marginTop: 8, fontSize: 16, color: 'rgba(245, 233, 208, 0.6)', fontFamily: `'Cormorant Garamond', serif`, fontStyle: 'italic' }}>de CA manqué / mois</div>
          </div>
        </div>
        <p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 17, lineHeight: 1.6, color: 'rgba(245, 233, 208, 0.75)', margin: 0, fontStyle: 'italic', paddingTop: 20, borderTop: '1px solid rgba(201, 162, 89, 0.15)' }}>{analysis.reality_check}</p>
      </div>

      <div className='print-section' style={{ marginBottom: 30, padding: '40px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(201, 162, 89, 0.15)', animation: 'fadeInUp 1s ease-out 0.8s both' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 28 }}>◆ Tes 3 leviers prioritaires</div>
        {analysis.top_3_levers.map((lever, i) => (
          <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 50, height: 50, border: '1px solid #c9a259', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 24, fontWeight: 400 }}>{i + 1}</div>
            <p style={{ flex: 1, margin: 0, fontFamily: `'Cormorant Garamond', serif`, fontSize: 18, lineHeight: 1.6, color: 'rgba(245, 233, 208, 0.9)', paddingTop: 10 }}>{lever}</p>
          </div>
        ))}
      </div>

      <div className='print-section' style={{ marginBottom: 30, padding: '40px', background: 'rgba(201, 162, 89, 0.04)', border: '1px solid rgba(201, 162, 89, 0.15)', animation: 'fadeInUp 1s ease-out 1s both' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18 }}>✉ Un mot de Robin</div>
        <p style={{ fontFamily: `'Cormorant Garamond', serif`, fontSize: 19, lineHeight: 1.7, color: 'rgba(245, 233, 208, 0.9)', margin: 0, fontStyle: 'italic' }}>{analysis.personal_note}</p>
        <p style={{ marginTop: 20, marginBottom: 0, color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 17 }}>— Robin</p>
      </div>

      <ContactBlock businessName={data.business_name} />

      <div className='no-print' style={{ textAlign: 'center', marginBottom: 60 }}>
        <button onClick={handlePrint} style={{
          background: 'transparent', border: '1px solid rgba(201, 162, 89, 0.4)',
          color: '#c9a259', padding: '16px 32px', cursor: 'pointer',
          fontFamily: `'Cormorant Garamond', serif`, fontSize: 13,
          letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s',
        }}>
          📄 Télécharger en PDF
        </button>
      </div>

      <div className='print-section' style={{ paddingTop: 40, borderTop: '1px solid rgba(201, 162, 89, 0.15)', textAlign: 'center' }}>
        <div style={{ color: '#c9a259', fontFamily: `'Cormorant Garamond', serif`, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>RobinAI Consulting</div>
        <div style={{ color: 'rgba(245, 233, 208, 0.4)', fontFamily: `'Cormorant Garamond', serif`, fontSize: 13, fontStyle: 'italic' }}>
          Fondé par Robin, également propriétaire de Harmonie Yacht (Port de Carnon, Montpellier)
        </div>
      </div>
    </div>
  </div>
</>
```

);
}

export default function Home() {
const [view, setView] = useState(‘hero’);
const [submittedData, setSubmittedData] = useState(null);
const [analysisResult, setAnalysisResult] = useState(null);
const [prospectRef, setProspectRef] = useState(null);

// TRACKING: Capter le ?ref= et logger audit_started
useEffect(() => {
if (typeof window === ‘undefined’) return;
const params = new URLSearchParams(window.location.search);
const ref = params.get(‘ref’);
if (ref) {
setProspectRef(ref);
fetch(`${SUPABASE_URL}/rest/v1/email_events`, {
method: ‘POST’,
headers: {
‘apikey’: SUPABASE_KEY,
‘Authorization’: `Bearer ${SUPABASE_KEY}`,
‘Content-Type’: ‘application/json’,
‘Prefer’: ‘return=minimal’
},
body: JSON.stringify({
prospect_id: ref,
event_type: ‘audit_started’,
metadata: { url: window.location.href }
})
}).catch(() => {});
}
}, []);

useEffect(() => {
const link = document.createElement(‘link’);
link.href = ‘https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap’;
link.rel = ‘stylesheet’;
document.head.appendChild(link);

```
const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #020810; }
  ::selection { background: rgba(201, 162, 89, 0.3); color: #f5e9d0; }
  input::placeholder { color: rgba(245, 233, 208, 0.25); font-style: italic; }
  button:disabled { opacity: 0.5; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
```

}, []);

function handleSubmit(data, analysis) {
setSubmittedData(data);
setAnalysisResult(analysis);
setView(‘loading’);
setTimeout(() => setView(‘results’), 2000);

```
// TRACKING: Log audit_completed + update score du prospect
if (prospectRef && analysis) {
  fetch(`${SUPABASE_URL}/rest/v1/email_events`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      prospect_id: prospectRef,
      event_type: 'audit_completed',
      metadata: {
        business_name: data.business_name,
        maturity_score: analysis.maturity_score,
        lost_leads: analysis.estimated_lost_leads_per_month,
        lost_revenue: analysis.estimated_lost_revenue_per_month
      }
    })
  }).catch(() => {});

  fetch(`${SUPABASE_URL}/rest/v1/prospects_consulting?id=eq.${prospectRef}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ audit_score: analysis.maturity_score })
  }).catch(() => {});
}
```

}

return (
<div style={{ minHeight: ‘100vh’, fontFamily: `'Cormorant Garamond', serif`, color: ‘#f5e9d0’, position: ‘relative’ }}>
<BackgroundLayers />
{view === ‘hero’ && <Hero onStart={() => setView(‘form’)} />}
{view === ‘form’ && <AuditForm onSubmit={handleSubmit} onBack={() => setView(‘hero’)} />}
{view === ‘loading’ && <LoadingScreen />}
{view === ‘results’ && <ResultsPage data={submittedData} analysis={analysisResult} onRestart={() => setView(‘hero’)} />}
</div>
);
}
