import React, { useEffect, useState } from "react";

const LIGHT = {
  bg: "#f0f4f8", panel: "#ffffff", border: "#d1dce8",
  accent: "#0077cc", green: "#00914d", red: "#d93025",
  yellow: "#c17f00", orange: "#c85a00", muted: "#9ab0c4",
  text: "#1a2733", textDim: "#5a7a94",
};

const DARK = {
  bg: "#0a0a12", panel: "#11111f", border: "#2e2060",
  accent: "#c9a227", green: "#00d49e", red: "#ff4d6a",
  yellow: "#c9a227", orange: "#ff8c42", muted: "#6b5fa0",
  text: "#ede6ff", textDim: "#a094cc",
};

const ThemeContext = React.createContext(LIGHT);

const NEUTRAL_THRESHOLD = 20;
const CURRENCIES = ["USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CAD", "NZD"];
const API = "https://market-pulse-fdgb.onrender.com";


const seasonalData = [
  { month: "Jan", USD: +2, EUR: -1, JPY: +3, AUD: -2 },
  { month: "Feb", USD: +1, EUR: +1, JPY: +2, AUD: -1 },
  { month: "Mar", USD: -1, EUR: +2, JPY: +4, AUD: -3 },
  { month: "Apr", USD: -2, EUR: +3, JPY: +2, AUD: +1 },
  { month: "May", USD: +1, EUR: -1, JPY: -1, AUD: +2 },
  { month: "Jun", USD: +3, EUR: -2, JPY: -2, AUD: +3 },
];



const volWindows = [
  { session: "Tokyo", time: "00:00-09:00", vol: 35, pairs: "JPY, AUD, NZD" },
  { session: "London", time: "03:00-12:00", vol: 78, pairs: "EUR, GBP, CHF" },
  { session: "NY Open", time: "08:00-12:00", vol: 95, pairs: "USD, CAD" },
  { session: "Overlap", time: "08:00-11:00", vol: 100, pairs: "Vsechny pary" },
  { session: "NY Close", time: "14:00-17:00", vol: 45, pairs: "USD pary" },
  { session: "Weekend", time: "Pa 17:00-Ne 17:00", vol: 10, pairs: "GAP riziko" },
];

function computeCurrencyTotals(list) {
  const totals = {};
  const counts = {};
  CURRENCIES.forEach((c) => { totals[c] = 0; counts[c] = 0; });
  (list || []).forEach((s) => {
    CURRENCIES.forEach((c) => {
      const ci = s.currency_impact || s.currencyImpact;
      if (ci && ci[c]) {
        const score = ci[c].score || 0;
        if (score !== 0) { totals[c] += score; counts[c]++; }
      }
    });
  });
  // Průměr místo součtu — víc zpráv o USD nezvyšuje skóre umělě
  const result = {};
  CURRENCIES.forEach((c) => {
    result[c] = counts[c] > 0 ? Math.round(totals[c] / counts[c]) : 0;
  });
  return result;
}

function ScoreBar({ score, height = 6 }) {
  const C = React.useContext(ThemeContext);
  const pct = ((score + 100) / 200) * 100;
  const color = score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
  return (
    <div style={{ width: "100%", height, background: C.border, borderRadius: 3, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: C.muted }} />
      <div style={{
        position: "absolute",
        left: score >= 0 ? "50%" : `${pct}%`,
        width: score >= 0 ? `${pct - 50}%` : `${50 - pct}%`,
        height: "100%", background: color, boxShadow: `0 0 5px ${color}`, borderRadius: 3,
      }} />
    </div>
  );
}

