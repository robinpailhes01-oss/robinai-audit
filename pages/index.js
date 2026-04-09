import { useState, useEffect } from "react";

const API_ENDPOINT = "/api/submit-audit";

const SECTORS = [
  { value: "nautique_location", label: "Location de bateaux / yachts", icon: "⛵" },
  { value: "nautique_activites", label: "Activités nautiques (jet ski, plongée, voile...)", icon: "🏄" },
  { value: "conciergerie_luxe", label: "Conciergerie de luxe", icon: "🔑" },
  { value: "hotellerie_villas", label: "Hôtellerie / Villas / Locations saisonnières", icon: "🏛️" },
  { value: "restauration_gastro", label: "Restauration gastronomique", icon: "🍽️" },
  { value: "spa_bien_etre", label: "Spa / Bien-être / Esthétique", icon: "✨" },
  { value: "ecole_coaching", label: "École / Coaching privé", icon: "📚" },
  { value: "evenementiel", label: "Événementiel / Organisation", icon: "🎭" },
  { value: "autre_service_premium", label: "Autre service premium", icon: "💎" },
];

const TEAM_SIZES = [
  { value: "solo", label: "Solo" },
  { value: "2_3", label: "2 à 3 personnes" },
  { value: "4_10", label: "4 à 10 personnes" },
  { value: "10_plus", label: "Plus de 10" },
];

const CHANNELS = [
  { value: "instagram_dm", label: "Instagram DM" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Appels téléphoniques" },
  { value: "email", label: "Email" },
  { value: "website", label: "Formulaire site web" },
  { value: "multiple", label: "Plusieurs canaux" },
];

const WEEKLY_DEMANDS = [
  { value: "less_20", label: "Moins de 20" },
  { value: "20_50", label: "20 à 50" },
  { value: "50_100", label: "50 à 100" },
  { value: "100_200", label: "100 à 200" },
  { value: "more_200", label: "Plus de 200" },
];

const RESPONSE_TIMES = [
  { value: "less_10min", label: "Moins de 10 minutes", emoji: "⚡" },
  { value: "10_60min", label: "10 min à 1h", emoji: "🟢" },
  { value: "1_6h", label: "1 à 6 heures", emoji: "🟡" },
  { value: "6_24h", label: "6 à 24 heures", emoji: "🟠" },
  { value: "more_24h", label: "Plus d'une journée", emoji: "🔴" },
];

const CURRENT_MGMT = [
  { value: "head", label: "Tout dans ma tête" },
  { value: "paper", label: "Notes papier / carnet" },
  { value: "excel", label: "Excel ou Google Sheets" },
  { value: "basic_crm", label: "CRM basique" },
  { value: "advanced_crm", label: "CRM avancé" },
];

const AVG_BASKETS = [
  { value: "less_50", label: "Moins de 50 €" },
  { value: "50_150", label: "50 à 150 €" },
  { value: "150_400", label: "150 à 400 €" },
  { value: "400_1000", label: "400 à 1 000 €" },
  { value: "1000_3000", label: "1 000 à 3 000 €" },
  { value: "more_3000", label: "Plus de 3 000 €" },
];

const MONTHLY_REVENUES = [
  { value: "less_5k", label: "Moins de 5 000 €" },
  { value: "5k_15k", label: "5 000 à 15 000 €" },
  { value: "15k_40k", label: "15 000 à 40 000 €" },
  { value: "40k_100k", label: "40 000 à 100 000 €" },
  { value: "more_100k", label: "Plus de 100 000 €" },
];

const MAIN_PAINS = [
  { value: "responding_dm", label: "Répondre aux messages / DM en continu" },
  { value: "managing_bookings", label: "Gérer les réservations et plannings" },
  { value: "follow_ups", label: "Relancer les clients hésitants" },
  { value: "all_at_once", label: "Tout en même temps, je suis débordé" },
];

const MAIN_GOALS = [
  { value: "free_time", label: "Gagner du temps libre" },
  { value: "more_leads", label: "Générer plus de leads" },
  { value: "better_conversion", label: "Améliorer ma conversion" },
  { value: "less_stress", label: "Moins de stress au quotidien" },
  { value: "scale", label: "Faire grandir mon business" },
  { value: "unclear", label: "Je ne sais pas encore" },
];

function BackgroundLayers() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top, #0a1929 0%, #050f1c 40%, #020810 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 30%, rgba(201, 162, 89, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(201, 162, 89, 0.05) 0%, transparent 50%)" }} />
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "40%", opacity: 0.15 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#c9a259" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L0,320Z" />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%", opacity: 0.08 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#c9a259" d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,256C840,256,960,224,1080,218.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L0,320Z" />
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" stroke="#c9a259" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="14" stroke="#c9a259" strokeWidth="0.6" opacity="0.6" />
        <path d="M20 6 L20 34 M6 20 L34 20" stroke="#c9a259" strokeWidth="0.6" opacity="0.4" />
        <path d="M20 10 L24 20 L20 18 L16 20 Z" fill="#c9a259" />
        <circle cx="20" cy="20" r="1.5" fill="#c9a259" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#f5e9d0", fontWeight: 500, letterSpacing: "0.08em" }}>ROBINAI</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#c9a259", letterSpacing: "0.3em", marginTop: 2 }}>CONSULTING</span>
      </div>
    </div>
  );
}

