import { useState, useEffect } from "react";

const SECTOR_LABELS = {
  nautique_location: "Location bateaux",
  nautique_activites: "Activités nautiques",
};

const PACK_COLORS = {
  starter: { bg: "#e0f2fe", text: "#0369a1" },
  pro: { bg: "#fef9c3", text: "#854d0e" },
  premium: { bg: "#dcfce7", text: "#166534" },
};

const STATUS_CONFIG = {
  new: { label: "Nouveau", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  contacted: { label: "Contacté", bg: "#fefce8", text: "#854d0e", dot: "#eab308" },
  qualified: { label: "Qualifié", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  lost: { label: "Perdu", bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
};

function ScoreBadge({ score }) {
  const color = score < 30 ? "#ef4444" : score < 60 ? "#f59e0b" : "#22c55e";
  return (
    <span style={{ fontWeight: 700, color, fontSize: 15 }}>
      {score}<span style={{ color: "#ccc", fontWeight: 400, fontSize: 12 }}>/100</span>
    </span>
  );
}

function StatCard({ label, value, sub, color = "#6366f1" }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>}
      <div style={{ height: 3, background: color, borderRadius: 2, marginTop: 12, width: "40%" }} />
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.text, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Sidebar({ active, setActive }) {
  const items = [
    { id: "audits", icon: "📋", label: "Audits reçus" },
    { id: "prospects", icon: "🔍", label: "Prospects scrapés" },
    { id: "scraper", icon: "⚡", label: "Lancer le scraper" },
  ];
  return (
    <div style={{ width: 220, background: "#0f172a", minHeight: "100vh", padding: "0 12px", flexShrink: 0 }}>
      <div style={{ padding: "28px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ color: "#c9a259", fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}>RobinAI</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>CRM Dashboard</div>
      </div>
      <nav style={{ marginTop: 16 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: active === item.id ? "rgba(201,162,89,0.15)" : "transparent",
            color: active === item.id ? "#c9a259" : "rgba(255,255,255,0.5)",
            fontSize: 13, fontWeight: active === item.id ? 600 : 400,
            marginBottom: 2, textAlign: "left", transition: "all 0.15s",
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function AuditsTab({ audits, loading }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = audits.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.business_name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.first_name?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || a.recommended_package === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenueLost = audits.reduce((s, a) => s + (a.estimated_lost_revenue_per_month || 0), 0);
  const avgScore = audits.length ? Math.round(audits.reduce((s, a) => s + (a.maturity_score || 0), 0) / audits.length) : 0;
  const withEmail = audits.filter(a => a.email && a.email !== "no-email@audit.local").length;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Audits reçus</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>{audits.length} formulaire{audits.length > 1 ? "s" : ""} complété{audits.length > 1 ? "s" : ""}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="Total leads" value={audits.length} color="#6366f1" />
        <StatCard label="Score moyen" value={`${avgScore}/100`} color="#f59e0b" />
        <StatCard label="CA manqué total/mois" value={`${(totalRevenueLost / 1000).toFixed(0)}k €`} color="#ef4444" />
        <StatCard label="Avec email" value={withEmail} sub={`${audits.length - withEmail} sans email`} color="#22c55e" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{
          padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
          fontSize: 14, outline: "none", width: 240, background: "#fff",
        }} />
        {["all", "starter", "pro", "premium"].map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{
            padding: "9px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
            background: filter === p ? "#0f172a" : "#fff",
            color: filter === p ? "#fff" : "#374151",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>{p === "all" ? "Tous" : p.charAt(0).toUpperCase() + p.slice(1)}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Chargement...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Prospect", "Score", "CA manqué/mois", "Pack", "Contact", "Secteur", "Date"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Aucun résultat</td></tr>
              ) : filtered.map((a, i) => {
                const pack = PACK_COLORS[a.recommended_package] || { bg: "#f3f4f6", text: "#374151" };
                const hasEmail = a.email && a.email !== "no-email@audit.local";
                const date = a.created_at ? new Date(a.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—";
                return (
                  <tr key={a.id || i} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{a.first_name} {a.last_name || ""}</div>
                      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{a.business_name}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}><ScoreBadge score={a.maturity_score} /></td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#ef4444", fontSize: 14 }}>
                      {a.estimated_lost_revenue_per_month?.toLocaleString("fr-FR")} €
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: pack.bg, color: pack.text, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
                        {a.recommended_package || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {hasEmail ? (
                        <a href={`mailto:${a.email}`} style={{ color: "#2563eb", fontSize: 13 }}>{a.email}</a>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: 13 }}>Pas d'email</span>
                      )}
                      {a.phone && <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{a.phone}</div>}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                      {SECTOR_LABELS[a.business_sector] || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#9ca3af" }}>{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProspectsTab({ prospects, loading, onStatusChange }) {
  const [search, setSearch] = useState("");
  const filtered = prospects.filter(p => {
    const q = search.toLowerCase();
    return !q || p.business_name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
  });

  const stats = {
    total: prospects.length,
    emailed: prospects.filter(p => p.status === "contacted").length,
    qualified: prospects.filter(p => p.status === "qualified").length,
    pending: prospects.filter(p => !p.status || p.status === "new").length,
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Prospects scrapés</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Entreprises nautiques identifiées automatiquement</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="Total scrapés" value={stats.total} color="#6366f1" />
        <StatCard label="Emailés" value={stats.emailed} color="#22c55e" />
        <StatCard label="Qualifiés" value={stats.qualified} color="#f59e0b" />
        <StatCard label="En attente" value={stats.pending} color="#e5e7eb" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{
          padding: "9px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
          fontSize: 14, outline: "none", width: 240, background: "#fff",
        }} />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Chargement...</div>
      ) : prospects.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p style={{ color: "#9ca3af", fontSize: 15 }}>Aucun prospect scrapé pour l'instant.</p>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Lance le scraper depuis l'onglet ⚡</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Entreprise", "Ville", "Note Google", "Site web", "Email généré", "Statut", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id || i} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{p.business_name}</div>
                    {p.phone && <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{p.phone}</div>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{p.city || "—"}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14 }}>
                    {p.rating ? <span style={{ color: "#f59e0b", fontWeight: 600 }}>★ {p.rating}</span> : "—"}
                    {p.reviews_count && <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: 4 }}>({p.reviews_count})</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {p.website ? <a href={p.website} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 13 }}>Voir →</a> : <span style={{ color: "#d1d5db", fontSize: 13 }}>Aucun</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {p.email_draft ? (
                      <span style={{ color: "#22c55e", fontSize: 13 }}>✓ Prêt</span>
                    ) : (
                      <span style={{ color: "#d1d5db", fontSize: 13 }}>En attente</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}><StatusBadge status={p.status || "new"} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.email_draft && p.status !== "contacted" && (
                        <button onClick={() => onStatusChange(p.id, "contacted")} style={{
                          padding: "5px 10px", borderRadius: 6, border: "1px solid #22c55e",
                          background: "#f0fdf4", color: "#166534", fontSize: 12, cursor: "pointer", fontWeight: 500,
                        }}>📧 Envoyé</button>
                      )}
                      <button onClick={() => onStatusChange(p.id, "qualified")} style={{
                        padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 12, cursor: "pointer",
                      }}>✓ Qualifié</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScraperTab({ onProspectsAdded }) {
  const [region, setRegion] = useState("Côte d'Azur");
  const [maxResults, setMaxResults] = useState(20);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const regions = ["Côte d'Azur", "Provence", "Bretagne", "Normandie", "Languedoc", "Corse", "Pays Basque", "France entière"];

  async function runScraper() {
    setRunning(true);
    setResult(null);
    setError(null);
    setElapsed(0);
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);

    try {
      setStep("🚀 Lancement du scraper Apify...");
      const startRes = await fetch("/api/scraper/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, maxResults }),
      });
      const { runId, error: startErr } = await startRes.json();
      if (startErr) throw new Error(startErr);

      setStep("🔍 Scraping Google Maps en cours...");
      let attempts = 0;
      while (attempts < 60) {
        await sleep(5000);
        attempts++;
        const statusRes = await fetch(`/api/scraper/status?runId=${runId}&maxResults=${maxResults}&region=${encodeURIComponent(region)}`);
        const statusData = await statusRes.json();

        if (statusData.status === "failed") throw new Error(statusData.error || "Scraper échoué");
        if (statusData.status === "done") {
          setStep("🧠 Claude rédige les emails d'approche...");
          await sleep(3000);
          setResult({ scraped: statusData.count, ids: statusData.ids });
          onProspectsAdded?.();
          break;
        }
        if (attempts % 6 === 0) setStep(`🔍 Scraping en cours... (${attempts * 5}s)`);
      }
      if (attempts >= 60) throw new Error("Timeout — le scraper a pris trop longtemps");
    } catch (e) {
      setError(e.message);
    }
    clearInterval(timer);
    setStep(null);
    setRunning(false);
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Lancer le scraper</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
        Trouve les entreprises nautiques, analyse leur présence en ligne et génère un email d'approche personnalisé pour chacune.
      </p>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 28, marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Zone géographique</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {regions.map(r => (
              <button key={r} onClick={() => setRegion(r)} disabled={running} style={{
                padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: region === r ? "#0f172a" : "#fff",
                color: region === r ? "#fff" : "#374151",
                fontSize: 13, cursor: running ? "not-allowed" : "pointer", fontWeight: region === r ? 600 : 400,
              }}>{r}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
            Nombre de résultats : <span style={{ color: "#6366f1" }}>{maxResults}</span>
          </label>
          <input type="range" min={5} max={50} value={maxResults} disabled={running}
            onChange={e => setMaxResults(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            <span>5</span><span>50</span>
          </div>
        </div>

        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, marginBottom: 24, fontSize: 13, color: "#475569" }}>
          <strong>Ce que ça fait automatiquement :</strong>
          <ol style={{ margin: "8px 0 0 16px", lineHeight: 1.9 }}>
            <li>Scrape Google Maps → entreprises nautiques en <strong>{region}</strong></li>
            <li>Récupère : nom, adresse, téléphone, site web, note Google, avis</li>
            <li>Claude rédige un email d'approche personnalisé pour chacun</li>
            <li>Resend envoie automatiquement (si email disponible)</li>
          </ol>
        </div>

        {running && (
          <div style={{ marginBottom: 20, background: "#eff6ff", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 16, height: 16, border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 14, color: "#1d4ed8", fontWeight: 500 }}>{step}</span>
            </div>
            <div style={{ fontSize: 12, color: "#60a5fa", marginTop: 8 }}>Temps écoulé : {elapsed}s — patience, Google Maps prend 1-3 minutes</div>
          </div>
        )}

        <button onClick={runScraper} disabled={running} style={{
          width: "100%", padding: "14px 24px", borderRadius: 10, border: "none",
          background: running ? "#e5e7eb" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: running ? "#9ca3af" : "#c9a259", fontSize: 15, fontWeight: 700,
          cursor: running ? "not-allowed" : "pointer", letterSpacing: "0.05em",
        }}>
          {running ? "En cours..." : `⚡ Lancer sur ${region}`}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 16, color: "#991b1b", fontSize: 14 }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 24 }}>
          <div style={{ fontWeight: 700, color: "#166534", marginBottom: 16, fontSize: 16 }}>✅ Scraping terminé !</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#166534" }}>{result.scraped}</div>
              <div style={{ fontSize: 13, color: "#4b7c63" }}>entreprises trouvées</div>
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: "#4b7c63" }}>
            Les emails d'approche sont générés en arrière-plan. Consulte l'onglet <strong>Prospects scrapés</strong> dans quelques instants.
          </p>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
            <li>Claude rédige un email d'approche chaleureux pour chacun</li>
            <li>Resend envoie automatiquement (si email disponible)</li>
          </ol>
        </div>

        <button onClick={runScraper} disabled={running} style={{
          width: "100%", padding: "14px 24px", borderRadius: 10, border: "none",
          background: running ? "#e5e7eb" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: running ? "#9ca3af" : "#c9a259", fontSize: 15, fontWeight: 700,
          cursor: running ? "not-allowed" : "pointer", letterSpacing: "0.05em",
          transition: "all 0.2s",
        }}>
          {running ? step || "En cours..." : `⚡ Lancer sur ${region}`}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 16, color: "#991b1b", fontSize: 14 }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#166534", marginBottom: 12, fontSize: 15 }}>✅ Terminé !</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#166534" }}>{result.scraped}</div>
              <div style={{ fontSize: 12, color: "#4b7c63" }}>scrapés</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#166534" }}>{result.analyzed}</div>
              <div style={{ fontSize: 12, color: "#4b7c63" }}>analysés</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#166534" }}>{result.sent}</div>
              <div style={{ fontSize: 12, color: "#4b7c63" }}>emails envoyés</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("audits");
  const [audits, setAudits] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [loadingAudits, setLoadingAudits] = useState(true);
  const [loadingProspects, setLoadingProspects] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/audits")
      .then(r => r.json())
      .then(d => { setAudits(d.audits || []); setLoadingAudits(false); })
      .catch(() => setLoadingAudits(false));
  }, []);

  useEffect(() => {
    if (active === "prospects") {
      fetch("/api/dashboard/prospects")
        .then(r => r.json())
        .then(d => { setProspects(d.prospects || []); setLoadingProspects(false); })
        .catch(() => setLoadingProspects(false));
    }
  }, [active]);

  async function handleStatusChange(id, status) {
    await fetch("/api/dashboard/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={active} setActive={setActive} />
        <main style={{ flex: 1, padding: "32px 36px", overflowX: "auto" }}>
          {active === "audits" && <AuditsTab audits={audits} loading={loadingAudits} />}
          {active === "prospects" && <ProspectsTab prospects={prospects} loading={loadingProspects} onStatusChange={handleStatusChange} />}
          {active === "scraper" && <ScraperTab onProspectsAdded={() => {
            fetch("/api/dashboard/prospects").then(r => r.json()).then(d => setProspects(d.prospects || []));
          }} />}
        </main>
      </div>
    </>
  );
}