function RiskMeter({ score }) {
  const C = React.useContext(ThemeContext);
  const clamp = Math.max(-100, Math.min(100, score));
  const angle = (clamp / 100) * 90;
  const label = clamp > NEUTRAL_THRESHOLD ? "RISK ON" : clamp < -NEUTRAL_THRESHOLD ? "RISK OFF" : "NEUTRAL";
  const G = "#c9a227";
  const GD = "#7a5c10";
  const GB = "#f0c93a";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width="190" height="118" viewBox="0 0 190 118">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GD} stopOpacity="0.7" />
            <stop offset="50%" stopColor={GB} stopOpacity="1" />
            <stop offset="100%" stopColor={GD} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M 12 100 A 82 82 0 0 1 178 100" fill="none" stroke={C.border} strokeWidth="9" strokeLinecap="round" />
        <path d="M 12 100 A 82 82 0 0 1 178 100" fill="none" stroke="url(#arcGrad)" strokeWidth="9" strokeLinecap="round" />
        <g transform={`rotate(${angle}, 95, 100)`}>
          <line x1="95" y1="100" x2="95" y2="24" stroke={GB} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="95" cy="100" r="5" fill={GB} />
        </g>
        <text x="38" y="98" fill={GD} fontSize="8" fontFamily="monospace" textAnchor="middle">-100</text>
        <text x="38" y="108" fill={GD} fontSize="7" fontFamily="monospace" textAnchor="middle">risk off</text>
        <text x="95" y="12" fill={G} fontSize="8" fontFamily="monospace" textAnchor="middle">0</text>
        <text x="152" y="98" fill={GD} fontSize="8" fontFamily="monospace" textAnchor="middle">+100</text>
        <text x="152" y="108" fill={GD} fontSize="7" fontFamily="monospace" textAnchor="middle">risk on</text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: G, fontFamily: "monospace", filter: `drop-shadow(0 0 8px ${G})` }}>
          {clamp > 0 ? "+" : ""}{clamp}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 4, color: G }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  const C = React.useContext(ThemeContext);
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none",
      borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
      color: active ? C.accent : C.textDim,
      padding: "0 10px 8px", fontSize: 9, letterSpacing: 1,
      cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

function SectionLabel({ children, center }) {
  const C = React.useContext(ThemeContext);
  return <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10, textAlign: center ? "center" : "left" }}>{children}</div>;
}