function ProgressCompass({ step, total }) {
  const progress = (step / total) * 100;
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#c9a259", letterSpacing: "0.25em", textTransform: "uppercase" }}>Cap sur votre analyse</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "rgba(245, 233, 208, 0.6)", letterSpacing: "0.1em" }}>
          {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div style={{ height: 1.5, background: "rgba(201, 162, 89, 0.15)", position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #c9a259 0%, #e9d4a3 100%)", transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 0 20px rgba(201, 162, 89, 0.5)" }} />
      </div>
    </div>
  );
}

function OptionCard({ option, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "20px 24px",
      background: selected ? "rgba(201, 162, 89, 0.12)" : "rgba(255, 255, 255, 0.025)",
      border: selected ? "1px solid rgba(201, 162, 89, 0.6)" : "1px solid rgba(201, 162, 89, 0.15)",
      borderRadius: 2, cursor: "pointer", color: "#f5e9d0",
      fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, letterSpacing: "0.02em",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      {option.icon && <span style={{ fontSize: 22 }}>{option.icon}</span>}
      {option.emoji && <span style={{ fontSize: 20 }}>{option.emoji}</span>}
      <span style={{ flex: 1 }}>{option.label}</span>
      {selected && (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 10 L8 14 L16 6" stroke="#c9a259" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: "#c9a259", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
        {label} {required && <span style={{ color: "#e9d4a3" }}>*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        width: "100%", padding: "14px 18px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(201, 162, 89, 0.2)",
        borderRadius: 2, color: "#f5e9d0",
        fontFamily: "'Cormorant Garamond', serif", fontSize: 17, letterSpacing: "0.01em",
        outline: "none", transition: "all 0.3s", boxSizing: "border-box",
      }} />
    </div>
  );
}

function Hero({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1, padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 40 }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 1, background: "rgba(201, 162, 89, 0.4)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#c9a259", letterSpacing: "0.3em", textTransform: "uppercase" }}>Audit Premium</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 820 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 30, height: 1, background: "#c9a259" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#c9a259", letterSpacing: "0.35em", textTransform: "uppercase" }}>Diagnostic Stratégique Gratuit</span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 82px)", fontWeight: 400, lineHeight: 1.05, color: "#f5e9d0", margin: 0, marginBottom: 32, letterSpacing: "-0.02em" }}>
            Combien votre <em style={{ color: "#c9a259", fontStyle: "italic" }}>business premium</em> perd-il de clients chaque mois&nbsp;?
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.6, color: "rgba(245, 233, 208, 0.75)", marginBottom: 48, maxWidth: 700, fontWeight: 300 }}>
            En <span style={{ color: "#c9a259", fontWeight: 400 }}>5 minutes</span>, obtenez une analyse personnalisée de votre maturité digitale,
            une estimation précise de vos leads perdus, et <em>trois leviers concrets</em> pour les récupérer.
            Zéro engagement, aucune carte bancaire.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <button onClick={onStart} style={{
              background: "linear-gradient(135deg, #c9a259 0%, #a8863e 100%)",
              color: "#050f1c", border: "none", padding: "20px 48px", borderRadius: 2,
              fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600,
              letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 10px 40px rgba(201, 162, 89, 0.3)",
            }}>
              Démarrer l'audit →
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "rgba(245, 233, 208, 0.5)", letterSpacing: "0.05em" }}>~ 5 minutes</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "rgba(245, 233, 208, 0.5)", letterSpacing: "0.05em" }}>Rapport reçu par email</span>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 60, display: "flex", gap: 60, flexWrap: "wrap", borderTop: "1px solid rgba(201, 162, 89, 0.12)", marginTop: 60 }}>
          {[
            { label: "Analyse IA", value: "Par Claude" },
            { label: "Secteurs couverts", value: "Premium & Luxe" },
            { label: "Durée", value: "5 minutes" },
            { label: "Tarif", value: "Offert" },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#c9a259", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f5e9d0", fontWeight: 400 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditForm({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    business_sector: "", team_size: "", main_channel: "",
    weekly_demands: "", response_time: "", current_management: "",
    avg_basket: "", monthly_revenue: "", main_pain: "", main_goal: "",
    first_name: "", last_name: "", email: "", phone: "",
    business_name: "", instagram_handle: "",
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 11;

  function updateField(key, value) { setData(d => ({ ...d, [key]: value })); }

  function nextStep() {
    if (step < totalSteps) setStep(s => s + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    if (step > 1) setStep(s => s - 1);
    else onBack();
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitForm() {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) onSubmit(data);
      else alert("Une erreur est survenue. Merci de réessayer.");
    } catch (e) {
      alert("Erreur de connexion. Merci de réessayer.");
    }
    setLoading(false);
  }

  const stepConfigs = [
    { key: "business_sector", title: "Quelle est votre activité ?", subtitle: "Afin de personnaliser précisément votre analyse.", options: SECTORS, required: true },
    { key: "team_size", title: "Combien êtes-vous dans l'équipe ?", subtitle: "Pour comprendre votre capacité opérationnelle.", options: TEAM_SIZES, required: true },
    { key: "main_channel", title: "Par quel canal arrivent vos demandes ?", subtitle: "Le point d'entrée principal de vos clients.", options: CHANNELS, required: true },
    { key: "weekly_demands", title: "Combien de demandes par semaine en haute saison ?", subtitle: "Même une estimation approximative convient.", options: WEEKLY_DEMANDS, required: true },
    { key: "response_time", title: "Quel est votre temps de réponse moyen ?", subtitle: "C'est souvent ici que se joue la conversion.", options: RESPONSE_TIMES, required: true },
    { key: "current_management", title: "Comment gérez-vous vos clients aujourd'hui ?", subtitle: "Votre système actuel de gestion.", options: CURRENT_MGMT, required: true },
    { key: "avg_basket", title: "Quel est votre panier moyen par client ?", subtitle: "Une estimation par prestation suffit.", options: AVG_BASKETS, required: true },
    { key: "monthly_revenue", title: "Votre CA mensuel en haute saison ?", subtitle: "Information confidentielle, utilisée uniquement pour le calcul.", options: MONTHLY_REVENUES, required: true },
    { key: "main_pain", title: "Qu'est-ce qui vous pèse le plus ?", subtitle: "Votre principal point de friction au quotidien.", options: MAIN_PAINS, required: true },
    { key: "main_goal", title: "Votre objectif principal cette année ?", subtitle: "Ce qui changerait vraiment votre business.", options: MAIN_GOALS, required: true },
  ];

  const currentConfig = step <= 10 ? stepConfigs[step - 1] : null;
  const isLastStep = step === 11;
  const canProceed = step <= 10 ? !!data[currentConfig?.key] : (data.first_name && data.email && data.business_name);

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <Logo />
          <button onClick={prevStep} style={{
            background: "transparent", border: "1px solid rgba(201, 162, 89, 0.3)",
            color: "#c9a259", padding: "10px 20px", borderRadius: 2, cursor: "pointer",
            fontFamily: "'Cormorant Garamond', serif", fontSize: 12,
            letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 0.3s",
          }}>
            ← Retour
          </button>
        </div>

        <ProgressCompass step={step} total={totalSteps} />

        {currentConfig && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 400, color: "#f5e9d0", margin: 0, marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.15 }}>{currentConfig.title}</h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "rgba(245, 233, 208, 0.55)", margin: 0, marginBottom: 40, fontStyle: "italic", fontWeight: 300 }}>{currentConfig.subtitle}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {currentConfig.options.map(opt => (
                <OptionCard key={opt.value} option={opt} selected={data[currentConfig.key] === opt.value} onClick={() => { updateField(currentConfig.key, opt.value); setTimeout(nextStep, 300); }} />
              ))}
            </div>
          </div>
        )}

        {isLastStep && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 400, color: "#f5e9d0", margin: 0, marginBottom: 14, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
              Où vous envoyer votre <em style={{ color: "#c9a259" }}>rapport personnalisé</em> ?
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "rgba(245, 233, 208, 0.55)", margin: 0, marginBottom: 40, fontStyle: "italic", fontWeight: 300 }}>
              Vous le recevrez dans les 2 minutes suivant la validation.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <TextField label="Prénom" value={data.first_name} onChange={v => updateField("first_name", v)} placeholder="Jean" required />
              <TextField label="Nom" value={data.last_name} onChange={v => updateField("last_name", v)} placeholder="Dupont" />
            </div>
            <TextField label="Email professionnel" value={data.email} onChange={v => updateField("email", v)} placeholder="jean@monentreprise.com" type="email" required />
            <TextField label="Téléphone (optionnel)" value={data.phone} onChange={v => updateField("phone", v)} placeholder="06 12 34 56 78" type="tel" />
            <TextField label="Nom de votre entreprise" value={data.business_name} onChange={v => updateField("business_name", v)} placeholder="Yacht Évasion Cannes" required />
            <TextField label="Compte Instagram (optionnel)" value={data.instagram_handle} onChange={v => updateField("instagram_handle", v)} placeholder="@monentreprise" />

            <button onClick={submitForm} disabled={!canProceed || loading} style={{
              width: "100%", marginTop: 28,
              background: canProceed ? "linear-gradient(135deg, #c9a259 0%, #a8863e 100%)" : "rgba(201, 162, 89, 0.15)",
              color: canProceed ? "#050f1c" : "rgba(245, 233, 208, 0.4)",
              border: "none", padding: "22px", borderRadius: 2,
              fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600,
              letterSpacing: "0.25em", textTransform: "uppercase",
              cursor: canProceed && !loading ? "pointer" : "not-allowed",
              transition: "all 0.4s", boxShadow: canProceed ? "0 10px 40px rgba(201, 162, 89, 0.3)" : "none",
            }}>
              {loading ? "Analyse en cours..." : "Recevoir mon audit →"}
            </button>
            <p style={{ textAlign: "center", marginTop: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "rgba(245, 233, 208, 0.4)", fontStyle: "italic" }}>
              Vos données restent strictement confidentielles et ne sont jamais partagées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Confirmation({ data }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 680, textAlign: "center" }}>
        <div style={{ marginBottom: 50 }}>
          <svg width="70" height="70" viewBox="0 0 80 80" fill="none" style={{ margin: "0 auto", display: "block" }}>
            <circle cx="40" cy="40" r="38" stroke="#c9a259" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="30" stroke="#c9a259" strokeWidth="0.8" opacity="0.4" />
            <path d="M25 40 L36 52 L56 30" stroke="#c9a259" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 30, height: 1, background: "#c9a259" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: "#c9a259", letterSpacing: "0.35em", textTransform: "uppercase" }}>Audit envoyé</span>
          <div style={{ width: 30, height: 1, background: "#c9a259" }} />
        </div>

        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#f5e9d0", marginTop: 0, marginBottom: 28, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          Merci <em style={{ color: "#c9a259" }}>{data.first_name}</em>.
        </h2>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "rgba(245, 233, 208, 0.75)", lineHeight: 1.6, marginBottom: 40, fontWeight: 300 }}>
          Votre rapport personnalisé est en cours de préparation. Vous le recevrez sur <strong style={{ color: "#c9a259", fontWeight: 500 }}>{data.email}</strong> dans les 2 prochaines minutes.
        </p>

        <div style={{ padding: "32px 36px", background: "rgba(201, 162, 89, 0.05)", border: "1px solid rgba(201, 162, 89, 0.2)", marginBottom: 40, textAlign: "left" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#c9a259", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>Que contient votre rapport ?</p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {[
              "Votre Score de Maturité Digitale (0-100)",
              "L'estimation précise de vos leads perdus chaque mois",
              "L'impact financier réel sur votre chiffre d'affaires",
              "3 leviers concrets pour récupérer ces clients",
              "Benchmark face aux acteurs de votre secteur",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "rgba(245, 233, 208, 0.85)" }}>
                <span style={{ color: "#c9a259", marginTop: 2 }}>◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "rgba(245, 233, 208, 0.5)", fontStyle: "italic" }}>
          Pensez à vérifier vos spams si vous ne voyez pas l'email.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState("hero");
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #020810; }
      ::selection { background: rgba(201, 162, 89, 0.3); color: #f5e9d0; }
      input::placeholder { color: rgba(245, 233, 208, 0.25); font-style: italic; }
      button:disabled { opacity: 0.5; }
    `;
    document.head.appendChild(style);
  }, []);

  function handleSubmit(data) {
    setSubmittedData(data);
    setView("confirmation");
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Cormorant Garamond', serif", color: "#f5e9d0", position: "relative" }}>
      <BackgroundLayers />
      {view === "hero" && <Hero onStart={() => setView("form")} />}
      {view === "form" && <AuditForm onSubmit={handleSubmit} onBack={() => setView("hero")} />}
      {view === "confirmation" && <Confirmation data={submittedData} />}
    </div>
  );
}
