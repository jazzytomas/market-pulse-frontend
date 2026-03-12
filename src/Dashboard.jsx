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
  const result = {};
  const DECAY = 0.65; // každá starší zpráva má 65% váhu té novější
  CURRENCIES.forEach((c) => {
    let weightedSum = 0;
    let totalW = 0;
    let idx = 0;
    for (const s of (list || [])) {
      const ciRaw = s.currency_impact || s.currencyImpact;
      const ci = typeof ciRaw === 'string' ? JSON.parse(ciRaw) : (ciRaw || {});
      if (ci && ci[c]) {
        const score = ci[c].score || 0;
        if (score !== 0) {
          const baseW = s.weight === "HIGH" ? 3 : s.weight === "MED" ? 1 : 0;
          if (baseW > 0) {
            const w = baseW * Math.pow(DECAY, idx); // nejnovější = plná váha
            weightedSum += score * w;
            totalW += w;
            idx++;
          }
        }
      }
    }
    result[c] = totalW > 0 ? Math.round(weightedSum / totalW) : 0;
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
  const isAdmin = typeof window !== "undefined" && window.location.search.includes("admin");
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [centralBanks, setCentralBanks] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [events, setEvents] = useState([]);
  const [sentiment, setSentiment] = useState({ total_score: 0, label: "NEUTRAL" });
  const [cotData, setCotData] = useState([]);
  const [centerTab, setCenterTab] = useState("scenarios");
  const [rightTab, setRightTab] = useState("pairs");
  const [selectedPair, setSelectedPair] = useState(null);
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [scenarioFilter, setScenarioFilter] = useState("HIGH");
  const [scanning, setScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(() => localStorage.getItem("mp_last_scan") || "--:--:--");
  const [commodities, setCommodities] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [seasonalLive, setSeasonalLive] = useState([]);
  const [seasonalYears, setSeasonalYears] = useState(10);
  const [correlationData, setCorrelationData] = useState(null);
  const [backtestData, setBacktestData] = useState(null);
  const [fearGreedData, setFearGreedData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [winW, setWinW] = useState(window.innerWidth);

  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const isMobile = winW < 1024;
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
    setSeasonalLive([]);
    fetch(`${API}/api/seasonal?years=${seasonalYears}`)
      .then(r => r.json())
      .then(data => setSeasonalLive(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [seasonalYears]);

  useEffect(() => {
    fetch(`${API}/api/correlation`)
      .then(r => r.json())
      .then(data => setCorrelationData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API}/api/backtest`)
      .then(r => r.json())
      .then(data => setBacktestData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API}/api/fear_greed`)
      .then(r => r.json())
      .then(data => setFearGreedData(data))
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
        // Aktualizuj LAST SCAN z created_at nejnovějšího scénáře (pokrývá i auto-scan)
        if (sc && sc.length > 0 && sc[0].created_at) {
          const d = new Date(sc[0].created_at + "Z"); // UTC → local
          const timeStr = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
          const stored = localStorage.getItem("mp_last_scan") || "";
          // Vezmi novější z: localStorage vs. created_at
          if (!stored || stored === "--:--:--" || timeStr > stored) {
            setLastUpdate(timeStr);
            localStorage.setItem("mp_last_scan", timeStr);
          }
        }
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
    fetch(`${API}/api/rescan`).catch(() => {});
    // Odpočet viditelný pro uživatele
    let secs = 40;
    setScanCountdown(secs);
    const tick = setInterval(() => {
      secs -= 1;
      setScanCountdown(secs);
      if (secs <= 0) clearInterval(tick);
    }, 1000);
    setTimeout(() => {
      clearInterval(tick);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      localStorage.setItem("mp_last_scan", timeStr);
      window.location.reload();
    }, 40000);
  };

  const riskColor = sentiment.total_score > NEUTRAL_THRESHOLD ? C.green : sentiment.total_score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
  const riskLabel = sentiment.total_score > NEUTRAL_THRESHOLD ? "RISK ON" : sentiment.total_score < -NEUTRAL_THRESHOLD ? "RISK OFF" : "NEUTRAL";

  const shockLabels = React.useMemo(() => {
    const labels = [];
    const highScenarios = scenarios.filter(s => s.weight === "HIGH");
    const allText = highScenarios.map(s => (s.title + " " + (s.summary || "")).toLowerCase()).join(" ");
    if (["iran","war","conflict","missile","attack","military","sanction","nato","nuclear","troops","strike","invasion","blockade","hormuz","weapon"].some(kw => allText.includes(kw)))
      labels.push({ label: "GEOPOLITICKÝ ŠOK", color: "#e74c3c" });
    if (["inflation"," cpi"," ppi","stagflat","price surge","price shock","overheating"].some(kw => allText.includes(kw)))
      labels.push({ label: "INFLAČNÍ ŠOK", color: "#1abc9c" });
    if (["supply chain","shortage","embargo","export ban","port clos","supply shock","mines in strait"].some(kw => allText.includes(kw)))
      labels.push({ label: "NABÍDKOVÝ ŠOK", color: "#9b59b6" });
    if (["tariff","trade war","section 301","trade barrier","import duty","trade probe"].some(kw => allText.includes(kw)))
      labels.push({ label: "OBCHODNÍ VÁLKA", color: "#e67e22" });
    const wti = commodities.find(c => c.name && c.name.toLowerCase().includes("wti"));
    if (wti && wti.change && wti.price) {
      const priceNum = parseFloat(String(wti.price).replace(/[^0-9.-]/g, ""));
      const prev = priceNum - wti.change;
      const pct = prev !== 0 ? (wti.change / prev) * 100 : 0;
      if (pct > 3) labels.push({ label: "ROPNÝ SKOK", color: "#f1c40f" });
      else if (pct < -3) labels.push({ label: "PÁD ROPY", color: "#2ecc71" });
    }
    return labels;
  }, [scenarios, commodities]);

  const RISK_CHAR_GLOBAL = {
    AUD: "risk_on", NZD: "risk_on", CAD: "risk_on",
    EUR: "neutral", GBP: "neutral",
    USD: "safe_haven", JPY: "safe_haven", CHF: "safe_haven"
  };

  const computeConfluenceForPair = (base, quote) => {
    const mktMode = sentiment.total_score > NEUTRAL_THRESHOLD ? "risk_on"
      : sentiment.total_score < -NEUTRAL_THRESHOLD ? "risk_off" : "neutral";
    const baseCOT = cotData.find(c => c.currency === base);
    const quoteCOT = cotData.find(c => c.currency === quote);
    const baseNet = baseCOT ? baseCOT.net : null;
    const quoteNet = quoteCOT ? quoteCOT.net : null;
    const baseTotal = baseCOT ? ((baseCOT.long || 0) + (baseCOT.short || 0)) : 0;
    const quoteTotal = quoteCOT ? ((quoteCOT.long || 0) + (quoteCOT.short || 0)) : 0;
    const baseNetPct = (baseNet !== null && baseTotal > 0) ? baseNet / baseTotal : null;
    const quoteNetPct = (quoteNet !== null && quoteTotal > 0) ? quoteNet / quoteTotal : null;
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const curMonth = MONTHS[new Date().getMonth()];
    const seasonRow = seasonalLive.find(m => m.month === curMonth);
    const baseSeas = seasonRow ? (seasonRow[base] ?? null) : null;
    const quoteSeas = seasonRow ? (seasonRow[quote] ?? null) : null;
    const baseCB = centralBanks.find(c => c.currency === base);
    const quoteCB = centralBanks.find(c => c.currency === quote);
    const baseRate = baseCB ? parseFloat(baseCB.rate) : null;
    const quoteRate = quoteCB ? parseFloat(quoteCB.rate) : null;
    const riskAlign = (() => {
      if (mktMode === "risk_on") {
        if (RISK_CHAR_GLOBAL[base] === "risk_on" && RISK_CHAR_GLOBAL[quote] !== "risk_on") return "long";
        if (RISK_CHAR_GLOBAL[quote] === "risk_on" && RISK_CHAR_GLOBAL[base] !== "risk_on") return "short";
      } else if (mktMode === "risk_off") {
        if (RISK_CHAR_GLOBAL[base] === "safe_haven" && RISK_CHAR_GLOBAL[quote] !== "safe_haven") return "long";
        if (RISK_CHAR_GLOBAL[quote] === "safe_haven" && RISK_CHAR_GLOBAL[base] !== "safe_haven") return "short";
      }
      return "neutral";
    })();
    const factors = [
      { aligns: currencyTotals[base] > currencyTotals[quote] ? "long" : currencyTotals[base] < currencyTotals[quote] ? "short" : "neutral" },
      { aligns: (baseNetPct !== null && quoteNetPct !== null) ? (baseNetPct > quoteNetPct ? "long" : baseNetPct < quoteNetPct ? "short" : "neutral") : "neutral" },
      { aligns: (baseSeas !== null && quoteSeas !== null) ? (baseSeas > quoteSeas ? "long" : baseSeas < quoteSeas ? "short" : "neutral") : "neutral" },
      { aligns: riskAlign },
      { aligns: (baseRate !== null && quoteRate !== null) ? (baseRate > quoteRate ? "long" : baseRate < quoteRate ? "short" : "neutral") : "neutral" },
    ];
    const pairScore = Math.round(currencyTotals[base] - currencyTotals[quote]);
    const longCount = factors.filter(f => f.aligns === "long").length;
    const shortCount = factors.filter(f => f.aligns === "short").length;
    const biasDir = pairScore > NEUTRAL_THRESHOLD ? "long" : pairScore < -NEUTRAL_THRESHOLD ? "short" : "neutral";
    const biasCount = biasDir === "long" ? longCount : biasDir === "short" ? shortCount : Math.max(longCount, shortCount);
    return { pairScore, biasDir, biasCount, longCount, shortCount, total: 5 };
  };

  const ALL_PAIRS = [
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
  ];

  const pairsWithConfluence = ALL_PAIRS.map(p => ({ ...p, ...computeConfluenceForPair(p.base, p.quote) }));
  const topSetups = [...pairsWithConfluence].sort((a, b) => b.biasCount - a.biasCount).slice(0, 4);

  const corrColor = (val) => {
    if (val >= 0.7) return C.green;
    if (val <= -0.7) return C.red;
    if (Math.abs(val) <= 0.3) return C.muted;
    return C.yellow;
  };

  return (
    <ThemeContext.Provider value={C}>
    <div style={{ background: C.bg, ...(isMobile ? { minHeight: "100vh" } : { height: "100vh", overflow: "hidden" }), color: C.text, fontFamily: "monospace" }}>

      {/* Header – full width */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: 4, color: C.accent }}>◈ MARKET PULSE</div>
          <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 2 }}>AI FUNDAMENTAL SENTIMENT ENGINE</div>
          {shockLabels.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 5 }}>
              {shockLabels.map(({ label, color }) => (
                <span key={label} style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: 1.5,
                  color: color, border: `1px solid ${color}`, borderRadius: 3,
                  padding: "2px 6px", background: `${color}18`
                }}>{label}</span>
              ))}
            </div>
          )}
          {isAdmin && (
            <div style={{ fontSize: 9, color: backendStatus === "ok" ? C.green : backendStatus === "checking..." ? C.yellow : C.red, marginTop: 4 }}>
              Backend: <b>{backendStatus}</b>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {isAdmin && (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: C.textDim }}>LAST SCAN</div>
                <div style={{ fontSize: 12, color: C.accent }}>{lastUpdate}</div>
              </div>
              <button onClick={runScan} disabled={scanning} style={{
                background: `${C.accent}18`, border: `1px solid ${scanning ? C.muted : C.accent}`,
                color: scanning ? C.textDim : C.accent, padding: "6px 12px", fontSize: 9,
                letterSpacing: 2, cursor: "pointer", borderRadius: 4, fontFamily: "monospace",
              }}>{scanning ? `◌ ${scanCountdown}s...` : "⟳ RESCAN"}</button>
            </>
          )}
          <button onClick={() => setDarkMode(d => !d)} title={darkMode ? "Light mode" : "Dark mode"} style={{
            background: darkMode ? "#c9a22718" : `${C.border}`, border: `1px solid ${darkMode ? "#c9a22755" : C.border}`,
            color: C.textDim, padding: "6px 9px", fontSize: 14,
            cursor: "pointer", borderRadius: 4, lineHeight: 1,
          }}>{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </div>

    <div style={{ maxWidth: 1520, margin: "0 auto", ...(isMobile ? { minHeight: "100vh", overflowX: "hidden", width: "100%" } : { height: "calc(100% - 57px)", overflow: "hidden" }), padding: 14, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "210px 1fr", gap: 12, ...(isMobile ? { width: "100%", minWidth: 0 } : { flex: 1, minHeight: 0 }) }}>

        {/* LEFT – desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <SectionLabel center>RISK SENTIMENT</SectionLabel>
              <RiskMeter score={sentiment.total_score} />
              {sentiment.vix != null && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 1 }}>VIX</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: sentiment.vix > 25 ? C.red : sentiment.vix < 15 ? C.green : C.yellow }}>{sentiment.vix.toFixed(1)}</span>
                  <span style={{ fontSize: 8, color: C.textDim }}>{sentiment.vix > 25 ? "▲ strach" : sentiment.vix < 15 ? "▼ klid" : "— neutral"}</span>
                </div>
              )}
              <div style={{ marginTop: 12, padding: "10px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <SectionLabel>MENOVY PREHLED</SectionLabel>
                {[
                  { label: "Risk ON",  currencies: ["AUD", "NZD", "CAD"] },
                  { label: "Neutral",  currencies: ["GBP", "EUR"] },
                  { label: "Risk OFF", currencies: ["USD", "JPY", "CHF"] },
                ].map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                    <span style={{ fontSize: 9, color: C.textDim, width: 54, paddingTop: 2, flexShrink: 0 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.map(c => {
                        const score = currencyTotals[c] || 0;
                        const isDark = C.bg === "#0a0a12";
                        const col = isDark ? (score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow) : C.text;
                        return <span key={c} style={{ fontSize: 9, color: col, border: `1px solid ${col}55`, background: `${col}12`, padding: "1px 5px", borderRadius: 3 }}>{c}</span>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Commodities – back in desktop sidebar */}
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", flex: 1, overflowY: "auto", minHeight: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 3 }}>KOMODITY</div>
              <div style={{ fontSize: 7, color: C.muted, marginBottom: 8 }}>měny = korelované &nbsp;·&nbsp; dnes = signál</div>
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
        )}

        {/* RIGHT / mobile-full */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, ...(isMobile ? {} : { minHeight: 0 }) }}>

        {/* Mobile: Risk Sentiment strip – gauge vlevo, VIX nahoře + měny dole vpravo */}
        {isMobile && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "stretch", gap: 12 }}>
            {/* Levý sloupec: gauge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 2 }}>RISK SENTIMENT</div>
              <RiskMeter score={sentiment.total_score} />
            </div>
            {/* Pravý sloupec: VIX nahoře, měny dole */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {sentiment.vix != null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 8, color: C.textDim, letterSpacing: 1 }}>VIX</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: sentiment.vix > 25 ? C.red : sentiment.vix < 15 ? C.green : C.yellow }}>{sentiment.vix.toFixed(1)}</span>
                  <span style={{ fontSize: 8, color: C.textDim }}>{sentiment.vix > 25 ? "▲ strach" : sentiment.vix < 15 ? "▼ klid" : "— neutral"}</span>
                </div>
              )}
              <div style={{ flex: 1, padding: "6px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 5 }}>MĚNOVÝ PŘEHLED</div>
                {[
                  { label: "Risk ON",  currencies: ["AUD", "NZD", "CAD"] },
                  { label: "Neutral",  currencies: ["GBP", "EUR"] },
                  { label: "Risk OFF", currencies: ["USD", "JPY", "CHF"] },
                ].map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: C.textDim, width: 50, flexShrink: 0 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.map(c => {
                        const score = currencyTotals[c] || 0;
                        const isDark = C.bg === "#0a0a12";
                        const col = isDark ? (score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow) : C.text;
                        return <span key={c} style={{ fontSize: 9, color: col, border: `1px solid ${col}55`, background: `${col}12`, padding: "1px 5px", borderRadius: 3 }}>{c}</span>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* CENTER tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", ...(isMobile ? { minHeight: 400, order: 2 } : { flex: 1, minHeight: 0 }) }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label="⚡ Scenarios" active={centerTab === "scenarios"} onClick={() => setCenterTab("scenarios")} />
              <TabBtn label="📅 Events" active={centerTab === "calendar"} onClick={() => setCenterTab("calendar")} />
              <TabBtn label="📊 COT" active={centerTab === "cot"} onClick={() => setCenterTab("cot")} />
              <TabBtn label="🔗 Korelace" active={centerTab === "corr"} onClick={() => setCenterTab("corr")} />
              <TabBtn label="📈 Sezona" active={centerTab === "seasonal"} onClick={() => setCenterTab("seasonal")} />
              <TabBtn label="🕐 Historie" active={centerTab === "history"} onClick={() => setCenterTab("history")} />
              <TabBtn label="😱 Fear&Greed" active={centerTab === "feargreed"} onClick={() => setCenterTab("feargreed")} />
              <TabBtn label="🎯 Backtest" active={centerTab === "backtest"} onClick={() => setCenterTab("backtest")} />
              <TabBtn label="📖 Průvodce" active={centerTab === "guide"} onClick={() => setCenterTab("guide")} />
            </div>

            <div style={{ ...(isMobile ? {} : { flex: 1, overflowY: "auto", minHeight: 0 }) }}>

            {centerTab === "scenarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                  {["HIGH", "MED", "STARŠÍ"].map(f => (
                    <button key={f} onClick={() => setScenarioFilter(f)} style={{
                      fontSize: 9, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: scenarioFilter === f ? 700 : 400,
                      background: scenarioFilter === f ? (f === "STARŠÍ" ? C.border : C.accent) : C.border,
                      color: scenarioFilter === f ? (f === "STARŠÍ" ? C.textDim : "#000") : C.textDim,
                      border: `1px solid ${scenarioFilter === f ? (f === "STARŠÍ" ? C.textDim : C.accent) : C.border}`
                    }}>{f}</button>
                  ))}
                  <span style={{ fontSize: 9, color: C.textDim, alignSelf: "center", marginLeft: 4 }}>Klikni pro detail ▼</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const sorted = [...scenarios].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                  const newest10 = sorted.slice(0, 10);
                  const older10 = sorted.slice(10, 20);
                  const list = scenarioFilter === "STARŠÍ"
                    ? older10.filter(s => s.weight === "HIGH")
                    : newest10.filter(s => s.weight === scenarioFilter);
                  return list.map(s => {
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
                              <span style={{ fontSize: 8, color: s.weight === "HIGH" ? "#000" : C.muted, background: s.weight === "HIGH" ? "#c9a227" : C.border, fontWeight: s.weight === "HIGH" ? 700 : 400, padding: "2px 5px", borderRadius: 3 }}>{s.weight}</span>
                              <span style={{ fontSize: isMed ? 11 : 13, fontWeight: 700, color: isMed ? C.muted : sc }}>{rScore > 0 ? "+" : ""}{rScore}</span>
                              <span style={{ fontSize: 9, color: C.textDim }}>{isExp ? "▲" : "▼"}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 9, color: C.muted, marginBottom: isMed ? 2 : 5 }}>{s.summary}</div>
                          {!isMed && <ScoreBar score={rScore} />}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 8, color: C.muted }}>{s.source}</span>
                            {s.created_at && <span style={{ fontSize: 8, color: C.muted }}>{new Date(s.created_at + "Z").toLocaleString("cs-CZ", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>}
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
                  });
                })()}
                </div>
              </div>
            )}

            {centerTab === "calendar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {isAdmin && (
                  <button onClick={() => fetch(`${API}/api/rescan_events`)} style={{
                    background: `${C.accent}18`, border: `1px solid ${C.accent}`,
                    color: C.accent, padding: "5px 10px", fontSize: 9,
                    letterSpacing: 2, cursor: "pointer", borderRadius: 4, fontFamily: "monospace", alignSelf: "flex-end",
                  }}>⟳ RESCAN EVENTS</button>
                )}
                {events.map((ev, i) => {
                  const col = ev.impact === "HIGH" ? C.red : ev.impact === "MED" ? C.orange : C.muted;
                  const hasActual = ev.actual && ev.actual.trim() !== "";
                  const actualColor = (() => {
                    if (!hasActual || !ev.forecast || ev.forecast.trim() === "") return C.text;
                    const a = parseFloat(ev.actual);
                    const f = parseFloat(ev.forecast);
                    if (isNaN(a) || isNaN(f)) return C.text;
                    return a > f ? C.green : a < f ? C.red : C.yellow;
                  })();
                  const fmtTime = (() => {
                    try {
                      const d = new Date(ev.event_time);
                      if (isNaN(d)) return ev.event_time;
                      const day = d.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" });
                      const time = d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
                      return `${day} ${time}`;
                    } catch { return ev.event_time; }
                  })();
                  return (
                    <div key={i} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, display: "inline-block" }} />
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{ev.name}</span>
                          <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3 }}>{ev.impact}</span>
                        </div>
                        <span style={{ fontSize: 10, color: C.accent }}>{fmtTime}</span>
                      </div>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 7, color: C.textDim, letterSpacing: 1 }}>FORECAST</span>
                          <span style={{ fontSize: 10, color: C.text }}>{ev.forecast && ev.forecast.trim() ? ev.forecast : "—"}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 7, color: C.textDim, letterSpacing: 1 }}>ACTUAL</span>
                          <span style={{ fontSize: 10, fontWeight: hasActual ? 700 : 400, color: hasActual ? actualColor : C.muted }}>{hasActual ? ev.actual : "—"}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontSize: 7, color: C.textDim, letterSpacing: 1 }}>PREVIOUS</span>
                          <span style={{ fontSize: 10, color: C.muted }}>{ev.previous && ev.previous.trim() ? ev.previous : "—"}</span>
                        </div>
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
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, color: C.textDim }}>Průměrný měsíční výnos za posledních</span>
                  {[1, 3, 5, 10].map(y => (
                    <button key={y} onClick={() => setSeasonalYears(y)} style={{
                      fontSize: 9, padding: "2px 8px", borderRadius: 4, cursor: "pointer",
                      fontWeight: seasonalYears === y ? 700 : 400,
                      background: seasonalYears === y ? C.accent : C.border,
                      color: seasonalYears === y ? "#000" : C.textDim,
                      border: `1px solid ${seasonalYears === y ? C.accent : C.border}`
                    }}>{y}R</button>
                  ))}
                  <span style={{ fontSize: 9, color: C.textDim }}>(%, live z yfinance)</span>
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
                      <div style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>* hodnoty v %, průměr {seasonalYears} {seasonalYears === 1 ? "rok" : seasonalYears < 5 ? "roky" : "let"} · zdroj: yfinance</div>
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

            {centerTab === "feargreed" && (() => {
              const fgColor = (v) => v <= 20 ? C.red : v <= 40 ? C.orange : v <= 60 ? C.yellow : v <= 80 ? "#7ec850" : C.green;
              const FGGauge = ({ label, icon, data }) => {
                if (!data) return (
                  <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: C.textDim, marginBottom: 12 }}>{label}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>Načítám...</div>
                  </div>
                );
                const col = fgColor(data.value);
                const pct = data.value;
                // SVG arc gauge – polooblouk, 0% vlevo, 100% vpravo, oblouk nahoře
                const r = 52, cx = 70, cy = 70, sw = 12;
                // Převod procent na endpoint: úhel π (vlevo) → 0 (vpravo)
                const angle = Math.PI * (1 - pct / 100);
                const ex = cx + r * Math.cos(angle);
                const ey = cy - r * Math.sin(angle); // SVG y je dolů, proto minus
                return (
                  <div style={{ background: C.bg, border: `1px solid ${col}44`, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: C.textDim, marginBottom: 8 }}>{label}</div>
                    <svg width="140" height="82" viewBox="0 0 140 82" style={{ overflow: "visible" }}>
                      {/* Background arc: vlevo → vpravo, po směru hodinových ručiček = nahoře */}
                      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none" stroke={C.border} strokeWidth={sw} strokeLinecap="round" />
                      {/* Value arc: vždy large=0, sweep=1 (po hodinových ručičkách = nahoru) */}
                      {pct > 0 && <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`}
                        fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" />}
                      {/* Value text */}
                      <text x={cx} y={cy - 6} textAnchor="middle" fill={col} fontSize="22" fontWeight="900" fontFamily="monospace">{pct}</text>
                      {/* Labels */}
                      <text x={cx - r} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize="7">0</text>
                      <text x={cx + r} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize="7">100</text>
                    </svg>
                    <div style={{ fontSize: 12, fontWeight: 900, color: col, marginTop: -4 }}>{data.label}</div>
                    {data.vix && <div style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>VIX {data.vix}</div>}
                  </div>
                );
              };
              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <FGGauge label="FOREX" icon="💱" data={fearGreedData?.forex} />
                    <FGGauge label="AKCIE (S&P 500)" icon="📈" data={fearGreedData?.stocks} />
                    <FGGauge label="KRYPTO" icon="₿" data={fearGreedData?.crypto} />
                  </div>
                  <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                      {[["0–20","Extreme Fear",C.red],["21–40","Fear",C.orange],["41–60","Neutral",C.yellow],["61–80","Greed","#7ec850"],["81–100","Extreme Greed",C.green]].map(([range, lbl, col]) => (
                        <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                          <span style={{ fontSize: 8, color: C.textDim }}>{range} {lbl}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>
                      Forex = náš AI sentiment + VIX · Akcie = VIX + S&P momentum · Krypto = alternative.me · cache 15 min
                    </div>
                  </div>
                </div>
              );
            })()}

            {centerTab === "backtest" && (
              <div>
                {!backtestData || backtestData.total === 0 ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "30px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>⏳</div>
                    Data se hromadí – backtest potřebuje min. 24h na první výsledky.<br/>
                    <span style={{ fontSize: 8 }}>Každou hodinu se ukládají vstupní ceny, po 24h se vyhodnocuje přesnost.</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Overall stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { label: "CELKOVÁ PŘESNOST", value: `${backtestData.accuracy}%`, color: backtestData.accuracy >= 55 ? C.green : backtestData.accuracy >= 45 ? C.yellow : C.red },
                        { label: "SPRÁVNĚ", value: `${backtestData.correct} / ${backtestData.total}`, color: C.text },
                        { label: "VYHODNOCENO", value: `${backtestData.total} predikcí`, color: C.textDim },
                      ].map(s => (
                        <div key={s.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: C.textDim, letterSpacing: 2, marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Per currency */}
                    {backtestData.per_currency && backtestData.per_currency.length > 0 && (
                      <div>
                        <SectionLabel>PŘESNOST PER MĚNA</SectionLabel>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                          {backtestData.per_currency.map(c => {
                            const acc = c.total > 0 ? Math.round(c.correct / c.total * 100) : 0;
                            const col = acc >= 55 ? C.green : acc >= 45 ? C.yellow : C.red;
                            return (
                              <div key={c.currency} style={{ background: `${col}0a`, border: `1px solid ${col}33`, borderRadius: 6, padding: "8px", textAlign: "center" }}>
                                <div style={{ fontSize: 11, fontWeight: 900, color: col }}>{c.currency}</div>
                                <div style={{ fontSize: 14, fontWeight: 900, color: col }}>{acc}%</div>
                                <div style={{ fontSize: 8, color: C.muted }}>{c.correct}/{c.total} · ø{c.avg_move}%</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Recent predictions */}
                    {backtestData.recent && backtestData.recent.length > 0 && (
                      <div>
                        <SectionLabel>POSLEDNÍ PREDIKCE</SectionLabel>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {backtestData.recent.slice(0, 15).map((r, i) => {
                            const aiCol = r.ai_score > 0 ? C.green : C.red;
                            const resCol = r.correct === 1 ? C.green : C.red;
                            const resEmoji = r.correct === 1 ? "✅" : "❌";
                            return (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: `${resCol}06`, border: `1px solid ${C.border}`, borderRadius: 5 }}>
                                <span style={{ fontSize: 11 }}>{resEmoji}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: C.text, width: 28 }}>{r.currency}</span>
                                <span style={{ fontSize: 9, color: aiCol, width: 32 }}>AI {r.ai_score > 0 ? "+" : ""}{r.ai_score}</span>
                                <span style={{ fontSize: 9, color: r.actual_pct > 0 ? C.green : C.red, width: 44 }}>
                                  trh {r.actual_pct > 0 ? "+" : ""}{r.actual_pct?.toFixed(2)}%
                                </span>
                                <span style={{ fontSize: 8, color: C.muted, flex: 1 }} title={r.title}>{r.title?.slice(0, 45)}{r.title?.length > 45 ? "…" : ""}</span>
                                <span style={{ fontSize: 8, color: C.textDim, flexShrink: 0 }}>{r.weight}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {centerTab === "guide" && (() => {
              const Section = ({ emoji, title, children }) => (
                <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: C.accent, letterSpacing: 2, marginBottom: 10 }}>{emoji} {title}</div>
                  {children}
                </div>
              );
              const Row = ({ label, desc }) => (
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.text, minWidth: 110, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 9, color: C.textDim, lineHeight: 1.5 }}>{desc}</span>
                </div>
              );
              return (
                <div style={{ fontSize: 9, lineHeight: 1.6 }}>

                  <Section emoji="🌡️" title="RISK SENTIMENT">
                    <Row label="Co to je" desc="Celkové nálada trhu vůči riziku. Vypočítává se jako vážený průměr AI skóre zpráv + VIX index." />
                    <Row label="Škála" desc="+100 = maximální Risk ON (trhy rostou, investoři kupují riziková aktiva). −100 = maximální Risk OFF (strach, útěk do bezpečí)." />
                    <Row label="VIX" desc="Index strachu. VIX nad 25 = strach na trhu (Risk OFF). VIX pod 15 = klid (Risk ON). Váha 2× HIGH zpráva." />
                    <Row label="Jak použít" desc="Risk ON → sleduj AUD, NZD, CAD. Risk OFF → sleduj USD, JPY, CHF. Neutral → čekej na potvrzení." />
                  </Section>

                  <Section emoji="⚡" title="SCÉNÁŘE">
                    <Row label="Co to jsou" desc="AI (Claude Haiku) ohodnotí každou forex-relevantní zprávu skóre a dopadem na každou měnu." />
                    <Row label="Risk score" desc="−100 až +100. Kladné = pozitivní pro trhy (Risk ON). Záporné = negativní (Risk OFF)." />
                    <Row label="HIGH váha" desc="Market-moving zprávy: NFP, rozhodnutí CB, geopolitické šoky. Počítají se 3× do sentimentu." />
                    <Row label="MED váha" desc="Důležité ale ne market-moving: komentáře CB, regionální data. Počítají se 1× do sentimentu." />
                    <Row label="LOW váha" desc="Pozadí a kontext. Do risk sentimentu se nezapočítávají." />
                    <Row label="Filtr" desc="Tlačítka HIGH / MED přepínají seznam. Kliknutím na zprávu zobrazíš dopad na každou měnu." />
                  </Section>

                  <Section emoji="📅" title="EVENTS (EKONOMICKÝ KALENDÁŘ">
                    <Row label="Co to je" desc="Ekonomické události z ForexFactory pro aktuální týden. Aktualizuje se každou hodinu." />
                    <Row label="🔴 HIGH" desc="Silně market-moving: NFP, CPI, rozhodnutí Fedu/ECB/BOJ, HDP. Očekávej velké pohyby (50+ pips)." />
                    <Row label="🟡 MED" desc="Střední dopad: PMI, obchodní bilance, výroky bankéřů. Pohyby 10–30 pips." />
                    <Row label="Volatilita oken" desc="Typická volatilita podle obchodní seance (Tokio, Londýn, NY). Nejsilnější = overlap Londýn+NY (13–17h CET)." />
                  </Section>

                  <Section emoji="📊" title="COT (COMMITMENTS OF TRADERS)">
                    <Row label="Co to je" desc="Týdenní report CFTC o pozicích velkých hráčů (hedge fondy = Leveraged Money) na futures trzích." />
                    <Row label="Datum" desc="Datum = úterý reportovacího týdne (kdy se data uzavřou). CFTC publikuje v pátek, stahujeme automaticky." />
                    <Row label="LONG" desc="Počet long kontraktů (sázka na posílení měny)." />
                    <Row label="SHORT" desc="Počet short kontraktů (sázka na oslabení měny)." />
                    <Row label="NET" desc="Long − Short. Kladný NET = trh sází na posílení. Záporný = slabost. Extrémní hodnoty = možný obrat." />
                    <Row label="Jak použít" desc="Sleduj trend NET pozic. Extrémy (velmi high/low) signalizují přeprodanost. USD je syntetický (inverzní součet ostatních)." />
                  </Section>

                  <Section emoji="🔗" title="KORELACE">
                    <Row label="Co to je" desc="30denní Pearsonova korelace mezi 6 hlavními páry. Live data z yfinance." />
                    <Row label="+1.0" desc="Páry se pohybují identicky. Přidáním obou otevíráš dvojnásobné riziko." />
                    <Row label="−1.0" desc="Páry jdou přesně opačně. Hedge: long jeden, short druhý = minimální riziko." />
                    <Row label="0.0" desc="Žádná korelace. Páry se pohybují nezávisle." />
                    <Row label="Jak použít" desc="Nekumuluj vysoce korelované pozice (EUR/USD + GBP/USD). Inverzní korelace (EUR/USD + USD/JPY) lze hedgovat." />
                  </Section>

                  <Section emoji="📈" title="SEZÓNNOST">
                    <Row label="Co to je" desc="Průměrný měsíční výnos měn za zvolené období (1/3/5/10 let). Historický vzor opakující se každý rok." />
                    <Row label="🟢 Zelená" desc="Měna historicky v daném měsíci posilovala (kladný průměrný výnos)." />
                    <Row label="🔴 Červená" desc="Měna historicky v daném měsíci oslabovala (záporný průměrný výnos)." />
                    <Row label="Jak použít" desc="Sezónnost je doplňkový nástroj. Silný sezónní vzor + potvrzení od COT + sentimentu = silnější signál." />
                    <Row label="Pozor" desc="Minulé výnosy nezaručují budoucí. Sezónnost funguje nejlépe jako filtr, ne jako hlavní signál." />
                  </Section>

                  <Section emoji="🕐" title="HISTORIE SENTIMENTU">
                    <Row label="Co to je" desc="7denní přehled denního risk sentimentu. Ukládá se do DB každý den." />
                    <Row label="Jak použít" desc="Sleduj trend. Pokud sentiment klesá 3+ dny po sobě → Risk OFF trend. Rychlý obrat → možný sentiment shift." />
                  </Section>

                  <Section emoji="😱" title="FEAR & GREED INDEX">
                    <Row label="Co to je" desc="Kompozitní index strachu a chamtivosti trhu na škále 0–100. Nízká hodnota = strach, vysoká = chamtivost." />
                    <Row label="💱 Forex F&G" desc="Vypočítán z našeho AI sentimentu (65%) + VIX (35%). Normalizován na 0–100." />
                    <Row label="📈 Akcie F&G" desc="VIX index strachu (60%) + S&P 500 momentum vůči 125dennímu průměru (40%)." />
                    <Row label="₿ Krypto F&G" desc="Oficiální index z alternative.me. Zahrnuje volatilitu, momentum, sociální média a dominanci Bitcoinu." />
                    <Row label="0–20 Extreme Fear" desc="Trh v panice. Historicky dobrá příležitost k nákupu (contrarian)." />
                    <Row label="80–100 Extreme Greed" desc="Trh přehřátý, investoři příliš optimistični. Zvýšené riziko korekce." />
                    <Row label="Jak použít" desc="Porovnej Fear&Greed napříč trhy. Pokud krypto Extreme Fear ale Forex Greed → diverzifikace signálů." />
                  </Section>

                  <Section emoji="🛢️" title="KOMODITY">
                    <Row label="Co to je" desc="Live ceny 7 komodit z yfinance. Aktualizuje se každých 5 minut." />
                    <Row label="▲/▼ % změna" desc="Dnešní procentuální pohyb ceny komodity oproti předchozímu dni." />
                    <Row label="koreluje:" desc="Měny, které historicky reagují na pohyb dané komodity. Např. CAD ↑ = když roste WTI ropa, CAD má tendenci posilovat (Kanada je exportér ropy)." />
                    <Row label="dnes: risk on/off" desc="Risk signál odvozený z dnešního pohybu ceny. Ropa ↑ = risk on (ekonomika roste, chuť riskovat). Zlato ↑ = risk off (trh hledá bezpečí). Neutral = pohyb je nevýrazný." />
                  </Section>

                  <Section emoji="💱" title="MĚNOVÝ BIAS A PÁRY">
                    <Row label="Celkový bias" desc="Vážený průměr AI dopadů posledních zpráv na každou měnu. Novější zprávy mají větší váhu (exponenciální decay)." />
                    <Row label="Páry (Pary tab)" desc="Skóre páru = bias základní měny − bias kótovací měny. Kladné = buy signál, záporné = sell signál." />
                    <Row label="Risk ON měny" desc="AUD, NZD, CAD — posilují při dobré náladě trhů (risk appetite)." />
                    <Row label="Risk OFF měny" desc="USD, JPY, CHF — safe haven, posilují při strachu a nejistotě." />
                    <Row label="Neutral" desc="EUR, GBP — smíšené charakteristiky, závisí na domácí ekonomice." />
                  </Section>

                  <div style={{ fontSize: 8, color: C.muted, textAlign: "center", paddingTop: 4 }}>
                    Data se aktualizují automaticky každou hodinu · COT každý pátek · Sezónnost každých 24h
                  </div>

                </div>
              );
            })()}

            </div>{/* /content wrapper */}
          </div>

          {/* TOP SETUPS strip */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", flexShrink: 0, ...(isMobile ? { order: 1 } : {}) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, flexShrink: 0 }}>TOP SETUPY:</span>
              {topSetups.map(p => {
                const col = p.biasDir === "long" ? C.green : p.biasDir === "short" ? C.red : C.yellow;
                const arrow = p.biasDir === "long" ? "▲" : p.biasDir === "short" ? "▼" : "→";
                const isPerfect = p.biasCount === 5;
                const PERFECT_BLUE = "#1864dc";
                const isDark = C.bg === "#0a0a12";
                return (
                  <div key={p.pair} onClick={() => { setRightTab("pairs"); setSelectedPair({ pair: p.pair, base: p.base, quote: p.quote }); }}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 4, cursor: "pointer",
                      background: isPerfect ? "rgba(24, 100, 220, 0.2)" : `${col}0f`,
                      border: isPerfect ? `1.5px solid ${PERFECT_BLUE}` : `1px solid ${col}44`,
                      animation: isPerfect ? "pulse 2s infinite" : "none" }}>
                    {isPerfect && <span style={{ fontSize: 9 }}>⚡</span>}
                    <span style={{ fontSize: 10, fontWeight: 700, color: isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : C.text }}>{p.pair}</span>
                    <span style={{ fontSize: 9, color: col }}>{arrow}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : col }}>{p.biasCount}/5</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", ...(isMobile ? {} : { flexShrink: 0, height: 300 }) }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label="Pary" active={rightTab === "pairs"} onClick={() => setRightTab("pairs")} />
              <TabBtn label="Status" active={rightTab === "status"} onClick={() => setRightTab("status")} />
              <TabBtn label="Meny" active={rightTab === "currencies"} onClick={() => setRightTab("currencies")} />
              <TabBtn label="CB Sazby" active={rightTab === "cb"} onClick={() => setRightTab("cb")} />
              <TabBtn label="Watchlist" active={rightTab === "watchlist"} onClick={() => setRightTab("watchlist")} />
            </div>

            <div style={{ padding: 14, ...(isMobile ? {} : { flex: 1, overflowY: "auto", minHeight: 0 }) }}>

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

              {rightTab === "pairs" && (() => {
                const PAIRS_LIST = [
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
                ];
                const RISK_CHAR = {
                  AUD: "risk_on", NZD: "risk_on", CAD: "risk_on",
                  EUR: "neutral", GBP: "neutral",
                  USD: "safe_haven", JPY: "safe_haven", CHF: "safe_haven"
                };
                const RISK_CHAR_LABEL = { risk_on: "Risk ON", safe_haven: "Safe Haven", neutral: "Neutrální" };

                if (selectedPair) {
                  const { pair, base, quote } = selectedPair;
                  const pairScore = Math.round(currencyTotals[base] - currencyTotals[quote]);
                  const pairCol = pairScore > NEUTRAL_THRESHOLD ? C.green : pairScore < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                  const pairBias = pairScore > NEUTRAL_THRESHOLD ? "▲ NÁKUP (Long)" : pairScore < -NEUTRAL_THRESHOLD ? "▼ PRODEJ (Short)" : "→ NEUTRÁLNÍ (Neutral)";

                  const baseCOT = cotData.find(c => c.currency === base);
                  const quoteCOT = cotData.find(c => c.currency === quote);
                  const baseNet = baseCOT ? baseCOT.net : null;
                  const quoteNet = quoteCOT ? quoteCOT.net : null;
                  const baseTot = baseCOT ? ((baseCOT.long || 0) + (baseCOT.short || 0)) : 0;
                  const quoteTot = quoteCOT ? ((quoteCOT.long || 0) + (quoteCOT.short || 0)) : 0;
                  const baseNetPct = (baseNet !== null && baseTot > 0) ? baseNet / baseTot : null;
                  const quoteNetPct = (quoteNet !== null && quoteTot > 0) ? quoteNet / quoteTot : null;

                  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const curMonth = MONTHS[new Date().getMonth()];
                  const seasonRow = seasonalLive.find(m => m.month === curMonth);
                  const baseSeas = seasonRow ? (seasonRow[base] ?? null) : null;
                  const quoteSeas = seasonRow ? (seasonRow[quote] ?? null) : null;

                  const baseCB = centralBanks.find(c => c.currency === base);
                  const quoteCB = centralBanks.find(c => c.currency === quote);
                  const baseRate = baseCB ? parseFloat(baseCB.rate) : null;
                  const quoteRate = quoteCB ? parseFloat(quoteCB.rate) : null;

                  const mktMode = sentiment.total_score > NEUTRAL_THRESHOLD ? "risk_on"
                    : sentiment.total_score < -NEUTRAL_THRESHOLD ? "risk_off" : "neutral";

                  const riskAligns = (() => {
                    if (mktMode === "risk_on") {
                      if (RISK_CHAR[base] === "risk_on" && RISK_CHAR[quote] !== "risk_on") return "long";
                      if (RISK_CHAR[quote] === "risk_on" && RISK_CHAR[base] !== "risk_on") return "short";
                    } else if (mktMode === "risk_off") {
                      if (RISK_CHAR[base] === "safe_haven" && RISK_CHAR[quote] !== "safe_haven") return "long";
                      if (RISK_CHAR[quote] === "safe_haven" && RISK_CHAR[base] !== "safe_haven") return "short";
                    }
                    return "neutral";
                  })();
                  const riskFavors = riskAligns === "long" ? base : riskAligns === "short" ? quote : null;

                  const factors = [
                    {
                      label: "Sentiment zpráv (News Sentiment)",
                      baseVal: `${currencyTotals[base] > 0 ? "+" : ""}${currencyTotals[base]}`,
                      quoteVal: `${currencyTotals[quote] > 0 ? "+" : ""}${currencyTotals[quote]}`,
                      aligns: currencyTotals[base] > currencyTotals[quote] ? "long" : currencyTotals[base] < currencyTotals[quote] ? "short" : "neutral",
                      favors: currencyTotals[base] !== currencyTotals[quote] ? (currencyTotals[base] > currencyTotals[quote] ? base : quote) : null,
                    },
                    {
                      label: "COT Report (Spekulanti) — % z open interest",
                      baseVal: baseNetPct !== null ? `${(baseNetPct * 100).toFixed(1)}%` : "—",
                      quoteVal: quoteNetPct !== null ? `${(quoteNetPct * 100).toFixed(1)}%` : "—",
                      aligns: (baseNetPct !== null && quoteNetPct !== null) ? (baseNetPct > quoteNetPct ? "long" : baseNetPct < quoteNetPct ? "short" : "neutral") : "neutral",
                      favors: (baseNetPct !== null && quoteNetPct !== null && baseNetPct !== quoteNetPct) ? (baseNetPct > quoteNetPct ? base : quote) : null,
                    },
                    {
                      label: "Sezóna (Seasonality) — " + curMonth,
                      baseVal: baseSeas !== null ? `${baseSeas > 0 ? "+" : ""}${baseSeas.toFixed(1)}%` : "—",
                      quoteVal: quoteSeas !== null ? `${quoteSeas > 0 ? "+" : ""}${quoteSeas.toFixed(1)}%` : "—",
                      aligns: (baseSeas !== null && quoteSeas !== null) ? (baseSeas > quoteSeas ? "long" : baseSeas < quoteSeas ? "short" : "neutral") : "neutral",
                      favors: (baseSeas !== null && quoteSeas !== null && baseSeas !== quoteSeas) ? (baseSeas > quoteSeas ? base : quote) : null,
                    },
                    {
                      label: "Tržní nálada (Risk Sentiment) — " + (mktMode === "risk_on" ? "RISK ON" : mktMode === "risk_off" ? "RISK OFF" : "NEUTRAL"),
                      baseVal: RISK_CHAR_LABEL[RISK_CHAR[base]],
                      quoteVal: RISK_CHAR_LABEL[RISK_CHAR[quote]],
                      aligns: riskAligns,
                      favors: riskFavors,
                    },
                    {
                      label: "Carry Trade (CB Sazby / Interest Rates)",
                      baseVal: baseRate !== null ? `${baseRate.toFixed(2)}%` : "—",
                      quoteVal: quoteRate !== null ? `${quoteRate.toFixed(2)}%` : "—",
                      aligns: (baseRate !== null && quoteRate !== null) ? (baseRate > quoteRate ? "long" : baseRate < quoteRate ? "short" : "neutral") : "neutral",
                      favors: (baseRate !== null && quoteRate !== null && baseRate !== quoteRate) ? (baseRate > quoteRate ? base : quote) : null,
                    },
                  ];

                  const longCount = factors.filter(f => f.aligns === "long").length;
                  const shortCount = factors.filter(f => f.aligns === "short").length;
                  const biasCount = pairScore > NEUTRAL_THRESHOLD ? longCount : pairScore < -NEUTRAL_THRESHOLD ? shortCount : Math.max(longCount, shortCount);
                  const confluenceCol = biasCount >= 4 ? C.green : biasCount >= 3 ? C.yellow : C.red;

                  return (
                    <div>
                      <button onClick={() => setSelectedPair(null)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 9, marginBottom: 10 }}>← Zpět (Back)</button>

                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: C.text, letterSpacing: 1 }}>{pair}</div>
                          <div style={{ fontSize: 8, color: C.muted }}>{base} základní · {quote} kótovací</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 26, fontWeight: 900, color: pairCol, lineHeight: 1 }}>{pairScore > 0 ? "+" : ""}{pairScore}</div>
                          <div style={{ fontSize: 9, color: pairCol, fontWeight: 700 }}>{pairBias}</div>
                        </div>
                      </div>

                      <div style={{ background: `${confluenceCol}12`, border: `1px solid ${confluenceCol}40`, borderRadius: 6, padding: "7px 10px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: C.text }}>SHODA FAKTORŮ (Confluence)</div>
                          <div style={{ fontSize: 8, color: C.muted }}>Kolik faktorů podporuje aktuální bias</div>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: confluenceCol }}>{biasCount}<span style={{ fontSize: 12, color: C.muted }}>/{factors.length}</span></div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {factors.map((f, i) => {
                          const alCol = f.aligns === "long" ? C.green : f.aligns === "short" ? C.red : C.yellow;
                          const icon = f.aligns === "long" ? "✓" : f.aligns === "short" ? "✗" : "—";
                          return (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 52px 1fr", gap: 4, alignItems: "center", padding: "6px 8px", background: `${alCol}08`, border: `1px solid ${alCol}22`, borderRadius: 5 }}>
                              <div>
                                <div style={{ fontSize: 7, color: C.muted, marginBottom: 2 }}>{f.label}</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{f.baseVal}</div>
                                <div style={{ fontSize: 7, color: C.textDim }}>{base}</div>
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 13, color: alCol, fontWeight: 900 }}>{icon}</div>
                                <div style={{ fontSize: 6, color: alCol, lineHeight: 1.2 }}>{f.favors ? `→ ${f.favors}` : "neutr."}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 7, color: C.muted, marginBottom: 2 }}>&nbsp;</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{f.quoteVal}</div>
                                <div style={{ fontSize: 7, color: C.textDim }}>{quote}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ fontSize: 7, color: C.muted, marginTop: 7 }}>✓ podporuje nákup · ✗ podporuje prodej · — neutrální</div>

                      {/* HISTORICKÝ SCORE (mini chart) */}
                      {(() => {
                        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        const days = {};
                        scenarios.forEach(s => {
                          const d = s.created_at ? s.created_at.split("T")[0] : null;
                          if (!d) return;
                          if (!days[d]) days[d] = [];
                          days[d].push(s);
                        });
                        const dayKeys = Object.keys(days).sort();
                        if (dayKeys.length < 2) return null;
                        const points = dayKeys.map(d => {
                          const t = computeCurrencyTotals(days[d]);
                          return { d, score: Math.round((t[base] || 0) - (t[quote] || 0)) };
                        });
                        const maxAbs = Math.max(1, ...points.map(p => Math.abs(p.score)));
                        return (
                          <div style={{ marginTop: 10, padding: "8px 10px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 8, color: C.textDim, marginBottom: 6 }}>HISTORICKÉ SKÓRE — posledních {points.length} dní</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
                              {points.map((p, i) => {
                                const h = Math.max(3, (Math.abs(p.score) / maxAbs) * 34);
                                const col = p.score > NEUTRAL_THRESHOLD ? C.green : p.score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                                return (
                                  <div key={i} title={`${p.d}: ${p.score > 0 ? "+" : ""}${p.score}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 36 }}>
                                    <div style={{ width: "100%", height: h, background: col, borderRadius: 2, opacity: 0.85 }} />
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                              <span style={{ fontSize: 6, color: C.muted }}>{points[0]?.d?.slice(5)}</span>
                              <span style={{ fontSize: 6, color: C.muted }}>{points[points.length - 1]?.d?.slice(5)}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* ZPRÁVY (News) */}
                      {(() => {
                        const relevant = scenarios.filter(s => {
                          const ci = typeof s.currency_impact === 'string' ? JSON.parse(s.currency_impact) : (s.currency_impact || {});
                          return (ci[base] && ci[base].score !== 0) || (ci[quote] && ci[quote].score !== 0);
                        }).slice(0, 4);
                        if (relevant.length === 0) return null;
                        return (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 6 }}>POSLEDNÍ ZPRÁVY (News)</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {relevant.map(s => {
                                const ci = typeof s.currency_impact === 'string' ? JSON.parse(s.currency_impact) : (s.currency_impact || {});
                                const bScore = ci[base]?.score || 0;
                                const qScore = ci[quote]?.score || 0;
                                const net = bScore - qScore;
                                const col = net > 5 ? C.green : net < -5 ? C.red : C.yellow;
                                const dateStr = s.created_at ? new Date(s.created_at + "Z").toLocaleString("cs-CZ", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : null;
                                return (
                                  <div key={s.id} onClick={() => { setCenterTab("scenarios"); setExpandedScenario(s.id); setScenarioFilter(s.weight === "HIGH" ? "HIGH" : "MED"); }} style={{ padding: "5px 8px", background: `${col}08`, border: `1px solid ${col}22`, borderLeft: `2px solid ${col}`, borderRadius: 4, cursor: "pointer" }}>
                                    <div style={{ fontSize: 8, color: C.text, lineHeight: 1.3 }}>{s.title || s.headline}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                                      <div style={{ display: "flex", gap: 8 }}>
                                        <span style={{ fontSize: 7, color: C.textDim }}>{base}: {bScore > 0 ? "+" : ""}{bScore}</span>
                                        <span style={{ fontSize: 7, color: C.textDim }}>{quote}: {qScore > 0 ? "+" : ""}{qScore}</span>
                                        <span style={{ fontSize: 7, color: col, fontWeight: 700 }}>net: {net > 0 ? "+" : ""}{net}</span>
                                      </div>
                                      {dateStr && <span style={{ fontSize: 7, color: C.muted }}>{dateStr}</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* NADCHÁZEJÍCÍ UDÁLOSTI (Upcoming Events) */}
                      {(() => {
                        const relEvents = events.filter(e => e.currency === base || e.currency === quote).slice(0, 4);
                        if (relEvents.length === 0) return null;
                        return (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 6 }}>NADCHÁZEJÍCÍ UDÁLOSTI (Events)</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {relEvents.map((e, i) => {
                                const impCol = e.impact === "HIGH" ? C.red : e.impact === "MED" ? C.yellow : C.muted;
                                return (
                                  <div key={i} style={{ padding: "5px 8px", background: `${impCol}08`, border: `1px solid ${impCol}22`, borderRadius: 4 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 8, color: C.text }}>{e.title}</span>
                                      <span style={{ fontSize: 7, color: impCol, border: `1px solid ${impCol}44`, padding: "1px 4px", borderRadius: 3 }}>{e.impact}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                                      <span style={{ fontSize: 7, color: C.textDim }}>{e.currency} · {e.time || e.date}</span>
                                      {e.forecast && <span style={{ fontSize: 7, color: C.muted }}>Oček.: {e.forecast}</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }

                const PERFECT_BLUE = "#1864dc";
                const isDark = C.bg === "#0a0a12";
                return (
                  <div>
                    <SectionLabel>SKÓRE PÁR — klikni pro Confluence detail</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {pairsWithConfluence.map(({ pair, base, quote, biasCount, biasDir }) => {
                        const score = Math.round(currencyTotals[base] - currencyTotals[quote]);
                        const col = score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                        const direction = score > NEUTRAL_THRESHOLD ? "▲ LONG" : score < -NEUTRAL_THRESHOLD ? "▼ SHORT" : "→ NEUTRAL";
                        const isPerfect = biasCount === 5;
                        const perfectText = isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : C.text;
                        const perfectScore = isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : col;
                        return (
                          <div key={pair} onClick={() => setSelectedPair({ pair, base, quote })}
                            style={{ padding: "8px 10px",
                              background: isPerfect ? "rgba(24, 100, 220, 0.2)" : `${col}0a`,
                              border: isPerfect ? `1.5px solid ${PERFECT_BLUE}` : `1px solid ${col}33`,
                              borderLeft: `3px solid ${isPerfect ? PERFECT_BLUE : col}`, borderRadius: 6, cursor: "pointer",
                              animation: isPerfect ? "pulse 2s infinite" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                {isPerfect && <span style={{ fontSize: 10 }}>⚡</span>}
                                <span style={{ fontSize: 11, fontWeight: 700, color: perfectText }}>{pair}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontSize: 8, color: perfectScore, fontWeight: 700 }}>{biasCount}/5</span>
                                <span style={{ fontSize: 12, fontWeight: 900, color: col }}>{score > 0 ? "+" : ""}{score}</span>
                              </div>
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
                );
              })()}

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

        </div>{/* end RIGHT column */}
      </div>{/* end grid */}

      {/* Commodities – bottom strip (mobile only; desktop shows them in sidebar) */}
      {isMobile && <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", marginTop: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 6 }}>KOMODITY</div>
        {commodities.length === 0 ? (
          <div style={{ fontSize: 9, color: C.muted }}>Načítám...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
            {commodities.map(c => {
              const chCol = c.change > 0 ? C.green : c.change < 0 ? C.red : C.yellow;
              const signal = c.signal || "neutral";
              const sigCol = signal === "risk on" ? C.green : signal === "risk off" ? C.red : C.yellow;
              return (
                <div key={c.name} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{c.name}</span>
                    <span style={{ fontSize: 9, color: chCol }}>{c.change > 0 ? "▲" : "▼"}{Math.abs(c.change)}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 7, color: C.muted }}>{c.currencies}</span>
                    <span style={{ fontSize: 7, color: sigCol, border: `1px solid ${sigCol}44`, padding: "1px 4px", borderRadius: 3 }}>{signal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>}

      <div style={{ fontSize: 8, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 12, display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <span>⚡ AI scanning: ForexLive · FXStreet · MarketWatch · BBC · Investing.com · FT</span>
        <span>NOT FINANCIAL ADVICE — INFORMATIONAL ONLY</span>
      </div>
    </div>
    </div>
    </ThemeContext.Provider>
  );
}