export default function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [centralBanks, setCentralBanks] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [events, setEvents] = useState([]);
  const [sentiment, setSentiment] = useState({ total_score: 0, label: "NEUTRAL" });
  const [cotData, setCotData] = useState([]);
  const [centerTab, setCenterTab] = useState("scenarios");
  const [rightTab, setRightTab] = useState("pairs");
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [scenarioFilter, setScenarioFilter] = useState("ALL");
  const [scanning, setScanning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("--:--:--");
  const [commodities, setCommodities] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [seasonalLive, setSeasonalLive] = useState([]);
  const [correlationData, setCorrelationData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const C = darkMode ? DARK : LIGHT;

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((r) => r.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("OFFLINE"));
  }, []);

  useEffect(() => {
    fetch(`${API}/api/central_banks`)
      .then(r => r.json())
      .then(data => setCentralBanks(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCommodities = () => fetch(`${API}/api/commodities`).then(r => r.json()).then(data => setCommodities(data)).catch(() => {});
    fetchCommodities();
    const id = setInterval(fetchCommodities, 300000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/history`)
      .then(r => r.json())
      .then(data => setHistoryData(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchWatchlist = () => fetch(`${API}/api/watchlist`).then(r => r.json()).then(data => setWatchlistData(Array.isArray(data) ? data : [])).catch(() => {});
    fetchWatchlist();
    const id = setInterval(fetchWatchlist, 300000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/seasonal`)
      .then(r => r.json())
      .then(data => setSeasonalLive(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API}/api/correlation`)
      .then(r => r.json())
      .then(data => setCorrelationData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API}/api/cot`)
      .then(r => r.json())
      .then(data => {
        setCotData(data.map(c => ({
          currency: c.currency, net: c.net,
          long: c.long, short: c.short, date: c.date,
          sentiment: c.net > 0 ? "bullish" : "bearish"
        })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/scenarios`).then((r) => r.json()),
      fetch(`${API}/api/events`).then((r) => r.json()),
      fetch(`${API}/api/sentiment`).then((r) => r.json()),
    ])
      .then(([sc, ev, se]) => {
        setScenarios(sc || []);
        setEvents(ev || []);
        setSentiment(se || { total_score: 0, label: "NEUTRAL" });
      })
      .catch(() => {
        setScenarios([]);
        setEvents([]);
        setSentiment({ total_score: 0, label: "NEUTRAL" });
      });
  }, []);

  const currencyTotals = computeCurrencyTotals(scenarios.length > 0 ? scenarios : []);

  const runScan = () => {
    setScanning(true);
    fetch(`${API}/api/rescan`)
      .then(() => {
        setTimeout(() => {
          const now = new Date();
          setLastUpdate(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
          Promise.all([
            fetch(`${API}/api/scenarios`).then(r => r.json()),
            fetch(`${API}/api/sentiment`).then(r => r.json()),
            fetch(`${API}/api/events`).then(r => r.json()),
            fetch(`${API}/api/history`).then(r => r.json()),
          ]).then(([sc, se, ev, hi]) => {
            setScenarios(sc || []);
            setSentiment(se || { total_score: 0, label: "NEUTRAL" });
            setEvents(ev || []);
            setHistoryData(hi || []);
            setScanning(false);
          });
        }, 30000);
      })
      .catch(() => setScanning(false));
  };

  const riskColor = sentiment.total_score > NEUTRAL_THRESHOLD ? C.green : sentiment.total_score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
  const riskLabel = sentiment.total_score > NEUTRAL_THRESHOLD ? "RISK ON" : sentiment.total_score < -NEUTRAL_THRESHOLD ? "RISK OFF" : "NEUTRAL";

  const corrColor = (val) => {
    if (val >= 0.7) return C.green;
    if (val <= -0.7) return C.red;
    if (Math.abs(val) <= 0.3) return C.muted;
    return C.yellow;
  };

  return (
    <ThemeContext.Provider value={C}>
    <div style={{ background: C.bg, height: "100vh", color: C.text, fontFamily: "monospace", padding: 14, boxSizing: "border-box", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 12, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: 4, color: C.accent }}>◈ MARKET PULSE</div>
          <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 2 }}>AI FUNDAMENTAL SENTIMENT ENGINE</div>
          <div style={{ fontSize: 9, color: backendStatus === "ok" ? C.green : backendStatus === "checking..." ? C.yellow : C.red, marginTop: 4 }}>
            Backend: <b>{backendStatus}</b>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.textDim }}>LAST SCAN</div>
            <div style={{ fontSize: 12, color: C.accent }}>{lastUpdate}</div>
          </div>
          <button onClick={runScan} disabled={scanning} style={{
            background: `${C.accent}18`, border: `1px solid ${scanning ? C.muted : C.accent}`,
            color: scanning ? C.textDim : C.accent, padding: "6px 12px", fontSize: 9,
            letterSpacing: 2, cursor: "pointer", borderRadius: 4, fontFamily: "monospace",
          }}>{scanning ? "◌ SCANNING..." : "⟳ RESCAN"}</button>
          <button onClick={() => setDarkMode(d => !d)} title={darkMode ? "Light mode" : "Dark mode"} style={{
            background: darkMode ? "#c9a22718" : `${C.border}`, border: `1px solid ${darkMode ? "#c9a22755" : C.border}`,
            color: C.textDim, padding: "6px 9px", fontSize: 14,
            cursor: "pointer", borderRadius: 4, lineHeight: 1,
          }}>{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 12, flex: 1, minHeight: 0 }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>

          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <SectionLabel center>RISK SENTIMENT</SectionLabel>
            <RiskMeter score={sentiment.total_score} />
            {sentiment.vix != null && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, marginBottom: 2 }}>
                <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 1 }}>VIX</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: sentiment.vix > 25 ? C.red : sentiment.vix < 15 ? C.green : C.yellow }}>
                  {sentiment.vix.toFixed(1)}
                </span>
                <span style={{ fontSize: 8, color: C.textDim }}>
                  {sentiment.vix > 25 ? "▲ strach" : sentiment.vix < 15 ? "▼ klid" : "— neutral"}
                </span>
              </div>
            )}

            {/* Menovy prehled - risk ON / risk OFF klasifikace */}
            <div style={{ marginTop: 12, padding: "10px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <SectionLabel>MENOVY PREHLED</SectionLabel>
              {(() => {
                const groups = [
                  { label: "Risk ON",  currencies: ["AUD", "NZD", "CAD"] },
                  { label: "Neutral",  currencies: ["GBP", "EUR"] },
                  { label: "Risk OFF", currencies: ["USD", "JPY", "CHF"] },
                ];
                return groups.map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                    <span style={{ fontSize: 9, color: C.textDim, width: 54, paddingTop: 2, flexShrink: 0 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.length > 0 ? group.currencies.map(c => {
                        const score = currencyTotals[c] || 0;
                        const isDark = C.bg === "#0a0a12";
                        const col = isDark
                          ? (score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow)
                          : C.text;
                        return (
                          <span key={c} style={{ fontSize: 9, color: col, border: `1px solid ${col}55`, background: `${col}12`, padding: "1px 5px", borderRadius: 3 }}>{c}</span>
                        );
                      }) : <span style={{ fontSize: 9, color: C.muted }}>—</span>}
                    </div>
                  </div>
                ));
              })()}
            </div>

          </div>

          {/* Commodities */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", flex: 1, overflowY: "auto", minHeight: 0 }}>
            <SectionLabel>KOMODITY</SectionLabel>
            {commodities.length === 0 ? (
              <div style={{ fontSize: 9, color: C.muted }}>Načítám...</div>
            ) : commodities.map(c => {
              const chCol = c.change > 0 ? C.green : c.change < 0 ? C.red : C.yellow;
              const signal = c.signal || "neutral";
              const sigCol = signal === "risk on" ? C.green : signal === "risk off" ? C.red : C.yellow;
              return (
                <div key={c.name} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{c.name}</span>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: chCol }}>{c.change > 0 ? "▲" : "▼"} {Math.abs(c.change)}%</span>
                      <span style={{ fontSize: 9, color: C.textDim }}>{c.price}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 8, color: C.muted }}>{c.currencies}</span>
                    <span style={{ fontSize: 8, color: sigCol, border: `1px solid ${sigCol}44`, padding: "1px 5px", borderRadius: 3 }}>{signal}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>

          {/* CENTER tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label="⚡ Scenarios" active={centerTab === "scenarios"} onClick={() => setCenterTab("scenarios")} />
              <TabBtn label="📅 Events" active={centerTab === "calendar"} onClick={() => setCenterTab("calendar")} />
              <TabBtn label="📊 COT" active={centerTab === "cot"} onClick={() => setCenterTab("cot")} />
              <TabBtn label="🔗 Korelace" active={centerTab === "corr"} onClick={() => setCenterTab("corr")} />
              <TabBtn label="📈 Sezona" active={centerTab === "seasonal"} onClick={() => setCenterTab("seasonal")} />
              <TabBtn label="🕐 Historie" active={centerTab === "history"} onClick={() => setCenterTab("history")} />
            </div>

            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

            {centerTab === "scenarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                  {["ALL", "HIGH", "MED"].map(f => (
                    <button key={f} onClick={() => setScenarioFilter(f)} style={{
                      fontSize: 9, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: scenarioFilter === f ? 700 : 400,
                      background: scenarioFilter === f ? C.accent : C.border,
                      color: scenarioFilter === f ? "#000" : C.textDim,
                      border: `1px solid ${scenarioFilter === f ? C.accent : C.border}`
                    }}>{f}</button>
                  ))}
                  <span style={{ fontSize: 9, color: C.textDim, alignSelf: "center", marginLeft: 4 }}>Klikni pro detail ▼</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...scenarios]
                  .filter(s => scenarioFilter === "ALL" || s.weight === scenarioFilter)
                  .sort((a, b) => {
                    const w = { HIGH: 3, MED: 2, LOW: 1 };
                    if (w[b.weight] !== w[a.weight]) return w[b.weight] - w[a.weight];
                    return Math.abs(b.risk_score) - Math.abs(a.risk_score);
                  })
                  .map(s => {
                    const isExp = expandedScenario === s.id;
                    const isMed = s.weight === "MED";
                    const sc = (s.risk_score || 0) > 0 ? C.green : C.red;
                    const rScore = s.risk_score || 0;
                    return (
                      <div key={s.id} style={{ border: `1px solid ${isMed ? C.border : sc + "55"}`, borderLeft: `3px solid ${isMed ? "#555" : sc}`, borderRadius: 6, background: isMed ? `${C.panel}88` : `${sc}06`, overflow: "hidden" }}>
                        <div onClick={() => setExpandedScenario(isExp ? null : s.id)} style={{ padding: isMed ? "7px 10px" : "10px 12px", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                            <div style={{ fontSize: isMed ? 10 : 11, fontWeight: isMed ? 500 : 700, color: isMed ? C.textDim : C.text, flex: 1, paddingRight: 8 }}>{s.title}</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 8, color: C.muted, background: C.border, padding: "2px 5px", borderRadius: 3 }}>{s.weight}</span>
                              <span style={{ fontSize: isMed ? 11 : 13, fontWeight: 700, color: isMed ? C.muted : sc }}>{rScore > 0 ? "+" : ""}{rScore}</span>
                              <span style={{ fontSize: 9, color: C.textDim }}>{isExp ? "▲" : "▼"}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 9, color: C.muted, marginBottom: isMed ? 2 : 5 }}>{s.summary}</div>
                          {!isMed && <ScoreBar score={rScore} />}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 8, color: C.muted }}>{s.source}</span>
                          </div>
                        </div>
                        {isExp && (
                          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 12px", background: `${C.bg}cc` }}>
                            <SectionLabel>DOPAD NA MENY</SectionLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                              {CURRENCIES.map(curr => {
                                const impact = typeof s.currency_impact === 'string' ? JSON.parse(s.currency_impact) : (s.currency_impact || {});
                                const imp = impact[curr];
                                if (!imp) return null;
                                const col = imp.score > NEUTRAL_THRESHOLD ? C.green : imp.score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                                return (
                                  <div key={curr}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                                      <span style={{ width: 26, fontSize: 9, color: C.textDim }}>{curr}</span>
                                      <div style={{ flex: 1 }}><ScoreBar score={imp.score} height={4} /></div>
                                      <span style={{ width: 32, textAlign: "right", fontSize: 9, color: col }}>{imp.score > 0 ? "+" : ""}{imp.score}</span>
                                    </div>
                                    <div style={{ fontSize: 8, color: C.muted, paddingLeft: 31, lineHeight: 1.4, marginBottom: 3 }}>{imp.reason}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {centerTab === "calendar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {events.map((ev, i) => {
                  const col = ev.impact === "HIGH" ? C.red : ev.impact === "MED" ? C.orange : C.muted;
                  return (
                    <div key={i} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, display: "inline-block" }} />
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{ev.name}</span>
                          <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3 }}>{ev.impact}</span>
                        </div>
                        <span style={{ fontSize: 10, color: C.accent }}>{ev.date || ev.event_time}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <SectionLabel>VOLATILITA OKEN (EST)</SectionLabel>
                  {volWindows.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <div style={{ width: 60, fontSize: 9, color: C.textDim }}>{w.session}</div>
                      <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${w.vol}%`, height: "100%", background: w.vol > 80 ? C.red : w.vol > 50 ? C.orange : C.muted, borderRadius: 3 }} />
                      </div>
                      <div style={{ width: 28, fontSize: 9, color: C.textDim, textAlign: "right" }}>{w.vol}%</div>
                      <div style={{ fontSize: 8, color: C.muted, width: 110 }}>{w.pairs}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {centerTab === "cot" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>CFTC Commitments of Traders — Leveraged Money pozice · stahuje se každý pátek · datum = reportovací týden (úterý)</div>
                {(() => {
                  const maxVal = Math.max(1, ...cotData.map(c => Math.max(c.long || 0, c.short || 0)));
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {cotData.map(c => {
                        const col = c.sentiment === "bullish" ? C.green : C.red;
                        const longPct = Math.round(((c.long || 0) / maxVal) * 100);
                        const shortPct = Math.round(((c.short || 0) / maxVal) * 100);
                        const dateStr = c.date ? c.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2") : "";
                        return (
                          <div key={c.currency} style={{ padding: "10px 12px", background: `${col}08`, border: `1px solid ${col}33`, borderRadius: 6 }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: col }}>{c.currency}</span>
                                <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3 }}>{c.sentiment}</span>
                              </div>
                              <span style={{ fontSize: 8, color: C.muted }}>{dateStr}</span>
                            </div>
                            {/* Long bar */}
                            <div style={{ marginBottom: 5 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                <span style={{ fontSize: 8, color: C.green }}>LONG</span>
                                <span style={{ fontSize: 8, color: C.green }}>{((c.long || 0) / 1000).toFixed(0)}K</span>
                              </div>
                              <div style={{ width: "100%", height: 5, background: C.border, borderRadius: 3 }}>
                                <div style={{ width: `${longPct}%`, height: "100%", background: C.green, borderRadius: 3 }} />
                              </div>
                            </div>
                            {/* Short bar */}
                            <div style={{ marginBottom: 7 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                <span style={{ fontSize: 8, color: C.red }}>SHORT</span>
                                <span style={{ fontSize: 8, color: C.red }}>{((c.short || 0) / 1000).toFixed(0)}K</span>
                              </div>
                              <div style={{ width: "100%", height: 5, background: C.border, borderRadius: 3 }}>
                                <div style={{ width: `${shortPct}%`, height: "100%", background: C.red, borderRadius: 3 }} />
                              </div>
                            </div>
                            {/* Net */}
                            <div style={{ fontSize: 9, fontWeight: 700, color: col, textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: 5 }}>
                              NET {c.net > 0 ? "+" : ""}{(c.net || 0).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {centerTab === "corr" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>
                  Korelacni matice menovych paru (30D rolling)
                  {correlationData && correlationData.date && (
                    <span style={{ marginLeft: 8, color: C.muted }}>
                      · {correlationData.days}D · aktuální k {correlationData.date}
                    </span>
                  )}
                  {correlationData && !correlationData.date && (
                    <span style={{ marginLeft: 8, color: C.yellow }}> · fallback data</span>
                  )}
                </div>
                {!correlationData ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>Načítám korelační data...</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
                      <thead>
                        <tr>
                          <td style={{ padding: "4px 6px", color: C.muted }}></td>
                          {correlationData.pairs.map(p => (
                            <td key={p} style={{ padding: "4px 6px", color: C.textDim, textAlign: "center", fontSize: 8 }}>{p.replace("USD", "")}</td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {correlationData.pairs.map((pair, i) => (
                          <tr key={pair}>
                            <td style={{ padding: "4px 6px", color: C.textDim, fontSize: 8 }}>{pair.replace("USD", "")}</td>
                            {correlationData.matrix[i].map((val, j) => (
                              <td key={j} style={{
                                padding: "4px 6px", textAlign: "center",
                                background: i === j ? `${C.accent}15` : val > 0.7 ? `${C.green}20` : val < -0.7 ? `${C.red}20` : "transparent",
                                color: corrColor(val), fontWeight: Math.abs(val) > 0.7 ? 700 : 400,
                              }}>{val.toFixed(2)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {centerTab === "seasonal" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 10 }}>
                  Průměrný měsíční výnos za posledních 10 let (%, live z yfinance)
                </div>
                {seasonalLive.length === 0 ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>Načítám historická data...</div>
                ) : (() => {
                  const currencies = ["USD", "EUR", "GBP", "AUD", "NZD", "JPY", "CHF", "CAD"];
                  const curColors = { USD: "#0077cc", EUR: "#4a9eff", GBP: "#9b59b6", AUD: "#e67e22", NZD: "#1abc9c", JPY: "#e74c3c", CHF: "#95a5a6", CAD: "#f39c12" };
                  return (
                    <div style={{ overflowX: "auto" }}>
                      {/* Legend */}
                      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        {currencies.map(cur => (
                          <div key={cur} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: curColors[cur] }} />
                            <span style={{ fontSize: 8, color: C.textDim }}>{cur}</span>
                          </div>
                        ))}
                        <span style={{ fontSize: 8, color: C.muted, marginLeft: 6 }}>🟢 bullish · 🔴 bearish</span>
                      </div>
                      {/* Heatmap grid */}
                      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 2, fontSize: 8 }}>
                        <thead>
                          <tr>
                            <td style={{ width: 28, color: C.muted, paddingBottom: 4 }}></td>
                            {seasonalLive.map(m => (
                              <td key={m.month} style={{ textAlign: "center", color: C.textDim, paddingBottom: 4, fontWeight: 600 }}>{m.month}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currencies.map(cur => (
                            <tr key={cur}>
                              <td style={{ color: curColors[cur], fontWeight: 700, paddingRight: 6, fontSize: 9 }}>{cur}</td>
                              {seasonalLive.map(m => {
                                const val = m[cur];
                                if (val === undefined) return <td key={m.month} style={{ textAlign: "center", color: C.muted }}>—</td>;
                                const intensity = Math.min(1, Math.abs(val) / 1.5);
                                const bg = val > 0
                                  ? `rgba(0,145,77,${0.12 + intensity * 0.55})`
                                  : `rgba(217,48,37,${0.12 + intensity * 0.55})`;
                                const textCol = val > 0 ? C.green : C.red;
                                return (
                                  <td key={m.month} style={{
                                    textAlign: "center", background: bg, borderRadius: 3,
                                    padding: "4px 2px", color: textCol, fontWeight: Math.abs(val) > 0.5 ? 700 : 400
                                  }}>
                                    {val > 0 ? "+" : ""}{val.toFixed(1)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>* hodnoty v %, průměr 10 let · zdroj: yfinance</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {centerTab === "history" && (
              <div>
                <SectionLabel>POSLEDNICH 7 DNI</SectionLabel>
                {historyData.length === 0 ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>Žádná data — data se hromadí postupně</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {historyData.map((h, i) => {
                      const col = h.score > 15 ? C.green : h.score < -15 ? C.red : C.yellow;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: `${col}08`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                          <span style={{ fontSize: 10, color: C.textDim, width: 36 }}>{h.date}</span>
                          <span style={{ fontSize: 11, fontWeight: 900, color: col, width: 36 }}>{h.score > 0 ? "+" : ""}{h.score}</span>
                          <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3, width: 58, textAlign: "center" }}>{h.label}</span>
                          <span style={{ fontSize: 9, color: C.muted, flex: 1 }}>{h.count} scénářů</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            </div>{/* /content wrapper */}
          </div>

          {/* BOTTOM tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", flexShrink: 0, height: 300, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label="Pary" active={rightTab === "pairs"} onClick={() => setRightTab("pairs")} />
              <TabBtn label="Status" active={rightTab === "status"} onClick={() => setRightTab("status")} />
              <TabBtn label="Meny" active={rightTab === "currencies"} onClick={() => setRightTab("currencies")} />
              <TabBtn label="CB Sazby" active={rightTab === "cb"} onClick={() => setRightTab("cb")} />
              <TabBtn label="Watchlist" active={rightTab === "watchlist"} onClick={() => setRightTab("watchlist")} />
            </div>

            <div style={{ padding: 14, flex: 1, overflowY: "auto", minHeight: 0 }}>

              {rightTab === "status" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}44`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 8 }}>CURRENT STATE</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: riskColor, letterSpacing: 3 }}>{riskLabel}</div>
                    <div style={{ fontSize: 9, color: C.textDim, marginTop: 8, lineHeight: 1.6 }}>
                      {sentiment.total_score > NEUTRAL_THRESHOLD ? "Trh preferuje risk assets. AUD, NZD supported."
                        : sentiment.total_score < -NEUTRAL_THRESHOLD ? "Risk aversion. JPY, CHF, Gold outperformuji."
                        : "Smisene signaly. Cekej na potvrzeni."}
                    </div>
                  </div>
                  <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}33`, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: C.red }}>⚠ RISK EVENTS</div>
                      <div style={{ fontSize: 8, color: C.textDim, background: C.border, padding: "2px 6px", borderRadius: 3 }}>pristich 48h</div>
                    </div>
                    {events.filter(e => e.impact === "HIGH").slice(0, 3).map((ev, i) => (
                      <div key={i} style={{ background: `${C.red}12`, border: `1px solid ${C.red}33`, borderRadius: 6, padding: "8px 10px", marginBottom: 6 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.red }}>{ev.name}</div>
                        <div style={{ fontSize: 9, color: C.textDim, marginTop: 3 }}>{ev.event_time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rightTab === "currencies" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <SectionLabel>CELKOVY MENOVY BIAS</SectionLabel>
                    {[...CURRENCIES].sort((a, b) => currencyTotals[b] - currencyTotals[a]).map(curr => (
                      <div key={curr} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <span style={{ width: 28, fontSize: 10, color: C.textDim }}>{curr}</span>
                        <div style={{ flex: 1 }}><ScoreBar score={currencyTotals[curr]} height={5} /></div>
                        <span style={{ width: 36, textAlign: "right", fontSize: 10, color: currencyTotals[curr] > NEUTRAL_THRESHOLD ? C.green : currencyTotals[curr] < -NEUTRAL_THRESHOLD ? C.red : C.yellow }}>
                          {currencyTotals[curr] > 0 ? "+" : ""}{currencyTotals[curr]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <SectionLabel>PREHLED BIAS</SectionLabel>
                    {[
                      { label: "🟢 Bullish", currencies: CURRENCIES.filter(c => currencyTotals[c] > NEUTRAL_THRESHOLD), color: C.green },
                      { label: "🟡 Neutral", currencies: CURRENCIES.filter(c => currencyTotals[c] >= -NEUTRAL_THRESHOLD && currencyTotals[c] <= NEUTRAL_THRESHOLD), color: C.yellow },
                      { label: "🔴 Bearish", currencies: CURRENCIES.filter(c => currencyTotals[c] < -NEUTRAL_THRESHOLD), color: C.red },
                    ].map(group => (
                      <div key={group.label} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 9, color: group.color, marginBottom: 5 }}>{group.label}</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {group.currencies.map(c => (
                            <span key={c} style={{ fontSize: 9, color: group.color, border: `1px solid ${group.color}55`, background: `${group.color}12`, padding: "2px 6px", borderRadius: 3 }}>{c}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rightTab === "pairs" && (
                <div>
                  <SectionLabel>SKORE PAR — AI FUNDAMENTAL BIAS</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { pair: "EUR/USD", base: "EUR", quote: "USD" },
                      { pair: "GBP/USD", base: "GBP", quote: "USD" },
                      { pair: "AUD/USD", base: "AUD", quote: "USD" },
                      { pair: "NZD/USD", base: "NZD", quote: "USD" },
                      { pair: "USD/JPY", base: "USD", quote: "JPY" },
                      { pair: "USD/CHF", base: "USD", quote: "CHF" },
                      { pair: "EUR/JPY", base: "EUR", quote: "JPY" },
                      { pair: "GBP/JPY", base: "GBP", quote: "JPY" },
                      { pair: "AUD/JPY", base: "AUD", quote: "JPY" },
                      { pair: "EUR/GBP", base: "EUR", quote: "GBP" },
                      { pair: "EUR/CHF", base: "EUR", quote: "CHF" },
                      { pair: "CAD/JPY", base: "CAD", quote: "JPY" },
                    ].map(({ pair, base, quote }) => {
                      const score = Math.round(currencyTotals[base] - currencyTotals[quote]);
                      const col = score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                      const direction = score > NEUTRAL_THRESHOLD ? "▲ LONG" : score < -NEUTRAL_THRESHOLD ? "▼ SHORT" : "→ NEUTRAL";
                      return (
                        <div key={pair} style={{ padding: "8px 10px", background: `${col}0a`, border: `1px solid ${col}33`, borderLeft: `3px solid ${col}`, borderRadius: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{pair}</span>
                            <span style={{ fontSize: 12, fontWeight: 900, color: col }}>{score > 0 ? "+" : ""}{score}</span>
                          </div>
                          <div style={{ marginBottom: 5 }}><ScoreBar score={score} height={4} /></div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 8, color: col, fontWeight: 700 }}>{direction}</span>
                            <span style={{ fontSize: 8, color: C.muted }}>
                              {base} {currencyTotals[base] > 0 ? "+" : ""}{currencyTotals[base]} / {quote} {currencyTotals[quote] > 0 ? "+" : ""}{currencyTotals[quote]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {rightTab === "cb" && (
                <div>
                  <SectionLabel>CENTRAL BANK TRACKER</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {centralBanks.map(cb => {
                      const biasCol = cb.bias === "hawkish" ? C.green : cb.bias === "dovish" ? C.red : C.yellow;
                      return (
                        <div key={cb.bank} style={{ padding: "8px 10px", background: `${biasCol}08`, border: `1px solid ${biasCol}22`, borderRadius: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{cb.bank}</span>
                              <span style={{ fontSize: 8, color: C.textDim }}>({cb.currency})</span>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 900, color: biasCol }}>{cb.rate}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 8, color: C.accent }}>Next: {cb.nextMeeting}</span>
                            <span style={{ fontSize: 8, color: biasCol, border: `1px solid ${biasCol}44`, padding: "1px 5px", borderRadius: 3 }}>{cb.bias}</span>
                          </div>
                          <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>Posledni: {cb.lastChange}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {rightTab === "watchlist" && (
                <div>
                  <SectionLabel>WATCHLIST — LIVE PRICES</SectionLabel>
                  {watchlistData.length === 0 ? (
                    <div style={{ fontSize: 9, color: C.muted }}>Načítám...</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {watchlistData.map((pair) => {
                        const col = pair.change > 0 ? C.green : pair.change < 0 ? C.red : C.yellow;
                        return (
                          <div key={pair.name} style={{ padding: "8px 10px", background: `${col}08`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{pair.name}</span>
                              <span style={{ fontSize: 10, color: col, fontWeight: 700 }}>
                                {pair.change > 0 ? "▲" : pair.change < 0 ? "▼" : "—"} {Math.abs(pair.change).toFixed(3)}%
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace" }}>{pair.price}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <div style={{ fontSize: 8, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 12, display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <span>⚡ AI scanning: ForexLive · FXStreet · ForexFactory · CFTC</span>
        <span>NOT FINANCIAL ADVICE — INFORMATIONAL ONLY</span>
      </div>
    </div>
    </ThemeContext.Provider>
  );
}
