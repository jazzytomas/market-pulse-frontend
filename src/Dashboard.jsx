import React, { useEffect, useState } from "react";

const LIGHT = {
  bg: "#f1f5f9", panel: "#ffffff", border: "#e2e8f0",
  accent: "#2563eb", green: "#059669", red: "#dc2626",
  yellow: "#d97706", orange: "#ea580c", muted: "#94a3b8",
  text: "#0f172a", textDim: "#64748b",
  shadow: "0 2px 12px rgba(15,23,42,0.08)",
};

const DARK = {
  bg: "#080812", panel: "#0f0f22", border: "#2a1d6e",
  accent: "#c9a227", green: "#00e5a8", red: "#ff3d5e",
  yellow: "#c9a227", orange: "#ff8c42", muted: "#5a4f8a",
  text: "#f0eaff", textDim: "#9080c4",
  shadow: "0 2px 16px rgba(0,0,0,0.5)",
};

const ThemeContext = React.createContext(LIGHT);

const T = {
  // Header
  aiEngine:        { cz: "AI FUNDAMENTAL SENTIMENT ENGINE", en: "AI FUNDAMENTAL SENTIMENT ENGINE" },
  lastScan:        { cz: "LAST SCAN", en: "LAST SCAN" },
  rescan:          { cz: "⟳ RESCAN", en: "⟳ RESCAN" },
  scanning:        { cz: (s) => `◌ ${s}s...`, en: (s) => `◌ ${s}s...` },
  backend:         { cz: "Backend:", en: "Backend:" },
  // Tabs (center)
  tabScenarios:    { cz: "⚡ SCÉNÁŘE", en: "⚡ SCENARIOS" },
  tabEvents:       { cz: "📅 EVENTS", en: "📅 EVENTS" },
  tabCot:          { cz: "📊 COT", en: "📊 COT" },
  tabCorrelation:  { cz: "🔗 KORELACE", en: "🔗 CORRELATION" },
  tabSeasonal:     { cz: "📈 SEZONA", en: "📈 SEASONAL" },
  tabHistory:      { cz: "🕐 HISTORIE", en: "🕐 HISTORY" },
  tabFearGreed:    { cz: "😱 FEAR&GREED", en: "😱 FEAR&GREED" },
  tabBacktest:     { cz: "🎯 BACKTEST", en: "🎯 BACKTEST" },
  tabGuide:        { cz: "📖 PRŮVODCE", en: "📖 GUIDE" },
  // Tabs (right panel)
  tabPairs:        { cz: "PÁRY", en: "PAIRS" },
  tabStatus:       { cz: "STATUS", en: "STATUS" },
  tabCurrencies:   { cz: "MĚNY", en: "CURRENCIES" },
  tabCbRates:      { cz: "CB SAZBY", en: "CB RATES" },
  tabWatchlist:    { cz: "WATCHLIST", en: "WATCHLIST" },
  // Section labels
  riskSentiment:   { cz: "RISK SENTIMENT", en: "RISK SENTIMENT" },
  menovy:          { cz: "MENOVY PREHLED", en: "CURRENCY OVERVIEW" },
  komodity:        { cz: "KOMODITY", en: "COMMODITIES" },
  riskOn:          { cz: "Risk ON", en: "Risk ON" },
  riskOff:         { cz: "Risk OFF", en: "Risk OFF" },
  neutral:         { cz: "Neutral", en: "Neutral" },
  vixLabel:        { cz: "ztráta", en: "loss" },
  vixGain:         { cz: "zisk", en: "gain" },
  // Scenarios
  filterHigh:      { cz: "HIGH", en: "HIGH" },
  filterMed:       { cz: "MED", en: "MED" },
  filterOld:       { cz: "STARŠÍ", en: "OLDER" },
  clickDetail:     { cz: "Klikni pro detail ▼", en: "Click for detail ▼" },
  noScenarios:     { cz: "Žádné scénáře.", en: "No scenarios." },
  currencyImpact:  { cz: "DOPAD NA MENY", en: "CURRENCY IMPACT" },
  // Events
  noEvents:        { cz: "Žádné eventy.", en: "No events." },
  volWindows:      { cz: "VOLATILITA OKEN (EST)", en: "VOLATILITY WINDOWS (EST)" },
  forecast:        { cz: "Forecast", en: "Forecast" },
  actual:          { cz: "Actual", en: "Actual" },
  previous:        { cz: "Previous", en: "Previous" },
  // COT
  cotTitle:        { cz: "CFTC COT – NET POZICE (tis. kontraktů)", en: "CFTC COT – NET POSITIONS (k contracts)" },
  cotLong:         { cz: "Long", en: "Long" },
  cotShort:        { cz: "Short", en: "Short" },
  cotNet:          { cz: "Net", en: "Net" },
  cotDate:         { cz: "Datum:", en: "Date:" },
  cotSynthetic:    { cz: "syntetický", en: "synthetic" },
  cotNoData:       { cz: "Žádná COT data.", en: "No COT data." },
  // Correlation
  corrTitle:       { cz: "30D ROLLING KORELACE", en: "30D ROLLING CORRELATION" },
  corrDesc:        { cz: "Pearson korelace z posledních 30 dní (živá data z yfinance)", en: "Pearson correlation last 30 days (live yfinance data)" },
  // Seasonal
  seasTitle:       { cz: "SEZÓNNÍ PRŮMĚRNÉ VÝNOSY", en: "SEASONAL AVERAGE RETURNS" },
  seasDesc:        { cz: (y) => `Průměrné měsíční výnosy za posledních ${y} let`, en: (y) => `Average monthly returns last ${y} years` },
  seasNoData:      { cz: "Načítám sezónní data...", en: "Loading seasonal data..." },
  // History
  histTitle:       { cz: "POSLEDNICH 7 DNI", en: "LAST 7 DAYS" },
  histNoData:      { cz: "Žádná historická data.", en: "No historical data." },
  // Status
  currentState:    { cz: "CURRENT STATE", en: "CURRENT STATE" },
  upcomingEvents:  { cz: "NADCHÁZEJÍCÍ HIGH IMPACT EVENTY", en: "UPCOMING HIGH IMPACT EVENTS" },
  noUpcoming:      { cz: "Žádné nadcházející high-impact eventy.", en: "No upcoming high-impact events." },
  // Pairs
  pairsTitle:      { cz: "SKÓRE PÁR — klikni pro Confluence detail", en: "PAIR SCORES — click for Confluence detail" },
  topSetups:       { cz: "TOP SETUPY:", en: "TOP SETUPS:" },
  // CB Rates
  cbTitle:         { cz: "CENTRAL BANK TRACKER", en: "CENTRAL BANK TRACKER" },
  cbRate:          { cz: "Sazba", en: "Rate" },
  cbBank:          { cz: "Centrální banka", en: "Central Bank" },
  cbCountry:       { cz: "Země", en: "Country" },
  // Watchlist
  watchNoData:     { cz: "Načítám watchlist...", en: "Loading watchlist..." },
  // Currencies/Meny
  currBias:        { cz: "CURRENCY BIAS", en: "CURRENCY BIAS" },
  // Backtest
  btTitle:         { cz: "BACKTEST VÝSLEDKY", en: "BACKTEST RESULTS" },
  btAccuracy:      { cz: "PŘESNOST PER MĚNA", en: "ACCURACY PER CURRENCY" },
  btRecent:        { cz: "POSLEDNÍ PREDIKCE", en: "RECENT PREDICTIONS" },
  btCorrect:       { cz: "správně", en: "correct" },
  btWrong:         { cz: "chybně", en: "wrong" },
  btNoData:        { cz: "Backtest data nejsou k dispozici.", en: "Backtest data not available." },
  // Fear & Greed
  fgTitle:         { cz: "FEAR & GREED INDEX", en: "FEAR & GREED INDEX" },
  fgNoData:        { cz: "Načítám Fear & Greed...", en: "Loading Fear & Greed..." },
  // Guide
  guideTitle:      { cz: "PRŮVODCE APLIKACÍ", en: "APP GUIDE" },
  // Footer
  footerSources:   { cz: "AI scanning: ForexLive · FXStreet · MarketWatch · BBC · Investing.com · FT", en: "AI scanning: ForexLive · FXStreet · MarketWatch · BBC · Investing.com · FT" },
  footerDisclaimer:{ cz: "NOT FINANCIAL ADVICE · INFORMATIONAL ONLY", en: "NOT FINANCIAL ADVICE · INFORMATIONAL ONLY" },
  // Volatility windows
  volSessions: {
    cz: { "Overlap": "Vsechny pary", "NY Close": "USD pary", "Weekend": "Pa 17:00-Ne 17:00", gapRisk: "GAP riziko" },
    en: { "Overlap": "All pairs", "NY Close": "USD pairs", "Weekend": "Fri 17:00-Sun 17:00", gapRisk: "GAP risk" },
  },
};

const LangContext = React.createContext("cz");

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
        <div style={{ fontSize: 26, fontWeight: 900, color: G, fontFamily: "Orbitron, monospace", filter: `drop-shadow(0 0 8px ${G})` }}>
          {clamp > 0 ? "+" : ""}{clamp}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 4, color: G, fontFamily: "Orbitron, monospace" }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  const C = React.useContext(ThemeContext);
  return (
    <button onClick={onClick} style={{
      background: active ? `${C.accent}18` : "none",
      border: "none",
      borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
      color: active ? C.accent : C.textDim,
      padding: "4px 10px 8px", fontSize: 9, letterSpacing: 0.8,
      cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: active ? 700 : 500,
      textTransform: "uppercase", whiteSpace: "nowrap",
      borderRadius: "4px 4px 0 0", transition: "color 0.15s, background 0.15s",
    }}>{label}</button>
  );
}

function SectionLabel({ children, center }) {
  const C = React.useContext(ThemeContext);
  return <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10, textAlign: center ? "center" : "left", fontFamily: "'Space Grotesk', sans-serif" }}>{children}</div>;
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("mp_theme") !== "light");
  const [lang, setLang] = useState(() => localStorage.getItem("mp_lang") || "cz");
  const [winW, setWinW] = useState(window.innerWidth);

  const t = (key, ...args) => {
    const val = T[key]?.[lang];
    return typeof val === "function" ? val(...args) : (val ?? key);
  };

  const translatePairs = (p) => {
    if (lang === "en") {
      return p.replace("Vsechny pary", "All pairs")
              .replace("USD pary", "USD pairs")
              .replace("Pa 17:00-Ne 17:00", "Fri 17:00-Sun 17:00")
              .replace("GAP riziko", "GAP risk");
    }
    return p;
  };

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
    fetch(`${API}/api/rescan?token=mp-admin-2026`).catch(() => {});
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
      labels.push({ label: lang === "cz" ? "GEOPOLITICKÝ ŠOK" : "GEOPOLITICAL SHOCK", color: "#e74c3c" });
    if (["inflation"," cpi"," ppi","stagflat","price surge","price shock","overheating"].some(kw => allText.includes(kw)))
      labels.push({ label: lang === "cz" ? "INFLAČNÍ ŠOK" : "INFLATION SHOCK", color: "#1abc9c" });
    if (["supply chain","shortage","embargo","export ban","port clos","supply shock","mines in strait"].some(kw => allText.includes(kw)))
      labels.push({ label: lang === "cz" ? "NABÍDKOVÝ ŠOK" : "SUPPLY SHOCK", color: "#9b59b6" });
    if (["tariff","trade war","section 301","trade barrier","import duty","trade probe"].some(kw => allText.includes(kw)))
      labels.push({ label: lang === "cz" ? "OBCHODNÍ VÁLKA" : "TRADE WAR", color: "#e67e22" });
    const wti = commodities.find(c => c.name && c.name.toLowerCase().includes("wti"));
    if (wti && wti.change && wti.price) {
      const priceNum = parseFloat(String(wti.price).replace(/[^0-9.-]/g, ""));
      const prev = priceNum - wti.change;
      const pct = prev !== 0 ? (wti.change / prev) * 100 : 0;
      if (pct > 3) labels.push({ label: lang === "cz" ? "ROPNÝ SKOK" : "OIL SPIKE", color: "#f1c40f" });
      else if (pct < -3) labels.push({ label: lang === "cz" ? "PÁD ROPY" : "OIL DROP", color: "#2ecc71" });
    }
    return labels;
  }, [scenarios, commodities, lang]);

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
    <LangContext.Provider value={lang}>
    <ThemeContext.Provider value={C}>
    <div style={{ background: C.bg, ...(isMobile ? { minHeight: "100vh" } : { height: "100vh", overflow: "hidden" }), color: C.text, fontFamily: "inherit" }}>

      {/* Header – full width */}
      <div style={{ borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", maxWidth: 1520, margin: "0 auto", boxSizing: "border-box" }}>
        <div>
          {(() => {
            const dk = C.bg === "#080812";
            const gold = "#c9a227";
            const accentC = dk ? gold : "#2563eb";
            return (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "Orbitron, monospace", lineHeight: 1.1 }}>
                <div style={{ fontSize: 6.5, color: C.textDim, letterSpacing: 3, marginBottom: 3 }}>one minute update</div>
                <div style={{ fontSize: 20, letterSpacing: 0.5 }}>
                  <span style={{ color: dk ? "#e8e0f0" : C.text, fontWeight: 700 }}>marke</span><span style={{ fontWeight: 900, color: accentC }}>Trade</span>
                </div>
                <div style={{ fontSize: 7, color: C.textDim, letterSpacing: 3, marginTop: 3 }}>{t("aiEngine")}</div>
              </div>
            </div>
            );
          })()}
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
              {t("backend")} <b>{backendStatus}</b>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {isAdmin && (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: C.textDim }}>{t("lastScan")}</div>
                <div style={{ fontSize: 12, color: C.accent }}>{lastUpdate}</div>
              </div>
              <button onClick={runScan} disabled={scanning} style={{
                background: `${C.accent}18`, border: `1px solid ${scanning ? C.muted : C.accent}`,
                color: scanning ? C.textDim : C.accent, padding: "6px 12px", fontSize: 9,
                letterSpacing: 2, cursor: "pointer", borderRadius: 4, fontFamily: "Orbitron, monospace",
              }}>{scanning ? t("scanning", scanCountdown) : t("rescan")}</button>
            </>
          )}
          <button onClick={() => { const next = lang === "cz" ? "en" : "cz"; setLang(next); localStorage.setItem("mp_lang", next); }} title={lang === "cz" ? "Switch to English" : "Přepnout do češtiny"} style={{
            background: "none", border: `1px solid ${C.border}`,
            padding: "3px 6px", cursor: "pointer", borderRadius: 4, lineHeight: 1, display: "flex", alignItems: "center",
          }}>
            <img src={lang === "cz" ? "https://flagcdn.com/24x18/us.png" : "https://flagcdn.com/24x18/cz.png"} width="24" height="18" alt={lang === "cz" ? "EN" : "CZ"} style={{ display: "block", borderRadius: 2 }} />
          </button>
          <button onClick={() => { const next = !darkMode; setDarkMode(next); localStorage.setItem("mp_theme", next ? "dark" : "light"); }} title={darkMode ? "Light mode" : "Dark mode"} style={{
            background: darkMode ? "#c9a22718" : `${C.border}`, border: `1px solid ${darkMode ? "#c9a22755" : C.border}`,
            color: C.textDim, padding: "6px 9px", fontSize: 14,
            cursor: "pointer", borderRadius: 4, lineHeight: 1,
          }}>{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </div>
      </div>

    <div style={{ maxWidth: 1520, margin: "0 auto", ...(isMobile ? { minHeight: "100vh", overflowX: "hidden", width: "100%" } : { height: "calc(100% - 57px)", overflow: "hidden" }), padding: 14, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "210px 1fr", gap: 12, ...(isMobile ? { width: "100%", minWidth: 0 } : { flex: 1, minHeight: 0 }) }}>

        {/* LEFT – desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: 14 }}>
              <SectionLabel center>{t("riskSentiment")}</SectionLabel>
              <RiskMeter score={sentiment.total_score} />
              {sentiment.vix != null && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: C.textDim, letterSpacing: 1 }}>VIX</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: sentiment.vix > 25 ? C.red : sentiment.vix < 15 ? C.green : C.yellow }}>{sentiment.vix.toFixed(1)}</span>
                  <span style={{ fontSize: 8, color: C.textDim }}>{sentiment.vix > 25 ? (lang === "cz" ? "▲ strach" : "▲ fear") : sentiment.vix < 15 ? (lang === "cz" ? "▼ klid" : "▼ calm") : "— neutral"}</span>
                </div>
              )}
              <div style={{ marginTop: 12, padding: "10px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                <SectionLabel>{t("menovy")}</SectionLabel>
                {[
                  { label: t("riskOn"),  currencies: ["AUD", "NZD", "CAD"] },
                  { label: t("neutral"),  currencies: ["GBP", "EUR"] },
                  { label: t("riskOff"), currencies: ["USD", "JPY", "CHF"] },
                ].map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                    <span style={{ fontSize: 9, color: C.textDim, width: 54, paddingTop: 2, flexShrink: 0 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.map(c => (
                        <span key={c} style={{ fontSize: 9, color: C.textDim, border: `1px solid ${C.textDim}55`, background: `${C.textDim}12`, padding: "1px 5px", borderRadius: 3 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Commodities – back in desktop sidebar */}
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "10px 12px", flex: 1, overflowY: "auto", minHeight: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 3 }}>{t("komodity")}</div>
              <div style={{ fontSize: 7, color: C.muted, marginBottom: 8 }}>{lang === "cz" ? "měny = korelované · dnes = signál" : "currencies = correlated · today = signal"}</div>
              {commodities.length === 0 ? (
                <div style={{ fontSize: 9, color: C.muted }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>
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
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "10px 14px", display: "flex", alignItems: "stretch", gap: 12 }}>
            {/* Levý sloupec: gauge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 2 }}>{t("riskSentiment")}</div>
              <RiskMeter score={sentiment.total_score} />
            </div>
            {/* Pravý sloupec: VIX nahoře, měny dole */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {sentiment.vix != null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                  <span style={{ fontSize: 8, color: C.textDim, letterSpacing: 1 }}>VIX</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: sentiment.vix > 25 ? C.red : sentiment.vix < 15 ? C.green : C.yellow }}>{sentiment.vix.toFixed(1)}</span>
                  <span style={{ fontSize: 8, color: C.textDim }}>{sentiment.vix > 25 ? (lang === "cz" ? "▲ strach" : "▲ fear") : sentiment.vix < 15 ? (lang === "cz" ? "▼ klid" : "▼ calm") : "— neutral"}</span>
                </div>
              )}
              <div style={{ flex: 1, padding: "6px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 5 }}>{t("menovy")}</div>
                {[
                  { label: t("riskOn"),  currencies: ["AUD", "NZD", "CAD"] },
                  { label: t("neutral"),  currencies: ["GBP", "EUR"] },
                  { label: t("riskOff"), currencies: ["USD", "JPY", "CHF"] },
                ].map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: C.textDim, width: 50, flexShrink: 0 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.map(c => (
                        <span key={c} style={{ fontSize: 9, color: C.textDim, border: `1px solid ${C.textDim}55`, background: `${C.textDim}12`, padding: "1px 5px", borderRadius: 3 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* CENTER tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: 14, display: "flex", flexDirection: "column", ...(isMobile ? { minHeight: 400, order: 2 } : { flex: 1, minHeight: 0 }) }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label={t("tabScenarios")} active={centerTab === "scenarios"} onClick={() => setCenterTab("scenarios")} />
              <TabBtn label={t("tabEvents")} active={centerTab === "calendar"} onClick={() => setCenterTab("calendar")} />
              <TabBtn label={t("tabCot")} active={centerTab === "cot"} onClick={() => setCenterTab("cot")} />
              <TabBtn label={t("tabCorrelation")} active={centerTab === "corr"} onClick={() => setCenterTab("corr")} />
              <TabBtn label={t("tabSeasonal")} active={centerTab === "seasonal"} onClick={() => setCenterTab("seasonal")} />
              <TabBtn label={t("tabHistory")} active={centerTab === "history"} onClick={() => setCenterTab("history")} />
              <TabBtn label={t("tabFearGreed")} active={centerTab === "feargreed"} onClick={() => setCenterTab("feargreed")} />
              <TabBtn label={t("tabBacktest")} active={centerTab === "backtest"} onClick={() => setCenterTab("backtest")} />
              <TabBtn label={t("tabGuide")} active={centerTab === "guide"} onClick={() => setCenterTab("guide")} />
            </div>

            <div style={{ ...(isMobile ? {} : { flex: 1, overflowY: "auto", minHeight: 0 }) }}>

            {centerTab === "scenarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                  {[{ key: "HIGH", label: t("filterHigh") }, { key: "MED", label: t("filterMed") }, { key: "STARŠÍ", label: t("filterOld") }].map(f => (
                    <button key={f.key} onClick={() => setScenarioFilter(f.key)} style={{
                      fontSize: 9, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: scenarioFilter === f.key ? 700 : 400,
                      background: scenarioFilter === f.key ? (f.key === "STARŠÍ" ? C.border : C.accent) : C.border,
                      color: scenarioFilter === f.key ? (f.key === "STARŠÍ" ? C.textDim : "#000") : C.textDim,
                      border: `1px solid ${scenarioFilter === f.key ? (f.key === "STARŠÍ" ? C.textDim : C.accent) : C.border}`
                    }}>{f.label}</button>
                  ))}
                  <span style={{ fontSize: 9, color: C.textDim, alignSelf: "center", marginLeft: 4 }}>{t("clickDetail")}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const sorted = [...scenarios].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                  const newest10 = sorted.slice(0, 10);
                  const older10 = sorted.slice(10, 20);
                  // HIGH tab: zobraz všechna HIGH ze všech 20, ne jen z prvních 10
                  const list = scenarioFilter === "STARŠÍ"
                    ? older10.filter(s => s.weight === "HIGH")
                    : scenarioFilter === "HIGH"
                      ? sorted.filter(s => s.weight === "HIGH")
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
                            <SectionLabel>{t("currencyImpact")}</SectionLabel>
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
                {(() => {
                  const now = new Date();
                  const todayStr = now.toDateString();
                  const sorted = [...events].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
                  let shownPast = false, shownToday = false, shownUpcoming = false;
                  return sorted.map((ev, i) => {
                    const evDate = new Date(ev.event_time);
                    const isPast = evDate < now;
                    const isToday = evDate.toDateString() === todayStr;
                    const col = ev.impact === "HIGH" ? C.red : ev.impact === "MED" ? C.orange : C.muted;
                    const hasActual = ev.actual && ev.actual.trim() !== "";
                    const actualColor = (() => {
                      if (!hasActual || !ev.forecast || ev.forecast.trim() === "") return C.text;
                      const a = parseFloat(ev.actual); const f = parseFloat(ev.forecast);
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
                    const score = ev.score;
                    const scoreColor = score == null ? null : score > 0 ? C.green : score < 0 ? C.red : C.yellow;
                    let sectionHeader = null;
                    if (isPast && !isToday && !shownPast) { shownPast = true; sectionHeader = lang === "cz" ? "PROBĚHLÉ" : "PAST"; }
                    else if (isToday && !shownToday) { shownToday = true; sectionHeader = lang === "cz" ? "DNES" : "TODAY"; }
                    else if (!isToday && !isPast && !shownUpcoming) { shownUpcoming = true; sectionHeader = lang === "cz" ? "NADCHÁZEJÍCÍ" : "UPCOMING"; }
                    return (
                      <React.Fragment key={i}>
                        {sectionHeader && (
                          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: C.accent, borderBottom: `1px solid ${C.border}`, paddingBottom: 4, marginTop: i > 0 ? 8 : 0 }}>
                            {sectionHeader}
                          </div>
                        )}
                        <div style={{ border: `1px solid ${isPast ? C.border : col + "55"}`, borderLeft: `3px solid ${isPast ? C.muted : col}`, borderRadius: 6, padding: "10px 12px", opacity: isPast ? 0.45 : 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: isPast ? C.muted : col, display: "inline-block" }} />
                              <span style={{ fontSize: 11, fontWeight: 700 }}>{ev.name}</span>
                              <span style={{ fontSize: 8, color: isPast ? C.muted : col, border: `1px solid ${isPast ? C.muted : col}44`, padding: "1px 5px", borderRadius: 3 }}>{ev.impact}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {score != null && (
                                <span style={{ fontSize: 8, fontWeight: 700, color: scoreColor, border: `1px solid ${scoreColor}55`, padding: "1px 6px", borderRadius: 3 }}>
                                  {score > 0 ? "+" : ""}{score}
                                </span>
                              )}
                              <span style={{ fontSize: 10, color: isPast ? C.textDim : C.accent }}>{fmtTime}</span>
                            </div>
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
                      </React.Fragment>
                    );
                  });
                })()}
                <div style={{ marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <SectionLabel>{t("volWindows")}</SectionLabel>
                  {volWindows.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <div style={{ width: 60, fontSize: 9, color: C.textDim }}>{w.session}</div>
                      <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${w.vol}%`, height: "100%", background: w.vol > 80 ? C.red : w.vol > 50 ? C.orange : C.muted, borderRadius: 3 }} />
                      </div>
                      <div style={{ width: 28, fontSize: 9, color: C.textDim, textAlign: "right" }}>{w.vol}%</div>
                      <div style={{ fontSize: 8, color: C.muted, width: 110 }}>{translatePairs(w.pairs)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {centerTab === "cot" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>
                  {lang === "cz"
                    ? "CFTC Commitments of Traders — Leveraged Money pozice · stahuje se každý pátek · datum = reportovací týden (úterý)"
                    : "CFTC Commitments of Traders — Leveraged Money positions · fetched every Friday · date = reporting week (Tuesday)"}
                </div>
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
                  {t("corrDesc")}
                  {correlationData && correlationData.date && (
                    <span style={{ marginLeft: 8, color: C.muted }}>
                      · {correlationData.days}D · {lang === "cz" ? "aktuální k" : "as of"} {correlationData.date}
                    </span>
                  )}
                  {correlationData && !correlationData.date && (
                    <span style={{ marginLeft: 8, color: C.yellow }}> · fallback data</span>
                  )}
                </div>
                {!correlationData ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>{t("corrDesc")}</div>
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
                  <span style={{ fontSize: 9, color: C.textDim }}>{lang === "cz" ? "Průměrný měsíční výnos za posledních" : "Average monthly return last"}</span>
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
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>{t("seasNoData")}</div>
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
                      <div style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>
                        {lang === "cz"
                          ? `* hodnoty v %, průměr ${seasonalYears} ${seasonalYears === 1 ? "rok" : seasonalYears < 5 ? "roky" : "let"} · zdroj: yfinance`
                          : `* values in %, average ${seasonalYears} ${seasonalYears === 1 ? "year" : "years"} · source: yfinance`}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {centerTab === "history" && (
              <div>
                <SectionLabel>{t("histTitle")}</SectionLabel>
                {historyData.length === 0 ? (
                  <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>{t("histNoData")}</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {historyData.map((h, i) => {
                      const col = h.score > 15 ? C.green : h.score < -15 ? C.red : C.yellow;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: `${col}08`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                          <span style={{ fontSize: 10, color: C.textDim, width: 36 }}>{h.date}</span>
                          <span style={{ fontSize: 11, fontWeight: 900, color: col, width: 36 }}>{h.score > 0 ? "+" : ""}{h.score}</span>
                          <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3, width: 58, textAlign: "center" }}>{h.label}</span>
                          <span style={{ fontSize: 9, color: C.muted, flex: 1 }}>{h.count} {lang === "cz" ? "scénářů" : "scenarios"}</span>
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
                    <div style={{ fontSize: 9, color: C.muted }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>
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
                  <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                      {[["0–20","Extreme Fear",C.red],["21–40","Fear",C.orange],["41–60","Neutral",C.yellow],["61–80","Greed","#7ec850"],["81–100","Extreme Greed",C.green]].map(([range, lbl, col]) => (
                        <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                          <span style={{ fontSize: 8, color: C.textDim }}>{range} {lbl}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>
                      {lang === "cz" ? "Forex = náš AI sentiment + VIX · Akcie = VIX + S&P momentum · Krypto = alternative.me · cache 15 min" : "Forex = our AI sentiment + VIX · Stocks = VIX + S&P momentum · Crypto = alternative.me · cache 15 min"}
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
                    {lang === "cz" ? "Data se hromadí – backtest potřebuje min. 24h na první výsledky." : "Data is accumulating – backtest needs min. 24h for first results."}<br/>
                    <span style={{ fontSize: 8 }}>{lang === "cz" ? "Každou hodinu se ukládají vstupní ceny, po 24h se vyhodnocuje přesnost." : "Entry prices are saved every hour, accuracy is evaluated after 24h."}</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Overall stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { label: lang === "cz" ? "CELKOVÁ PŘESNOST" : "OVERALL ACCURACY", value: `${backtestData.accuracy}%`, color: backtestData.accuracy >= 55 ? C.green : backtestData.accuracy >= 45 ? C.yellow : C.red },
                        { label: lang === "cz" ? "SPRÁVNĚ" : "CORRECT", value: `${backtestData.correct} / ${backtestData.total}`, color: C.text },
                        { label: lang === "cz" ? "VYHODNOCENO" : "EVALUATED", value: `${backtestData.total} ${lang === "cz" ? "predikcí" : "predictions"}`, color: C.textDim },
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
                        <SectionLabel>{t("btAccuracy")}</SectionLabel>
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
                        <SectionLabel>{t("btRecent")}</SectionLabel>
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
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Celkové nálada trhu vůči riziku. Vypočítává se jako vážený průměr AI skóre zpráv + VIX index." : "Overall market risk mood. Calculated as weighted average of AI news scores + VIX index."} />
                    <Row label={lang === "cz" ? "Škála" : "Scale"} desc={lang === "cz" ? "+100 = maximální Risk ON (trhy rostou, investoři kupují riziková aktiva). −100 = maximální Risk OFF (strach, útěk do bezpečí)." : "+100 = max Risk ON (markets rising, investors buying risky assets). −100 = max Risk OFF (fear, flight to safety)."} />
                    <Row label="VIX" desc={lang === "cz" ? "Index strachu. VIX nad 25 = strach na trhu (Risk OFF). VIX pod 15 = klid (Risk ON). Váha 2× HIGH zpráva." : "Fear index. VIX above 25 = market fear (Risk OFF). VIX below 15 = calm (Risk ON). Weight = 2× HIGH news."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Risk ON → sleduj AUD, NZD, CAD. Risk OFF → sleduj USD, JPY, CHF. Neutral → čekej na potvrzení." : "Risk ON → watch AUD, NZD, CAD. Risk OFF → watch USD, JPY, CHF. Neutral → wait for confirmation."} />
                  </Section>

                  <Section emoji="⚡" title={lang === "cz" ? "SCÉNÁŘE" : "SCENARIOS"}>
                    <Row label={lang === "cz" ? "Co to jsou" : "What they are"} desc={lang === "cz" ? "AI (Claude Haiku) ohodnotí každou forex-relevantní zprávu skóre a dopadem na každou měnu." : "AI (Claude Haiku) scores every forex-relevant news item and calculates impact on each currency."} />
                    <Row label="Risk score" desc={lang === "cz" ? "−100 až +100. Kladné = pozitivní pro trhy (Risk ON). Záporné = negativní (Risk OFF)." : "−100 to +100. Positive = good for markets (Risk ON). Negative = bad (Risk OFF)."} />
                    <Row label={lang === "cz" ? "HIGH váha" : "HIGH weight"} desc={lang === "cz" ? "Market-moving zprávy: NFP, rozhodnutí CB, geopolitické šoky. Počítají se 3× do sentimentu." : "Market-moving news: NFP, CB decisions, geopolitical shocks. Count 3× in sentiment."} />
                    <Row label={lang === "cz" ? "MED váha" : "MED weight"} desc={lang === "cz" ? "Důležité ale ne market-moving: komentáře CB, regionální data. Počítají se 1× do sentimentu." : "Important but not market-moving: CB comments, regional data. Count 1× in sentiment."} />
                    <Row label={lang === "cz" ? "LOW váha" : "LOW weight"} desc={lang === "cz" ? "Pozadí a kontext. Do risk sentimentu se nezapočítávají." : "Background and context. Not counted in risk sentiment."} />
                    <Row label={lang === "cz" ? "Filtr" : "Filter"} desc={lang === "cz" ? "Tlačítka HIGH / MED přepínají seznam. Kliknutím na zprávu zobrazíš dopad na každou měnu." : "HIGH / MED buttons switch the list. Click a news item to see impact on each currency."} />
                  </Section>

                  <Section emoji="📅" title={lang === "cz" ? "EVENTS (EKONOMICKÝ KALENDÁŘ)" : "EVENTS (ECONOMIC CALENDAR)"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Ekonomické události z ForexFactory pro aktuální týden. Aktualizuje se každou hodinu." : "Economic events from ForexFactory for the current week. Updates every hour."} />
                    <Row label="🔴 HIGH" desc={lang === "cz" ? "Silně market-moving: NFP, CPI, rozhodnutí Fedu/ECB/BOJ, HDP. Očekávej velké pohyby (50+ pips)." : "Strong market-movers: NFP, CPI, Fed/ECB/BOJ decisions, GDP. Expect large moves (50+ pips)."} />
                    <Row label="🟡 MED" desc={lang === "cz" ? "Střední dopad: PMI, obchodní bilance, výroky bankéřů. Pohyby 10–30 pips." : "Medium impact: PMI, trade balance, CB speeches. Moves 10–30 pips."} />
                    <Row label={lang === "cz" ? "Volatilita oken" : "Volatility windows"} desc={lang === "cz" ? "Typická volatilita podle obchodní seance (Tokio, Londýn, NY). Nejsilnější = overlap Londýn+NY (13–17h CET)." : "Typical volatility by trading session (Tokyo, London, NY). Strongest = London+NY overlap (1–5pm CET)."} />
                  </Section>

                  <Section emoji="📊" title="COT (COMMITMENTS OF TRADERS)">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Týdenní report CFTC o pozicích velkých hráčů (hedge fondy = Leveraged Money) na futures trzích." : "Weekly CFTC report on positions of large players (hedge funds = Leveraged Money) in futures markets."} />
                    <Row label={lang === "cz" ? "Datum" : "Date"} desc={lang === "cz" ? "Datum = úterý reportovacího týdne (kdy se data uzavřou). CFTC publikuje v pátek, stahujeme automaticky." : "Date = Tuesday of the reporting week (when data closes). CFTC publishes Friday, we fetch automatically."} />
                    <Row label="LONG" desc={lang === "cz" ? "Počet long kontraktů (sázka na posílení měny)." : "Number of long contracts (bet on currency strengthening)."} />
                    <Row label="SHORT" desc={lang === "cz" ? "Počet short kontraktů (sázka na oslabení měny)." : "Number of short contracts (bet on currency weakening)."} />
                    <Row label="NET" desc={lang === "cz" ? "Long − Short. Kladný NET = trh sází na posílení. Záporný = slabost. Extrémní hodnoty = možný obrat." : "Long − Short. Positive NET = market bets on strength. Negative = weakness. Extremes = possible reversal."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sleduj trend NET pozic. Extrémy (velmi high/low) signalizují přeprodanost. USD je syntetický (inverzní součet ostatních)." : "Watch NET position trend. Extremes (very high/low) signal oversaturation. USD is synthetic (inverse sum of others)."} />
                  </Section>

                  <Section emoji="🔗" title={lang === "cz" ? "KORELACE" : "CORRELATION"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "30denní Pearsonova korelace mezi 6 hlavními páry. Live data z yfinance." : "30-day Pearson correlation between 6 major pairs. Live data from yfinance."} />
                    <Row label="+1.0" desc={lang === "cz" ? "Páry se pohybují identicky. Přidáním obou otevíráš dvojnásobné riziko." : "Pairs move identically. Adding both doubles your risk."} />
                    <Row label="−1.0" desc={lang === "cz" ? "Páry jdou přesně opačně. Hedge: long jeden, short druhý = minimální riziko." : "Pairs move opposite. Hedge: long one, short the other = minimal risk."} />
                    <Row label="0.0" desc={lang === "cz" ? "Žádná korelace. Páry se pohybují nezávisle." : "No correlation. Pairs move independently."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Nekumuluj vysoce korelované pozice (EUR/USD + GBP/USD). Inverzní korelace (EUR/USD + USD/JPY) lze hedgovat." : "Don't accumulate highly correlated positions (EUR/USD + GBP/USD). Inverse correlation (EUR/USD + USD/JPY) can be hedged."} />
                  </Section>

                  <Section emoji="📈" title={lang === "cz" ? "SEZÓNNOST" : "SEASONALITY"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Průměrný měsíční výnos měn za zvolené období (1/3/5/10 let). Historický vzor opakující se každý rok." : "Average monthly currency returns for selected period (1/3/5/10 years). Historical pattern repeating each year."} />
                    <Row label={lang === "cz" ? "🟢 Zelená" : "🟢 Green"} desc={lang === "cz" ? "Měna historicky v daném měsíci posilovala (kladný průměrný výnos)." : "Currency historically strengthened in this month (positive average return)."} />
                    <Row label={lang === "cz" ? "🔴 Červená" : "🔴 Red"} desc={lang === "cz" ? "Měna historicky v daném měsíci oslabovala (záporný průměrný výnos)." : "Currency historically weakened in this month (negative average return)."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sezónnost je doplňkový nástroj. Silný sezónní vzor + potvrzení od COT + sentimentu = silnější signál." : "Seasonality is a supplementary tool. Strong seasonal pattern + COT confirmation + sentiment = stronger signal."} />
                    <Row label={lang === "cz" ? "Pozor" : "Note"} desc={lang === "cz" ? "Minulé výnosy nezaručují budoucí. Sezónnost funguje nejlépe jako filtr, ne jako hlavní signál." : "Past returns don't guarantee future returns. Seasonality works best as a filter, not as the main signal."} />
                  </Section>

                  <Section emoji="🕐" title={lang === "cz" ? "HISTORIE SENTIMENTU" : "SENTIMENT HISTORY"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "7denní přehled denního risk sentimentu. Ukládá se do DB každý den." : "7-day overview of daily risk sentiment. Saved to DB every day."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sleduj trend. Pokud sentiment klesá 3+ dny po sobě → Risk OFF trend. Rychlý obrat → možný sentiment shift." : "Watch the trend. If sentiment drops 3+ days in a row → Risk OFF trend. Quick reversal → possible sentiment shift."} />
                  </Section>

                  <Section emoji="😱" title="FEAR & GREED INDEX">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Kompozitní index strachu a chamtivosti trhu na škále 0–100. Nízká hodnota = strach, vysoká = chamtivost." : "Composite market fear and greed index on a 0–100 scale. Low = fear, high = greed."} />
                    <Row label="💱 Forex F&G" desc={lang === "cz" ? "Vypočítán z našeho AI sentimentu (65%) + VIX (35%). Normalizován na 0–100." : "Calculated from our AI sentiment (65%) + VIX (35%). Normalized to 0–100."} />
                    <Row label="📈 Stocks F&G" desc={lang === "cz" ? "VIX index strachu (60%) + S&P 500 momentum vůči 125dennímu průměru (40%)." : "VIX fear index (60%) + S&P 500 momentum vs. 125-day average (40%)."} />
                    <Row label="₿ Crypto F&G" desc={lang === "cz" ? "Oficiální index z alternative.me. Zahrnuje volatilitu, momentum, sociální média a dominanci Bitcoinu." : "Official index from alternative.me. Includes volatility, momentum, social media, and Bitcoin dominance."} />
                    <Row label="0–20 Extreme Fear" desc={lang === "cz" ? "Trh v panice. Historicky dobrá příležitost k nákupu (contrarian)." : "Market in panic. Historically a good buying opportunity (contrarian)."} />
                    <Row label="80–100 Extreme Greed" desc={lang === "cz" ? "Trh přehřátý, investoři příliš optimistični. Zvýšené riziko korekce." : "Market overheated, investors too optimistic. Increased correction risk."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Porovnej Fear&Greed napříč trhy. Pokud krypto Extreme Fear ale Forex Greed → diverzifikace signálů." : "Compare Fear&Greed across markets. If crypto Extreme Fear but Forex Greed → divergence signals."} />
                  </Section>

                  <Section emoji="🛢️" title={lang === "cz" ? "KOMODITY" : "COMMODITIES"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Live ceny 7 komodit z yfinance. Aktualizuje se každých 5 minut." : "Live prices of 7 commodities from yfinance. Updates every 5 minutes."} />
                    <Row label={lang === "cz" ? "▲/▼ % změna" : "▲/▼ % change"} desc={lang === "cz" ? "Dnešní procentuální pohyb ceny komodity oproti předchozímu dni." : "Today's percentage price movement compared to previous day."} />
                    <Row label={lang === "cz" ? "koreluje:" : "correlates:"} desc={lang === "cz" ? "Měny, které historicky reagují na pohyb dané komodity. Např. CAD ↑ = když roste WTI ropa, CAD má tendenci posilovat (Kanada je exportér ropy)." : "Currencies that historically react to this commodity's moves. E.g. CAD ↑ = when WTI oil rises, CAD tends to strengthen (Canada is oil exporter)."} />
                    <Row label={lang === "cz" ? "dnes: risk on/off" : "today: risk on/off"} desc={lang === "cz" ? "Risk signál odvozený z dnešního pohybu ceny. Ropa ↑ = risk on (ekonomika roste, chuť riskovat). Zlato ↑ = risk off (trh hledá bezpečí). Neutral = pohyb je nevýrazný." : "Risk signal derived from today's price move. Oil ↑ = risk on (economy growing). Gold ↑ = risk off (market seeking safety). Neutral = move is minor."} />
                  </Section>

                  <Section emoji="🎯" title={lang === "cz" ? "BACKTEST" : "BACKTEST"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Zpětný test přesnosti AI signálů. Porovnává minulé predikce (bias měny) se skutečným pohybem kurzu." : "Accuracy backtest of AI signals. Compares past currency bias predictions against actual price moves."} />
                    <Row label={lang === "cz" ? "Přesnost %" : "Accuracy %"} desc={lang === "cz" ? "Kolik procent predikcí bylo správně. Nad 55 % = slibný signál. Nad 65 % = silný edge. Pod 45 % = nespolehlivý." : "Percentage of correct predictions. Above 55% = promising signal. Above 65% = strong edge. Below 45% = unreliable."} />
                    <Row label={lang === "cz" ? "Správně / Chybně" : "Correct / Wrong"} desc={lang === "cz" ? "Počet správných a chybných predikcí za posledních 7 dní. Čím více vzorků, tím statisticky spolehlivější výsledek." : "Count of correct and wrong predictions over the last 7 days. More samples = statistically more reliable result."} />
                    <Row label={lang === "cz" ? "Jak funguje" : "How it works"} desc={lang === "cz" ? "Systém uloží bias měny v čas scénáře. Po 4 hodinách porovná, zda se kurz posunul ve správném směru. Long bias = měna měla posílit." : "System records currency bias at scenario time. After 4 hours it checks if the rate moved in the predicted direction. Long bias = currency was expected to strengthen."} />
                    <Row label={lang === "cz" ? "Omezení" : "Limitations"} desc={lang === "cz" ? "Backtest pokrývá pouze 7 dní dat. Krátkodobé pohyby jsou ovlivněny mnoha faktory mimo AI model (data surprisy, geopolitika). Berte jako orientační metriku, ne garancimu." : "Backtest covers only 7 days of data. Short-term moves are affected by many factors outside the AI model (data surprises, geopolitics). Treat as indicative metric, not a guarantee."} />
                    <Row label={lang === "cz" ? "Nejlepší měny" : "Best currencies"} desc={lang === "cz" ? "Graf ukazuje přesnost per měna. Měny s konzistentně vysokou přesností (60 %+) jsou ty, kde AI fundamental analýza funguje nejlépe." : "Chart shows accuracy per currency. Currencies with consistently high accuracy (60%+) are where AI fundamental analysis works best."} />
                  </Section>

                  <Section emoji="💱" title={lang === "cz" ? "MĚNOVÝ BIAS A PÁRY" : "CURRENCY BIAS & PAIRS"}>
                    <Row label={lang === "cz" ? "Celkový bias" : "Overall bias"} desc={lang === "cz" ? "Vážený průměr AI dopadů posledních zpráv na každou měnu. Novější zprávy mají větší váhu (exponenciální decay)." : "Weighted average of AI impacts from recent news on each currency. Newer news has higher weight (exponential decay)."} />
                    <Row label={lang === "cz" ? "Páry (Pary tab)" : "Pairs tab"} desc={lang === "cz" ? "Skóre páru = bias základní měny − bias kótovací měny. Kladné = buy signál, záporné = sell signál." : "Pair score = base currency bias − quote currency bias. Positive = buy signal, negative = sell signal."} />
                    <Row label={lang === "cz" ? "Risk ON měny" : "Risk ON currencies"} desc={lang === "cz" ? "AUD, NZD, CAD — posilují při dobré náladě trhů (risk appetite)." : "AUD, NZD, CAD — strengthen when market mood is positive (risk appetite)."} />
                    <Row label={lang === "cz" ? "Risk OFF měny" : "Risk OFF currencies"} desc={lang === "cz" ? "USD, JPY, CHF — safe haven, posilují při strachu a nejistotě." : "USD, JPY, CHF — safe haven, strengthen during fear and uncertainty."} />
                    <Row label="Neutral" desc={lang === "cz" ? "EUR, GBP — smíšené charakteristiky, závisí na domácí ekonomice." : "EUR, GBP — mixed characteristics, depends on domestic economy."} />
                  </Section>

                  <div style={{ fontSize: 8, color: C.muted, textAlign: "center", paddingTop: 4 }}>
                    {lang === "cz" ? "Data se aktualizují automaticky každou hodinu · COT každý pátek · Sezónnost každých 24h" : "Data updates automatically every hour · COT every Friday · Seasonality every 24h"}
                  </div>

                </div>
              );
            })()}

            </div>{/* /content wrapper */}
          </div>

          {/* TOP SETUPS strip */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "8px 12px", flexShrink: 0, ...(isMobile ? { order: 1 } : {}) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, flexShrink: 0 }}>{t("topSetups")}</span>
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
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden", display: "flex", flexDirection: "column", ...(isMobile ? {} : { flexShrink: 0, height: 300 }) }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label={t("tabPairs")} active={rightTab === "pairs"} onClick={() => setRightTab("pairs")} />
              <TabBtn label={t("tabStatus")} active={rightTab === "status"} onClick={() => setRightTab("status")} />
              <TabBtn label={t("tabCurrencies")} active={rightTab === "currencies"} onClick={() => setRightTab("currencies")} />
              <TabBtn label={t("tabCbRates")} active={rightTab === "cb"} onClick={() => setRightTab("cb")} />
              <TabBtn label={t("tabWatchlist")} active={rightTab === "watchlist"} onClick={() => setRightTab("watchlist")} />
            </div>

            <div style={{ padding: 14, ...(isMobile ? {} : { flex: 1, overflowY: "auto", minHeight: 0 }) }}>

              {rightTab === "status" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}44`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 8 }}>{t("currentState")}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: riskColor, letterSpacing: 3 }}>{riskLabel}</div>
                    <div style={{ fontSize: 9, color: C.textDim, marginTop: 8, lineHeight: 1.6 }}>
                      {sentiment.total_score > NEUTRAL_THRESHOLD
                        ? (lang === "cz" ? "Trh preferuje risk assets. AUD, NZD supported." : "Market prefers risk assets. AUD, NZD supported.")
                        : sentiment.total_score < -NEUTRAL_THRESHOLD
                        ? (lang === "cz" ? "Risk aversion. JPY, CHF, Gold outperformuji." : "Risk aversion. JPY, CHF, Gold outperforming.")
                        : (lang === "cz" ? "Smisene signaly. Cekej na potvrzeni." : "Mixed signals. Wait for confirmation.")}
                    </div>
                  </div>
                  <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}33`, borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: C.red }}>⚠ RISK EVENTS</div>
                      <div style={{ fontSize: 8, color: C.textDim, background: C.border, padding: "2px 6px", borderRadius: 3 }}>{lang === "cz" ? "pristich 48h" : "next 48h"}</div>
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
                    <SectionLabel>{t("currBias")}</SectionLabel>
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
                    <SectionLabel>{lang === "cz" ? "PREHLED BIAS" : "BIAS OVERVIEW"}</SectionLabel>
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
                const RISK_CHAR_LABEL = { risk_on: "Risk ON", safe_haven: "Safe Haven", neutral: lang === "cz" ? "Neutrální" : "Neutral" };

                if (selectedPair) {
                  const { pair, base, quote } = selectedPair;
                  const pairScore = Math.round(currencyTotals[base] - currencyTotals[quote]);
                  const pairCol = pairScore > NEUTRAL_THRESHOLD ? C.green : pairScore < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                  const pairBias = pairScore > NEUTRAL_THRESHOLD ? (lang === "cz" ? "▲ NÁKUP (Long)" : "▲ BUY (Long)") : pairScore < -NEUTRAL_THRESHOLD ? (lang === "cz" ? "▼ PRODEJ (Short)" : "▼ SELL (Short)") : (lang === "cz" ? "→ NEUTRÁLNÍ (Neutral)" : "→ NEUTRAL");

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
                      label: lang === "cz" ? "Sentiment zpráv (News Sentiment)" : "News Sentiment",
                      baseVal: `${currencyTotals[base] > 0 ? "+" : ""}${currencyTotals[base]}`,
                      quoteVal: `${currencyTotals[quote] > 0 ? "+" : ""}${currencyTotals[quote]}`,
                      aligns: currencyTotals[base] > currencyTotals[quote] ? "long" : currencyTotals[base] < currencyTotals[quote] ? "short" : "neutral",
                      favors: currencyTotals[base] !== currencyTotals[quote] ? (currencyTotals[base] > currencyTotals[quote] ? base : quote) : null,
                    },
                    {
                      label: lang === "cz" ? "COT Report (Spekulanti) — % z open interest" : "COT Report (Speculators) — % of open interest",
                      baseVal: baseNetPct !== null ? `${(baseNetPct * 100).toFixed(1)}%` : "—",
                      quoteVal: quoteNetPct !== null ? `${(quoteNetPct * 100).toFixed(1)}%` : "—",
                      aligns: (baseNetPct !== null && quoteNetPct !== null) ? (baseNetPct > quoteNetPct ? "long" : baseNetPct < quoteNetPct ? "short" : "neutral") : "neutral",
                      favors: (baseNetPct !== null && quoteNetPct !== null && baseNetPct !== quoteNetPct) ? (baseNetPct > quoteNetPct ? base : quote) : null,
                    },
                    {
                      label: (lang === "cz" ? "Sezóna (Seasonality) — " : "Seasonal — ") + curMonth,
                      baseVal: baseSeas !== null ? `${baseSeas > 0 ? "+" : ""}${baseSeas.toFixed(1)}%` : "—",
                      quoteVal: quoteSeas !== null ? `${quoteSeas > 0 ? "+" : ""}${quoteSeas.toFixed(1)}%` : "—",
                      aligns: (baseSeas !== null && quoteSeas !== null) ? (baseSeas > quoteSeas ? "long" : baseSeas < quoteSeas ? "short" : "neutral") : "neutral",
                      favors: (baseSeas !== null && quoteSeas !== null && baseSeas !== quoteSeas) ? (baseSeas > quoteSeas ? base : quote) : null,
                    },
                    {
                      label: (lang === "cz" ? "Tržní nálada (Risk Sentiment) — " : "Market Sentiment — ") + (mktMode === "risk_on" ? "RISK ON" : mktMode === "risk_off" ? "RISK OFF" : "NEUTRAL"),
                      baseVal: RISK_CHAR_LABEL[RISK_CHAR[base]],
                      quoteVal: RISK_CHAR_LABEL[RISK_CHAR[quote]],
                      aligns: riskAligns,
                      favors: riskFavors,
                    },
                    {
                      label: lang === "cz" ? "Carry Trade (CB Sazby / Interest Rates)" : "Carry Trade (CB Rates / Interest Rates)",
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
                      <button onClick={() => setSelectedPair(null)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 9, marginBottom: 10 }}>← {lang === "cz" ? "Zpět" : "Back"}</button>

                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: C.text, letterSpacing: 1 }}>{pair}</div>
                          <div style={{ fontSize: 8, color: C.muted }}>{base} {lang === "cz" ? "základní" : "base"} · {quote} {lang === "cz" ? "kótovací" : "quote"}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 26, fontWeight: 900, color: pairCol, lineHeight: 1 }}>{pairScore > 0 ? "+" : ""}{pairScore}</div>
                          <div style={{ fontSize: 9, color: pairCol, fontWeight: 700 }}>{pairBias}</div>
                        </div>
                      </div>

                      <div style={{ background: `${confluenceCol}12`, border: `1px solid ${confluenceCol}40`, borderRadius: 6, padding: "7px 10px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{lang === "cz" ? "SHODA FAKTORŮ (Confluence)" : "FACTOR CONFLUENCE"}</div>
                          <div style={{ fontSize: 8, color: C.muted }}>{lang === "cz" ? "Kolik faktorů podporuje aktuální bias" : "How many factors support current bias"}</div>
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
                                <div style={{ fontSize: 6, color: alCol, lineHeight: 1.2 }}>{f.favors ? `→ ${f.favors}` : (lang === "cz" ? "neutr." : "neutr.")}</div>
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
                      <div style={{ fontSize: 7, color: C.muted, marginTop: 7 }}>{lang === "cz" ? "✓ podporuje nákup · ✗ podporuje prodej · — neutrální" : "✓ supports buy · ✗ supports sell · — neutral"}</div>

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
                            <div style={{ fontSize: 8, color: C.textDim, marginBottom: 6 }}>{lang === "cz" ? `HISTORICKÉ SKÓRE — posledních ${points.length} dní` : `HISTORICAL SCORE — last ${points.length} days`}</div>
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
                            <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 6 }}>{lang === "cz" ? "POSLEDNÍ ZPRÁVY" : "RECENT NEWS"}</div>
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
                            <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 6 }}>{lang === "cz" ? "NADCHÁZEJÍCÍ UDÁLOSTI" : "UPCOMING EVENTS"}</div>
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
                                      {e.forecast && <span style={{ fontSize: 7, color: C.muted }}>{lang === "cz" ? "Oček.:" : "Exp.:"} {e.forecast}</span>}
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
                    <SectionLabel>{t("pairsTitle")}</SectionLabel>
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
                  <SectionLabel>{t("cbTitle")}</SectionLabel>
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
                          <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>{lang === "cz" ? "Posledni:" : "Last:"} {cb.lastChange}</div>
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
                    <div style={{ fontSize: 9, color: C.muted }}>{t("watchNoData")}</div>
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
      {isMobile && <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "8px 12px", marginTop: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 6 }}>{t("komodity")}</div>
        {commodities.length === 0 ? (
          <div style={{ fontSize: 9, color: C.muted }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>
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
        <span>⚡ {t("footerSources")}</span>
        <span>{t("footerDisclaimer")}</span>
      </div>
    </div>
    </div>
    </ThemeContext.Provider>
    </LangContext.Provider>
  );
}
