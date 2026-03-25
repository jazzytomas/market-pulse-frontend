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
  tabSeasonal:     { cz: "📈 SEZÓNA", en: "📈 SEASONAL" },
  tabHistory:      { cz: "🕐 HISTORIE", en: "🕐 HISTORY" },
  tabFearGreed:    { cz: "😱 FEAR&GREED", en: "😱 FEAR&GREED" },
  tabBacktest:     { cz: "🎯 BACKTEST", en: "🎯 BACKTEST" },
  tabEducation:    { cz: "🎓 VÝUKA", en: "🎓 EDUCATION" },
  tabGuide:        { cz: "📖 PRŮVODCE", en: "📖 GUIDE" },
  // Tabs (right panel)
  tabPairs:        { cz: "PÁRY", en: "PAIRS" },
  tabStatus:       { cz: "STATUS", en: "STATUS" },
  tabCurrencies:   { cz: "MĚNY", en: "CURRENCIES" },
  tabCbRates:      { cz: "CB SAZBY", en: "CB RATES" },
  tabWatchlist:    { cz: "WATCHLIST", en: "WATCHLIST" },
  // Section labels
  riskSentiment:   { cz: "RISK SENTIMENT", en: "RISK SENTIMENT" },
  menovy:          { cz: "MĚNOVÝ PŘEHLED", en: "CURRENCY OVERVIEW" },
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

const NEUTRAL_THRESHOLD = 5;
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
  const clampedScore = Math.max(-100, Math.min(100, score));
  const pct = ((clampedScore + 100) / 200) * 100;
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
      padding: "6px 12px 9px", fontSize: 13, letterSpacing: 1,
      cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: active ? 700 : 600,
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
  const [pairNewsFilter, setPairNewsFilter] = useState("HIGH");
  const [openGuide, setOpenGuide] = useState(null);
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [scenarioFilter, setScenarioFilter] = useState("HIGH");
  const [scenarioPage, setScenarioPage] = useState(1);
  const [eventDay, setEventDay] = useState(null);
  const [eduTab, setEduTab] = useState("tech");
  const [scanning, setScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(() => localStorage.getItem("mp_last_scan") || "--:--:--");
  const [commodities, setCommodities] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [marketTab, setMarketTab] = useState("commodities");
  const [historyData, setHistoryData] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [seasonalLive, setSeasonalLive] = useState([]);
  const [seasonalYears, setSeasonalYears] = useState(10);
  const [correlationData, setCorrelationData] = useState(null);
  const [currencyCorr, setCurrencyCorr] = useState(null);
  const [corrView, setCorrView] = useState("pairs"); // "pairs" or "currencies"
  const [backtestData, setBacktestData] = useState(null);
  const [btPage, setBtPage] = useState(1);
  const [fearGreedData, setFearGreedData] = useState(null);
  const [fgHistory, setFgHistory] = useState([]);
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
    const fetchStocks = () => fetch(`${API}/api/stocks`).then(r => r.json()).then(data => setStocksData(data)).catch(() => {});
    const fetchCrypto = () => fetch(`${API}/api/crypto`).then(r => r.json()).then(data => setCryptoData(data)).catch(() => {});
    fetchCommodities(); fetchStocks(); fetchCrypto();
    const id = setInterval(() => { fetchCommodities(); fetchStocks(); fetchCrypto(); }, 300000);
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
    fetch(`${API}/api/currency_correlation`)
      .then(r => r.json())
      .then(data => setCurrencyCorr(data))
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
    fetch(`${API}/api/fg_history`)
      .then(r => r.json())
      .then(data => setFgHistory(Array.isArray(data) ? data : []))
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
    const biasDir = pairScore > 0 ? "long" : pairScore < 0 ? "short" : "neutral";
    const biasCount = biasDir === "long" ? longCount : biasDir === "short" ? shortCount : Math.max(longCount, shortCount);
    return { pairScore, biasDir, biasCount, longCount, shortCount, total: 5 };
  };

  const ALL_PAIRS = [
    // USD pairs
    { pair: "EUR/USD", base: "EUR", quote: "USD" },
    { pair: "GBP/USD", base: "GBP", quote: "USD" },
    { pair: "USD/JPY", base: "USD", quote: "JPY" },
    { pair: "NZD/USD", base: "NZD", quote: "USD" },
    { pair: "USD/CHF", base: "USD", quote: "CHF" },
    { pair: "USD/CAD", base: "USD", quote: "CAD" },
    { pair: "AUD/USD", base: "AUD", quote: "USD" },
    // EUR crosses
    { pair: "EUR/NZD", base: "EUR", quote: "NZD" },
    { pair: "EUR/JPY", base: "EUR", quote: "JPY" },
    { pair: "EUR/GBP", base: "EUR", quote: "GBP" },
    { pair: "EUR/CHF", base: "EUR", quote: "CHF" },
    { pair: "EUR/CAD", base: "EUR", quote: "CAD" },
    { pair: "EUR/AUD", base: "EUR", quote: "AUD" },
    // GBP crosses
    { pair: "GBP/AUD", base: "GBP", quote: "AUD" },
    { pair: "GBP/NZD", base: "GBP", quote: "NZD" },
    { pair: "GBP/JPY", base: "GBP", quote: "JPY" },
    { pair: "GBP/CAD", base: "GBP", quote: "CAD" },
    { pair: "GBP/CHF", base: "GBP", quote: "CHF" },
    // NZD crosses
    { pair: "NZD/JPY", base: "NZD", quote: "JPY" },
    { pair: "NZD/CHF", base: "NZD", quote: "CHF" },
    { pair: "NZD/CAD", base: "NZD", quote: "CAD" },
    // CHF crosses
    { pair: "CHF/JPY", base: "CHF", quote: "JPY" },
    // CAD crosses
    { pair: "CAD/JPY", base: "CAD", quote: "JPY" },
    { pair: "CAD/CHF", base: "CAD", quote: "CHF" },
    // AUD crosses
    { pair: "AUD/NZD", base: "AUD", quote: "NZD" },
    { pair: "AUD/JPY", base: "AUD", quote: "JPY" },
    { pair: "AUD/CHF", base: "AUD", quote: "CHF" },
    { pair: "AUD/CAD", base: "AUD", quote: "CAD" },
  ];

  const pairsWithConfluence = ALL_PAIRS.map(p => ({ ...p, ...computeConfluenceForPair(p.base, p.quote) }))
    .sort((a, b) => {
      // Sort by confluence first, then by absolute score
      if (b.biasCount !== a.biasCount) return b.biasCount - a.biasCount;
      const scoreA = Math.abs(Math.round(currencyTotals[a.base] - currencyTotals[a.quote]));
      const scoreB = Math.abs(Math.round(currencyTotals[b.base] - currencyTotals[b.quote]));
      return scoreB - scoreA;
    });
  const topSetups = pairsWithConfluence.slice(0, 4);

  const corrColor = (val) => {
    if (val >= 0.7) return C.green;
    if (val <= -0.7) return C.red;
    if (Math.abs(val) <= 0.3) return C.muted;
    return C.yellow;
  };

  return (
    <LangContext.Provider value={lang}>
    <ThemeContext.Provider value={C}>
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "inherit" }}>

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
              <img src={dk ? "/logo.svg" : "/logo-light.svg"} alt="markeTrade" style={{ height: 42, objectFit: "contain" }} />
              <div style={{ fontSize: 7, color: C.textDim, letterSpacing: 3, fontFamily: "Orbitron, monospace" }}>{t("aiEngine")}</div>
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

    <div style={{ maxWidth: 1520, margin: "0 auto", padding: 14, boxSizing: "border-box", ...(isMobile ? { overflowX: "hidden", width: "100%" } : {}) }}>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "210px 1fr", gap: 12, ...(isMobile ? { width: "100%", minWidth: 0 } : {}) }}>

        {/* LEFT – desktop sidebar */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            {/* Markets – Commodities / Stocks / Crypto tabs */}
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "10px 12px" }}>
              <div style={{ display: "flex", gap: 0, marginBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                {[
                  { key: "commodities", label: lang === "cz" ? "Komodity" : "Commodities" },
                  { key: "stocks", label: lang === "cz" ? "Akcie" : "Stocks" },
                  { key: "crypto", label: "Krypto" },
                ].map(tab => (
                  <div key={tab.key} onClick={() => setMarketTab(tab.key)}
                    style={{ padding: "4px 10px", fontSize: 9, fontWeight: marketTab === tab.key ? 700 : 400,
                      color: marketTab === tab.key ? C.accent : C.muted, cursor: "pointer",
                      borderBottom: marketTab === tab.key ? `2px solid ${C.accent}` : "2px solid transparent",
                      letterSpacing: 1 }}>
                    {tab.label}
                  </div>
                ))}
              </div>
              {(() => {
                const items = marketTab === "commodities" ? commodities : marketTab === "stocks" ? stocksData : cryptoData;
                if (items.length === 0) return <div style={{ fontSize: 9, color: C.muted }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>;
                return items.map(c => {
                  const chCol = c.change > 0 ? C.green : c.change < 0 ? C.red : C.yellow;
                  return (
                    <div key={c.name} style={{ marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{c.name}</span>
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <span style={{ fontSize: 9, color: chCol }}>{c.change > 0 ? "▲" : c.change < 0 ? "▼" : "—"} {Math.abs(c.change)}%</span>
                          <span style={{ fontSize: 9, color: C.textDim }}>{c.price}</span>
                        </div>
                      </div>
                      {c.currencies && <div><span style={{ fontSize: 8, color: C.muted }}>{c.currencies}</span></div>}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* RIGHT / mobile-full */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>

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
                <div style={{ fontSize: 8, letterSpacing: 2, color: C.textDim, marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>{t("menovy")}</div>
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
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: 14, ...(isMobile ? { minHeight: 400, order: 2 } : {}) }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label={t("tabScenarios")} active={centerTab === "scenarios"} onClick={() => setCenterTab("scenarios")} />
              <TabBtn label={t("tabEvents")} active={centerTab === "calendar"} onClick={() => setCenterTab("calendar")} />
              <TabBtn label={t("tabCot")} active={centerTab === "cot"} onClick={() => setCenterTab("cot")} />
              <TabBtn label={t("tabCorrelation")} active={centerTab === "corr"} onClick={() => setCenterTab("corr")} />
              <TabBtn label={t("tabSeasonal")} active={centerTab === "seasonal"} onClick={() => setCenterTab("seasonal")} />
              <TabBtn label={t("tabHistory")} active={centerTab === "history"} onClick={() => setCenterTab("history")} />
              <TabBtn label={t("tabFearGreed")} active={centerTab === "feargreed"} onClick={() => setCenterTab("feargreed")} />
              <TabBtn label={t("tabBacktest")} active={centerTab === "backtest"} onClick={() => setCenterTab("backtest")} />
              <TabBtn label={t("tabEducation")} active={centerTab === "education"} onClick={() => setCenterTab("education")} />
              <TabBtn label={t("tabGuide")} active={centerTab === "guide"} onClick={() => setCenterTab("guide")} />
            </div>

            <div>

            {centerTab === "scenarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                  {[{ key: "HIGH", label: t("filterHigh") }, { key: "MED", label: t("filterMed") }, { key: "OLD", label: t("filterOld") }].map(f => (
                    <button key={f.key} onClick={() => { setScenarioFilter(f.key); setScenarioPage(1); }} style={{
                      fontSize: 9, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: scenarioFilter === f.key ? 700 : 400,
                      background: scenarioFilter === f.key ? C.accent : C.border,
                      color: scenarioFilter === f.key ? "#000" : C.textDim,
                      border: `1px solid ${scenarioFilter === f.key ? C.accent : C.border}`
                    }}>{f.label}</button>
                  ))}
                  <span style={{ fontSize: 9, color: C.textDim, alignSelf: "center", marginLeft: 4 }}>{t("clickDetail")}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const PER_PAGE = 5;
                  const sorted = [...scenarios].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                  const allHigh = sorted.filter(s => s.weight === "HIGH");
                  const activeHigh = allHigh.filter(s => !s.demoted_at);
                  const demotedHigh = allHigh.filter(s => s.demoted_at).map(s => ({ ...s, risk_score: Math.round((s.risk_score || 0) * 0.4) }));
                  const fullList = scenarioFilter === "HIGH"
                    ? activeHigh
                    : scenarioFilter === "OLD"
                    ? demotedHigh
                    : sorted.filter(s => s.weight === "MED");
                  const totalPages = Math.max(1, Math.ceil(fullList.length / PER_PAGE));
                  const safePage = Math.min(scenarioPage, totalPages);
                  const list = fullList.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
                  return (<>
                  {list.map(s => {
                    const isExp = expandedScenario === s.id;
                    const isMed = s.weight === "MED";
                    const sc = (s.risk_score || 0) > 0 ? C.green : C.red;
                    const rScore = s.risk_score || 0;
                    const summaryText = lang === "cz" && s.summary_cz ? s.summary_cz : s.summary;
                    return (
                      <div key={s.id} style={{ border: `1px solid ${isMed ? C.border : sc + "55"}`, borderLeft: `3px solid ${isMed ? "#555" : sc}`, borderRadius: 6, background: isMed ? `${C.panel}88` : `${sc}06`, overflow: "hidden" }}>
                        <div onClick={() => setExpandedScenario(isExp ? null : s.id)} style={{ padding: isMed ? "5px 10px" : "7px 12px", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                            <div style={{ fontSize: isMed ? 10 : 11, fontWeight: isMed ? 500 : 700, color: isMed ? C.textDim : C.text, flex: 1, paddingRight: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 8, color: s.weight === "HIGH" ? "#000" : C.muted, background: s.weight === "HIGH" ? "#c9a227" : C.border, fontWeight: s.weight === "HIGH" ? 700 : 400, padding: "1px 5px", borderRadius: 3 }}>{s.weight}</span>
                              <span style={{ fontSize: isMed ? 11 : 13, fontWeight: 700, color: isMed ? C.muted : sc }}>{rScore > 0 ? "+" : ""}{rScore}</span>
                              <span style={{ fontSize: 9, color: C.textDim }}>{isExp ? "▲" : "▼"}</span>
                            </div>
                          </div>
                          {!isExp && <div style={{ fontSize: 8, color: C.muted, marginBottom: isMed ? 1 : 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summaryText}</div>}
                          {isExp && <div style={{ fontSize: 9, color: C.muted, marginBottom: isMed ? 2 : 5 }}>{summaryText}</div>}
                          {!isMed && <ScoreBar score={rScore} />}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
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
                  })}
                  {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 4 }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setScenarioPage(p)} style={{
                          fontSize: 9, width: 26, height: 26, borderRadius: 4, cursor: "pointer", fontWeight: p === safePage ? 700 : 400,
                          background: p === safePage ? C.accent : C.border,
                          color: p === safePage ? "#000" : C.textDim,
                          border: `1px solid ${p === safePage ? C.accent : C.border}`
                        }}>{p}</button>
                      ))}
                    </div>
                  )}
                  </>);
                })()}
                </div>
              </div>
            )}

            {centerTab === "calendar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const now = new Date();
                  const sorted = [...events].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
                  // Group by day
                  const dayMap = {};
                  sorted.forEach(ev => {
                    const d = new Date(ev.event_time);
                    const key = d.toISOString().slice(0, 10);
                    if (!dayMap[key]) dayMap[key] = [];
                    dayMap[key].push(ev);
                  });
                  const days = Object.keys(dayMap).sort();
                  const todayKey = now.toISOString().slice(0, 10);
                  const activeDay = eventDay && days.includes(eventDay) ? eventDay : (days.includes(todayKey) ? todayKey : days[0]);
                  const dayEvents = dayMap[activeDay] || [];
                  const DAY_NAMES_CZ = ["Ne","Po","Út","St","Čt","Pá","So"];
                  const DAY_NAMES_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

                  return (<>
                    {/* Day tabs */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                      {days.map(day => {
                        const d = new Date(day + "T12:00:00");
                        const dn = lang === "cz" ? DAY_NAMES_CZ[d.getDay()] : DAY_NAMES_EN[d.getDay()];
                        const dd = d.getDate();
                        const isToday = day === todayKey;
                        const isActive = day === activeDay;
                        const highCount = (dayMap[day] || []).filter(e => e.impact === "HIGH").length;
                        return (
                          <button key={day} onClick={() => setEventDay(day)} style={{
                            fontSize: 9, padding: "4px 10px", borderRadius: 4, cursor: "pointer",
                            fontWeight: isActive ? 700 : 400,
                            background: isActive ? C.accent : C.border,
                            color: isActive ? "#000" : C.textDim,
                            border: isActive ? `1px solid ${C.accent}` : isToday ? `1px solid ${C.accent}88` : `1px solid ${C.border}`,
                            position: "relative"
                          }}>
                            {dn} {dd}
                            {highCount > 0 && <span style={{ fontSize: 7, color: isActive ? "#600" : C.red, marginLeft: 3 }}>{highCount}H</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Events for selected day */}
                    {dayEvents.map((ev, i) => {
                      const evDate = new Date(ev.event_time);
                      const isPast = evDate < now;
                      const col = ev.impact === "HIGH" ? C.red : ev.impact === "MED" ? C.orange : C.muted;
                      const time = (() => {
                        try {
                          const d = new Date(ev.event_time);
                          return d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
                        } catch { return ""; }
                      })();
                      const score = ev.score;
                      const scoreColor = score == null ? null : score > 0 ? C.green : score < 0 ? C.red : C.yellow;
                      return (
                        <div key={i} style={{ border: `1px solid ${isPast ? C.border : col + "55"}`, borderLeft: `3px solid ${isPast ? C.muted : col}`, borderRadius: 6, padding: "10px 12px", opacity: isPast ? 0.45 : 1 }}>
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
                              <span style={{ fontSize: 10, color: isPast ? C.textDim : C.accent }}>{time}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 14 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ fontSize: 7, color: C.textDim, letterSpacing: 1 }}>FORECAST</span>
                              <span style={{ fontSize: 10, color: C.text }}>{ev.forecast && ev.forecast.trim() ? ev.forecast : "—"}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ fontSize: 7, color: C.textDim, letterSpacing: 1 }}>PREVIOUS</span>
                              <span style={{ fontSize: 10, color: C.muted }}>{ev.previous && ev.previous.trim() ? ev.previous : "—"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {dayEvents.length === 0 && <div style={{ fontSize: 9, color: C.muted }}>{t("noEvents")}</div>}
                  </>);
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                      {cotData.map(c => {
                        const col = c.sentiment === "bullish" ? C.green : C.red;
                        const longPct = Math.round(((c.long || 0) / maxVal) * 100);
                        const shortPct = Math.round(((c.short || 0) / maxVal) * 100);
                        return (
                          <div key={c.currency} style={{ padding: "6px 8px", background: `${col}08`, border: `1px solid ${col}33`, borderRadius: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 10, fontWeight: 900, color: col }}>{c.currency}</span>
                              <span style={{ fontSize: 7, color: col }}>{c.sentiment}</span>
                            </div>
                            <div style={{ marginBottom: 3 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 7, color: C.green }}>L</span>
                                <span style={{ fontSize: 7, color: C.green }}>{((c.long || 0) / 1000).toFixed(0)}K</span>
                              </div>
                              <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 3 }}>
                                <div style={{ width: `${longPct}%`, height: "100%", background: C.green, borderRadius: 3 }} />
                              </div>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 7, color: C.red }}>S</span>
                                <span style={{ fontSize: 7, color: C.red }}>{((c.short || 0) / 1000).toFixed(0)}K</span>
                              </div>
                              <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 3 }}>
                                <div style={{ width: `${shortPct}%`, height: "100%", background: C.red, borderRadius: 3 }} />
                              </div>
                            </div>
                            <div style={{ fontSize: 8, fontWeight: 700, color: col, textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: 3 }}>
                              {c.net > 0 ? "+" : ""}{(c.net || 0).toLocaleString()}
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
                </div>


                {/* MĚNY */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: C.accent, letterSpacing: 2, marginBottom: 8 }}>
                    {lang === "cz" ? "KORELACE MĚN" : "CURRENCY CORRELATION"}
                    {currencyCorr && currencyCorr.date && (
                      <span style={{ fontSize: 8, fontWeight: 400, color: C.muted, marginLeft: 8 }}>
                        {currencyCorr.days}D · {lang === "cz" ? "k" : "as of"} {currencyCorr.date}
                      </span>
                    )}
                  </div>
                  {!currencyCorr || !currencyCorr.currencies?.length ? (
                    <div style={{ fontSize: 9, color: C.muted, padding: "20px 0", textAlign: "center" }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
                        <thead>
                          <tr>
                            <td style={{ padding: "4px 6px", color: C.muted }}></td>
                            {currencyCorr.currencies.map(c => (
                              <td key={c} style={{ padding: "4px 6px", color: C.textDim, textAlign: "center", fontSize: 9, fontWeight: 700 }}>{c}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currencyCorr.currencies.map((cur, i) => (
                            <tr key={cur}>
                              <td style={{ padding: "4px 6px", color: C.textDim, fontSize: 9, fontWeight: 700 }}>{cur}</td>
                              {currencyCorr.matrix[i].map((val, j) => (
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
                  <div style={{ background: C.bg, border: `1px solid ${col}44`, borderRadius: 10, padding: "14px 10px", textAlign: "center", height: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: C.textDim, marginBottom: 8 }}>{label}</div>
                    <svg width="120" height="72" viewBox="0 0 140 82" style={{ overflow: "visible" }}>
                      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none" stroke={C.border} strokeWidth={sw} strokeLinecap="round" />
                      {pct > 0 && <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`}
                        fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" />}
                      <text x={cx} y={cy - 6} textAnchor="middle" fill={col} fontSize="22" fontWeight="900" fontFamily="monospace">{pct}</text>
                      <text x={cx - r} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize="7">0</text>
                      <text x={cx + r} y={cy + 14} textAnchor="middle" fill={C.muted} fontSize="7">100</text>
                    </svg>
                    <div style={{ fontSize: 12, fontWeight: 900, color: col, marginTop: -4 }}>{data.label}</div>
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 4, minHeight: 14 }}>{data.vix ? `VIX ${data.vix}` : ""}</div>
                  </div>
                );
              };
              return (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                      { label: "FOREX", icon: "💱", data: fearGreedData?.forex, histKey: "forex" },
                      { label: lang === "cz" ? "AKCIE" : "STOCKS", icon: "📈", data: fearGreedData?.stocks, histKey: "stocks" },
                      { label: "KRYPTO", icon: "₿", data: fearGreedData?.crypto, histKey: "crypto" },
                    ].map(fg => (
                      <div key={fg.label}>
                        <FGGauge label={fg.label} icon={fg.icon} data={fg.data} />
                        {fgHistory.length > 1 && (
                          <div style={{ marginTop: 6, padding: "6px 8px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                            <div style={{ fontSize: 7, color: C.muted, marginBottom: 4, textAlign: "center" }}>{lang === "cz" ? "HISTORIE" : "HISTORY"}</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
                              {[...fgHistory].reverse().map((h, i) => {
                                const val = h[fg.histKey];
                                if (val == null) return <div key={i} style={{ flex: 1 }} />;
                                const barH = Math.max(3, (val / 100) * 26);
                                const col = fgColor(val);
                                return (
                                  <div key={i} title={`${h.date}: ${val}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 28 }}>
                                    <div style={{ width: "100%", height: barH, background: col, borderRadius: 2, opacity: 0.85, minWidth: 3 }} />
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                              <span style={{ fontSize: 6, color: C.muted }}>{fgHistory[fgHistory.length - 1]?.date?.slice(5)}</span>
                              <span style={{ fontSize: 6, color: C.muted }}>{fgHistory[0]?.date?.slice(5)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
                    {backtestData.recent && backtestData.recent.length > 0 && (() => {
                      const BT_PER_PAGE = 5;
                      const BT_MAX_PAGES = 10;
                      const totalBtPages = Math.min(BT_MAX_PAGES, Math.max(1, Math.ceil(backtestData.recent.length / BT_PER_PAGE)));
                      const safeBtPage = Math.min(btPage, totalBtPages);
                      const btList = backtestData.recent.slice((safeBtPage - 1) * BT_PER_PAGE, safeBtPage * BT_PER_PAGE);
                      return (
                      <div>
                        <SectionLabel>{t("btRecent")}</SectionLabel>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {btList.map((r, i) => {
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
                        {totalBtPages > 1 && (
                          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
                            {Array.from({ length: totalBtPages }, (_, i) => i + 1).map(p => (
                              <button key={p} onClick={() => setBtPage(p)} style={{
                                fontSize: 9, width: 26, height: 26, borderRadius: 4, cursor: "pointer", fontWeight: p === safeBtPage ? 700 : 400,
                                background: p === safeBtPage ? C.accent : C.border,
                                color: p === safeBtPage ? "#000" : C.textDim,
                                border: `1px solid ${p === safeBtPage ? C.accent : C.border}`
                              }}>{p}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {centerTab === "education" && (() => {
              const Section = ({ emoji, title, children, highlight }) => (
                <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${C.border}`, ...(highlight ? { background: `${C.accent}08`, borderRadius: 10, padding: 14, border: `1px solid ${C.accent}33` } : {}) }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: highlight ? C.accent : C.text, letterSpacing: 2, marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>{emoji} {title}</div>
                  {children}
                </div>
              );
              const P = ({ children }) => <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.7, marginBottom: 8 }}>{children}</div>;
              const Sub = ({ title, children }) => (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
                  {children}
                </div>
              );
              return (
                <div style={{ fontSize: 9, lineHeight: 1.6 }}>

                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {[{ key: "tech", cz: "📐 TECHNICKÁ ANALÝZA", en: "📐 TECHNICAL ANALYSIS" }, { key: "fund", cz: "🏦 FUNDAMENTÁLNÍ ANALÝZA", en: "🏦 FUNDAMENTAL ANALYSIS" }].map(t2 => (
                      <button key={t2.key} onClick={() => setEduTab(t2.key)} style={{
                        flex: 1, padding: "8px 12px", fontSize: 10, fontWeight: eduTab === t2.key ? 700 : 500,
                        fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
                        background: eduTab === t2.key ? `${C.accent}18` : C.bg,
                        border: `1px solid ${eduTab === t2.key ? C.accent : C.border}`,
                        color: eduTab === t2.key ? C.accent : C.textDim,
                        borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                      }}>{lang === "cz" ? t2.cz : t2.en}</button>
                    ))}
                  </div>

                  {eduTab === "tech" && <>

                  <Section emoji="⭐" title={lang === "cz" ? "FRACTAL BREAK (DOPORUČENÁ TAKTIKA)" : "FRACTAL BREAK (RECOMMENDED TACTIC)"} highlight>
                    <P>{lang === "cz"
                      ? "Trh je fraktální – stejná struktura (swing highs a swing lows) se opakuje na všech timeframech. Fractal break znamená prolomení klíčového swing pointu, čímž se potvrdí pokračování nebo změna trendu."
                      : "The market is fractal – the same structure (swing highs and swing lows) repeats on all timeframes. A fractal break means breaking a key swing point, confirming trend continuation or reversal."}</P>
                    <Sub title={lang === "cz" ? "Klíčové pojmy:" : "Key concepts:"}>
                      <P>{lang === "cz"
                        ? "• Swing High = bod kde cena udělala lokální maximum a otočila se dolů. • Swing Low = bod kde cena udělala lokální minimum a otočila se nahoru. • BOS (Break of Structure) = cena prorazí poslední swing high (bullish) nebo swing low (bearish) → potvrzení trendu. • CHoCH (Change of Character) = první prolomení proti aktuálnímu trendu → signál možného obratu."
                        : "• Swing High = point where price made a local maximum and turned down. • Swing Low = point where price made a local minimum and turned up. • BOS (Break of Structure) = price breaks last swing high (bullish) or swing low (bearish) → trend confirmation. • CHoCH (Change of Character) = first break against current trend → possible reversal signal."}</P>
                    </Sub>
                    <Sub title={lang === "cz" ? "Jak obchodovat:" : "How to trade:"}>
                      <P>{lang === "cz"
                        ? "1. Urči bias na vyšším TF (Daily/H4) – hledej BOS pro směr trendu. 2. Počkej na BOS na nižším TF (H1/M15) ve stejném směru. 3. Po BOS nehledej entry na breakoutu – počkej na retracement do Order Blocku nebo Fair Value Gapu. 4. Entry v OB/FVG zóně, SL za swing point, TP na další strukturální úroveň nebo RRR min. 1:2."
                        : "1. Determine bias on higher TF (Daily/H4) – look for BOS for trend direction. 2. Wait for BOS on lower TF (H1/M15) in the same direction. 3. After BOS don't enter on the breakout – wait for retracement into Order Block or Fair Value Gap. 4. Entry in OB/FVG zone, SL beyond swing point, TP at next structural level or RRR min 1:2."}</P>
                    </Sub>
                    <Sub title={lang === "cz" ? "Proč to funguje:" : "Why it works:"}>
                      <P>{lang === "cz"
                        ? "Cena nemůže změnit směr bez vytvoření swing pointu. Fractal break vynucuje disciplínu – obchoduješ pouze se strukturou, s potvrzeným biasem z vyššího TF, a vstupuješ na retracementu místo honění breakoutů."
                        : "Price cannot reverse without forming a swing point. Fractal break forces discipline – you only trade with structure, with confirmed bias from higher TF, and enter on retracement instead of chasing breakouts."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="📊" title={lang === "cz" ? "EMA (EXPONENCIÁLNÍ KLOUZAVÝ PRŮMĚR)" : "EMA (EXPONENTIAL MOVING AVERAGE)"}>
                    <P>{lang === "cz"
                      ? "EMA reaguje rychleji na cenu než SMA, protože dává větší váhu posledním svíčkám. Nejpoužívanější periody jsou 9, 21, 50 a 200."
                      : "EMA reacts faster to price than SMA because it gives more weight to recent candles. Most common periods are 9, 21, 50, and 200."}</P>
                    <Sub title={lang === "cz" ? "Základní signály:" : "Basic signals:"}>
                      <P>{lang === "cz"
                        ? "• Golden Cross: EMA 50 protne EMA 200 zdola → bullish signál. • Death Cross: EMA 50 protne EMA 200 shora → bearish signál. • Cena nad EMA 200 = uptrend, pod = downtrend. • EMA 9/21 crossover = krátkodobé entry signály."
                        : "• Golden Cross: EMA 50 crosses above EMA 200 → bullish signal. • Death Cross: EMA 50 crosses below EMA 200 → bearish signal. • Price above EMA 200 = uptrend, below = downtrend. • EMA 9/21 crossover = short-term entry signals."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="🌀" title={lang === "cz" ? "FIBONACCI RETRACEMENT" : "FIBONACCI RETRACEMENT"}>
                    <P>{lang === "cz"
                      ? "Fibonacci úrovně (23.6%, 38.2%, 50%, 61.8%, 78.6%) ukazují potenciální zóny obratu ceny v rámci trendu. Vychází z Fibonacciho posloupnosti."
                      : "Fibonacci levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) show potential price reversal zones within a trend. Based on the Fibonacci sequence."}</P>
                    <Sub title={lang === "cz" ? "Jak použít:" : "How to use:"}>
                      <P>{lang === "cz"
                        ? "1. Najdi jasný swing high a swing low. 2. Natáhni Fibo nástroj od low k high (uptrend) nebo high k low (downtrend). 3. Hledej reakci ceny na klíčových úrovních – zejména 61.8% (golden ratio) a 50%. 4. Kombinuj s S/R zónami pro silnější potvrzení."
                        : "1. Find a clear swing high and swing low. 2. Draw the Fibo tool from low to high (uptrend) or high to low (downtrend). 3. Look for price reaction at key levels – especially 61.8% (golden ratio) and 50%. 4. Combine with S/R zones for stronger confirmation."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="🧱" title={lang === "cz" ? "SUPPORT & RESISTANCE" : "SUPPORT & RESISTANCE"}>
                    <P>{lang === "cz"
                      ? "S/R úrovně jsou cenové zóny, kde se cena opakovaně zastavuje. Support = podlaha (kupci), Resistance = strop (prodejci). Čím vícekrát cena úroveň testuje, tím je silnější."
                      : "S/R levels are price zones where price repeatedly stalls. Support = floor (buyers), Resistance = ceiling (sellers). The more times price tests a level, the stronger it is."}</P>
                    <Sub title={lang === "cz" ? "Pravidla:" : "Rules:"}>
                      <P>{lang === "cz"
                        ? "• Proražený support se stává resistancí a naopak (flip). • Hledej potvrzení: pin bar, engulfing, volume spike. • Čím vyšší timeframe, tím silnější úroveň. • Nezapomeň: S/R jsou zóny, ne přesné čáry."
                        : "• Broken support becomes resistance and vice versa (flip). • Look for confirmation: pin bar, engulfing, volume spike. • Higher timeframe = stronger level. • Remember: S/R are zones, not exact lines."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="💡" title={lang === "cz" ? "SMART MONEY CONCEPT (SMC)" : "SMART MONEY CONCEPT (SMC)"}>
                    <P>{lang === "cz"
                      ? "SMC analyzuje, jak obchodují velcí hráči (banky, instituce). Klíčové koncepty: Order Blocks, Fair Value Gaps, Liquidity Sweeps a Break of Structure."
                      : "SMC analyzes how big players trade (banks, institutions). Key concepts: Order Blocks, Fair Value Gaps, Liquidity Sweeps, and Break of Structure."}</P>
                    <Sub title={lang === "cz" ? "Klíčové pojmy:" : "Key concepts:"}>
                      <P>{lang === "cz"
                        ? "• BOS (Break of Structure): prolomení posledního HH/LL → potvrzení trendu. • CHoCH (Change of Character): první prolomení proti trendu → možný obrat. • Order Block: poslední opačná svíčka před silným pohybem – instituce tam mají objednávky. • FVG (Fair Value Gap): mezera ve svíčkách kde cena neměla čas konsolidovat – cena se tam často vrací. • Liquidity Sweep: cena vezme stoploss nad/pod S/R a pak se otočí."
                        : "• BOS (Break of Structure): breaking last HH/LL → trend confirmation. • CHoCH (Change of Character): first break against trend → possible reversal. • Order Block: last opposite candle before strong move – institutions have orders there. • FVG (Fair Value Gap): gap in candles where price didn't consolidate – price often returns there. • Liquidity Sweep: price takes stops above/below S/R then reverses."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="🕯️" title={lang === "cz" ? "PRICE ACTION – SVÍČKOVÉ PATERNY" : "PRICE ACTION – CANDLE PATTERNS"}>
                    <P>{lang === "cz"
                      ? "Čtení svíček bez indikátorů. Nejdůležitější paterny pro forex:"
                      : "Reading candles without indicators. Most important patterns for forex:"}</P>
                    <Sub title={lang === "cz" ? "Obrátové paterny:" : "Reversal patterns:"}>
                      <P>{lang === "cz"
                        ? "• Pin Bar (Hammer/Shooting Star): dlouhý knot, malé tělo → odmítnutí ceny. • Engulfing: větší svíčka kompletně pohltí předchozí → silný signál obratu. • Morning/Evening Star: 3svíčkový patern na S/R úrovni."
                        : "• Pin Bar (Hammer/Shooting Star): long wick, small body → price rejection. • Engulfing: larger candle completely engulfs previous → strong reversal signal. • Morning/Evening Star: 3-candle pattern at S/R level."}</P>
                    </Sub>
                    <Sub title={lang === "cz" ? "Pokračovací paterny:" : "Continuation patterns:"}>
                      <P>{lang === "cz"
                        ? "• Inside Bar: svíčka uvnitř předchozí → konsolidace před breakoutem. • Three White Soldiers / Three Black Crows: 3 stejné silné svíčky v řadě."
                        : "• Inside Bar: candle inside previous → consolidation before breakout. • Three White Soldiers / Three Black Crows: 3 strong same-direction candles in a row."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="⚖️" title={lang === "cz" ? "RISK MANAGEMENT" : "RISK MANAGEMENT"}>
                    <P>{lang === "cz"
                      ? "Bez risk managementu i nejlepší strategie selže. Zlatá pravidla:"
                      : "Without risk management, even the best strategy will fail. Golden rules:"}</P>
                    <P>{lang === "cz"
                      ? "• Riskuj max 1–2 % účtu na obchod. • RRR (Risk Reward Ratio) minimálně 1:2 – riskuješ 20 pipů, cílíš 40+. • Vždy měj Stop Loss – nikdy neposouvej SL dál od ceny. • Position sizing: vypočítej velikost pozice podle SL vzdálenosti a % rizika. • Max 2–3 otevřené pozice najednou. • Neobchoduj po ztrátě z emocí (revenge trading)."
                      : "• Risk max 1–2% of account per trade. • RRR (Risk Reward Ratio) minimum 1:2 – risk 20 pips, target 40+. • Always have Stop Loss – never move SL further from price. • Position sizing: calculate position size based on SL distance and risk %. • Max 2–3 open positions at a time. • Don't trade after a loss from emotions (revenge trading)."}</P>
                  </Section>

                  </>}

                  {eduTab === "fund" && <>

                  <Section emoji="🏦" title={lang === "cz" ? "JAK FUNGUJE FOREX TRH" : "HOW THE FOREX MARKET WORKS"}>
                    <P>{lang === "cz"
                      ? "Forex je největší finanční trh na světě – denní objem přes $7 bilionů. Obchoduje se 24/5 ve třech hlavních seancích: Tokio (Asia), Londýn (Europe), New York (US). Největší volatilita je v overlapu Londýn + New York."
                      : "Forex is the world's largest financial market – daily volume over $7 trillion. Trades 24/5 in three main sessions: Tokyo (Asia), London (Europe), New York (US). Highest volatility during London + New York overlap."}</P>
                    <P>{lang === "cz"
                      ? "Měnové páry se skládají ze základní měny (base) a kótovací (quote). EUR/USD = kupuješ EUR za USD. Cena roste = base posiluje. Cena klesá = base oslabuje."
                      : "Currency pairs consist of base currency and quote currency. EUR/USD = you buy EUR with USD. Price rises = base strengthens. Price falls = base weakens."}</P>
                  </Section>

                  <Section emoji="📈" title={lang === "cz" ? "CENTRÁLNÍ BANKY A ÚROKOVÉ SAZBY" : "CENTRAL BANKS & INTEREST RATES"}>
                    <P>{lang === "cz"
                      ? "Centrální banky (Fed, ECB, BoE, BoJ...) řídí měnovou politiku hlavně přes úrokové sazby. To je nejsilnější fundamentální faktor na forexu."
                      : "Central banks (Fed, ECB, BoE, BoJ...) control monetary policy mainly through interest rates. This is the strongest fundamental factor in forex."}</P>
                    <Sub title={lang === "cz" ? "Zvyšování sazeb (hawkish):" : "Rate hikes (hawkish):"}>
                      <P>{lang === "cz"
                        ? "• Měna posiluje – vyšší výnosy přitahují zahraniční kapitál. • Ekonomika se zpomaluje – dražší úvěry, méně investic. • Boj proti inflaci – CB zvyšuje sazby aby zbrzdila růst cen. • Příklad: Fed zvedne sazby → USD posiluje, akcie klesají."
                        : "• Currency strengthens – higher yields attract foreign capital. • Economy slows – more expensive loans, fewer investments. • Fighting inflation – CB raises rates to slow price growth. • Example: Fed raises rates → USD strengthens, stocks fall."}</P>
                    </Sub>
                    <Sub title={lang === "cz" ? "Snižování sazeb (dovish):" : "Rate cuts (dovish):"}>
                      <P>{lang === "cz"
                        ? "• Měna oslabuje – nižší výnosy, kapitál odchází. • Ekonomika se stimuluje – levnější úvěry, více spotřeby. • Reakce na recesi nebo slabost ekonomiky. • Příklad: ECB sníží sazby → EUR oslabuje, akcie rostou."
                        : "• Currency weakens – lower yields, capital leaves. • Economy stimulated – cheaper credit, more consumption. • Response to recession or economic weakness. • Example: ECB cuts rates → EUR weakens, stocks rise."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="🔥" title={lang === "cz" ? "INFLACE A CO S NÍ" : "INFLATION & WHAT IT MEANS"}>
                    <P>{lang === "cz"
                      ? "Inflace = růst cen v ekonomice. Měří se pomocí CPI (Consumer Price Index). Cíl většiny CB je 2 %."
                      : "Inflation = rising prices in the economy. Measured by CPI (Consumer Price Index). Most CB target is 2%."}</P>
                    <Sub title={lang === "cz" ? "Vysoká inflace:" : "High inflation:"}>
                      <P>{lang === "cz"
                        ? "• CB musí zvýšit sazby → měna krátkodobě posiluje. • Ale dlouhodobě vysoká inflace = slabá měna (kupní síla klesá). • CPI vyšší než očekávání = hawkish překvapení → měna roste. • CPI nižší než oček. = dovish → měna klesá."
                        : "• CB must raise rates → currency strengthens short-term. • But long-term high inflation = weak currency (purchasing power drops). • CPI above expectations = hawkish surprise → currency rises. • CPI below expectations = dovish → currency falls."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="👷" title={lang === "cz" ? "TRH PRÁCE" : "LABOR MARKET"}>
                    <P>{lang === "cz"
                      ? "Zaměstnanost je klíčový ukazatel zdraví ekonomiky. Nejsledovanější report je US NFP (Non-Farm Payrolls) – vychází první pátek v měsíci."
                      : "Employment is a key indicator of economic health. Most watched report is US NFP (Non-Farm Payrolls) – released first Friday of the month."}</P>
                    <Sub title={lang === "cz" ? "Silný trh práce:" : "Strong labor market:"}>
                      <P>{lang === "cz"
                        ? "• Nízká nezaměstnanost → lidé utrácí → inflace roste → CB může zvýšit sazby → měna posiluje. • NFP beat (vyšší než oček.) → USD okamžitě roste, typicky 50–100+ pipů na velkých párech."
                        : "• Low unemployment → people spend → inflation rises → CB may raise rates → currency strengthens. • NFP beat (above expectations) → USD jumps immediately, typically 50–100+ pips on major pairs."}</P>
                    </Sub>
                    <Sub title={lang === "cz" ? "Slabý trh práce:" : "Weak labor market:"}>
                      <P>{lang === "cz"
                        ? "• Rostoucí nezaměstnanost → méně spotřeby → recesní signál → CB sníží sazby → měna oslabuje. • NFP miss → USD padá, safe havens (JPY, CHF, zlato) rostou."
                        : "• Rising unemployment → less spending → recession signal → CB cuts rates → currency weakens. • NFP miss → USD drops, safe havens (JPY, CHF, gold) rise."}</P>
                    </Sub>
                  </Section>

                  <Section emoji="🌍" title={lang === "cz" ? "GDP A EKONOMICKÝ RŮST" : "GDP & ECONOMIC GROWTH"}>
                    <P>{lang === "cz"
                      ? "GDP (HDP) měří celkovou produkci ekonomiky. Rostoucí GDP = zdravá ekonomika, klesající = recese."
                      : "GDP measures total economic output. Rising GDP = healthy economy, falling = recession."}</P>
                    <P>{lang === "cz"
                      ? "• GDP nad očekáváním → měna posiluje (ekonomika roste rychleji). • GDP pod oček. → měna oslabuje (zpomalení). • 2 po sobě jdoucí kvartály záporného GDP = technická recese → CB sníží sazby. • Sleduj i PMI (Purchasing Managers Index) – předbíhá GDP o 1–2 měsíce."
                      : "• GDP above expectations → currency strengthens (faster growth). • GDP below expectations → currency weakens (slowdown). • 2 consecutive quarters of negative GDP = technical recession → CB cuts rates. • Watch PMI (Purchasing Managers Index) – leads GDP by 1–2 months."}</P>
                  </Section>

                  <Section emoji="🔗" title={lang === "cz" ? "JAK TO VŠE SOUVISÍ" : "HOW IT ALL CONNECTS"}>
                    <P>{lang === "cz"
                      ? "Inflace ↑ → CB zvyšuje sazby → měna ↑ (krátkodobě) ale ekonomika ↓. Nezaměstnanost ↑ → CB snižuje sazby → měna ↓ ale ekonomika se stimuluje. GDP ↓ → recesní strach → risk-off → JPY, CHF, USD rostou, AUD, NZD klesají."
                      : "Inflation ↑ → CB raises rates → currency ↑ (short-term) but economy ↓. Unemployment ↑ → CB cuts rates → currency ↓ but economy stimulated. GDP ↓ → recession fear → risk-off → JPY, CHF, USD rise, AUD, NZD fall."}</P>
                    <P>{lang === "cz"
                      ? "Nejsilnější obchody jsou když fundamental + technická analýza ukazují stejný směr. Například: Fed hawkish + USD bullish fractal break + pozitivní NFP = silný long USD setup."
                      : "Strongest trades are when fundamental + technical analysis point the same direction. For example: Fed hawkish + USD bullish fractal break + positive NFP = strong long USD setup."}</P>
                  </Section>

                  </>}

                  <div style={{ fontSize: 8, color: C.muted, textAlign: "center", paddingTop: 4 }}>
                    {lang === "cz" ? "Toto je vzdělávací obsah · není to investiční doporučení · vždy obchoduj na demo účtu než přejdeš na real" : "This is educational content · not investment advice · always trade on demo account before going live"}
                  </div>

                </div>
              );
            })()}

            {centerTab === "guide" && (() => {
              const AccSection = ({ id, emoji, title, children }) => {
                const isOpen = openGuide === id;
                return (
                  <div style={{ marginBottom: 6, border: `1px solid ${isOpen ? C.accent + "44" : C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <div onClick={() => setOpenGuide(isOpen ? null : id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: isOpen ? `${C.accent}0a` : "transparent" }}>
                      <span style={{ fontSize: 18 }}>{emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 900, color: isOpen ? C.accent : C.text, letterSpacing: 2, flex: 1 }}>{title}</span>
                      <span style={{ fontSize: 12, color: C.muted, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                    </div>
                    {isOpen && <div style={{ padding: "0 14px 14px" }}>{children}</div>}
                  </div>
                );
              };
              const Row = ({ label, desc }) => (
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.text, minWidth: 110, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 9, color: C.textDim, lineHeight: 1.5 }}>{desc}</span>
                </div>
              );
              return (
                <div style={{ fontSize: 9, lineHeight: 1.6, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 6 }}>

                  <AccSection id="risk" emoji="🌡️" title="RISK SENTIMENT">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Celkové nálada trhu vůči riziku. Vypočítává se jako vážený průměr AI skóre zpráv + VIX index." : "Overall market risk mood. Calculated as weighted average of AI news scores + VIX index."} />
                    <Row label={lang === "cz" ? "Škála" : "Scale"} desc={lang === "cz" ? "+100 = maximální Risk ON (trhy rostou, investoři kupují riziková aktiva). −100 = maximální Risk OFF (strach, útěk do bezpečí)." : "+100 = max Risk ON (markets rising, investors buying risky assets). −100 = max Risk OFF (fear, flight to safety)."} />
                    <Row label="VIX" desc={lang === "cz" ? "Index strachu. VIX nad 25 = strach na trhu (Risk OFF). VIX pod 15 = klid (Risk ON). Váha 2× HIGH zpráva." : "Fear index. VIX above 25 = market fear (Risk OFF). VIX below 15 = calm (Risk ON). Weight = 2× HIGH news."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Risk ON → sleduj AUD, NZD, CAD. Risk OFF → sleduj USD, JPY, CHF. Neutral → čekej na potvrzení." : "Risk ON → watch AUD, NZD, CAD. Risk OFF → watch USD, JPY, CHF. Neutral → wait for confirmation."} />
                  </AccSection>

                  <AccSection id="scenarios" emoji="⚡" title={lang === "cz" ? "SCÉNÁŘE" : "SCENARIOS"}>
                    <Row label={lang === "cz" ? "Co to jsou" : "What they are"} desc={lang === "cz" ? "AI (Claude Haiku) ohodnotí každou forex-relevantní zprávu skóre a dopadem na každou měnu." : "AI (Claude Haiku) scores every forex-relevant news item and calculates impact on each currency."} />
                    <Row label="Risk score" desc={lang === "cz" ? "−100 až +100. Kladné = pozitivní pro trhy (Risk ON). Záporné = negativní (Risk OFF)." : "−100 to +100. Positive = good for markets (Risk ON). Negative = bad (Risk OFF)."} />
                    <Row label={lang === "cz" ? "HIGH váha" : "HIGH weight"} desc={lang === "cz" ? "Market-moving zprávy: NFP, rozhodnutí CB, geopolitické šoky. Počítají se 3× do sentimentu." : "Market-moving news: NFP, CB decisions, geopolitical shocks. Count 3× in sentiment."} />
                    <Row label={lang === "cz" ? "MED váha" : "MED weight"} desc={lang === "cz" ? "Důležité ale ne market-moving: komentáře CB, regionální data. Počítají se 1× do sentimentu." : "Important but not market-moving: CB comments, regional data. Count 1× in sentiment."} />
                  </AccSection>

                  <AccSection id="events" emoji="📅" title={lang === "cz" ? "EVENTS (KALENDÁŘ)" : "EVENTS (CALENDAR)"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Ekonomické události z ForexFactory pro aktuální týden. Aktualizuje se každou hodinu." : "Economic events from ForexFactory for the current week. Updates every hour."} />
                    <Row label="🔴 HIGH" desc={lang === "cz" ? "Silně market-moving: NFP, CPI, rozhodnutí Fedu/ECB/BOJ, HDP." : "Strong market-movers: NFP, CPI, Fed/ECB/BOJ decisions, GDP."} />
                    <Row label="🟡 MED" desc={lang === "cz" ? "Střední dopad: PMI, obchodní bilance, výroky bankéřů." : "Medium impact: PMI, trade balance, CB speeches."} />
                  </AccSection>

                  <AccSection id="cot" emoji="📊" title="COT (COMMITMENTS OF TRADERS)">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Týdenní report CFTC o pozicích velkých hráčů (hedge fondy) na futures trzích." : "Weekly CFTC report on positions of large players (hedge funds) in futures markets."} />
                    <Row label="NET" desc={lang === "cz" ? "Long − Short. Kladný = sázka na posílení. Záporný = slabost. Extrémní hodnoty = možný obrat." : "Long − Short. Positive = bet on strength. Negative = weakness. Extremes = possible reversal."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sleduj trend NET pozic. USD je syntetický (inverzní součet ostatních)." : "Watch NET position trend. USD is synthetic (inverse sum of others)."} />
                  </AccSection>

                  <AccSection id="corr" emoji="🔗" title={lang === "cz" ? "KORELACE" : "CORRELATION"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "30denní Pearsonova korelace mezi páry a měnami. Live data z yfinance." : "30-day Pearson correlation between pairs and currencies. Live data from yfinance."} />
                    <Row label="+1.0 / −1.0" desc={lang === "cz" ? "Identický / inverzní pohyb. Nekumuluj vysoce korelované pozice." : "Identical / inverse movement. Don't accumulate highly correlated positions."} />
                  </AccSection>

                  <AccSection id="seasonal" emoji="📈" title={lang === "cz" ? "SEZÓNNOST" : "SEASONALITY"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Průměrný měsíční výnos měn za zvolené období (1/3/5/10 let)." : "Average monthly currency returns for selected period (1/3/5/10 years)."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sezónnost je doplňkový nástroj. Silný vzor + potvrzení od COT + sentimentu = silnější signál." : "Seasonality is supplementary. Strong pattern + COT confirmation + sentiment = stronger signal."} />
                  </AccSection>

                  <AccSection id="history" emoji="🕐" title={lang === "cz" ? "HISTORIE SENTIMENTU" : "SENTIMENT HISTORY"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "7denní přehled denního risk sentimentu. Ukládá se do DB každý den." : "7-day overview of daily risk sentiment. Saved to DB every day."} />
                    <Row label={lang === "cz" ? "Jak použít" : "How to use"} desc={lang === "cz" ? "Sleduj trend. Pokud sentiment klesá 3+ dny po sobě → Risk OFF trend. Rychlý obrat → možný sentiment shift." : "Watch the trend. If sentiment drops 3+ days in a row → Risk OFF trend. Quick reversal → possible sentiment shift."} />
                  </AccSection>

                  <AccSection id="fg" emoji="😱" title="FEAR & GREED INDEX">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Kompozitní index strachu a chamtivosti trhu na škále 0–100." : "Composite market fear and greed index on 0–100 scale."} />
                    <Row label="💱 Forex" desc={lang === "cz" ? "AI sentiment (65%) + VIX (35%)." : "AI sentiment (65%) + VIX (35%)."} />
                    <Row label="📈 Stocks" desc={lang === "cz" ? "VIX (60%) + S&P 500 momentum (40%)." : "VIX (60%) + S&P 500 momentum (40%)."} />
                    <Row label="₿ Crypto" desc={lang === "cz" ? "Z alternative.me." : "From alternative.me."} />
                  </AccSection>

                  <AccSection id="commodities" emoji="🛢️" title={lang === "cz" ? "KOMODITY" : "COMMODITIES"}>
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Live ceny 7 komodit z yfinance. Aktualizuje se každých 5 minut." : "Live prices of 7 commodities from yfinance. Updates every 5 min."} />
                    <Row label={lang === "cz" ? "koreluje:" : "correlates:"} desc={lang === "cz" ? "Měny reagující na pohyb komodity. CAD ↑ = ropa roste." : "Currencies reacting to commodity moves. CAD ↑ = oil rising."} />
                  </AccSection>

                  <AccSection id="backtest" emoji="🎯" title="BACKTEST">
                    <Row label={lang === "cz" ? "Co to je" : "What it is"} desc={lang === "cz" ? "Zpětný test přesnosti AI signálů. Porovnává predikce se skutečným pohybem." : "Accuracy backtest of AI signals vs actual price moves."} />
                    <Row label={lang === "cz" ? "Jak funguje" : "How it works"} desc={lang === "cz" ? "Uloží bias měny, po 4h porovná se skutečným pohybem kurzu." : "Records currency bias, checks against actual move after 4h."} />
                  </AccSection>

                  <AccSection id="pairs" emoji="💱" title={lang === "cz" ? "MĚNOVÝ BIAS A PÁRY" : "CURRENCY BIAS & PAIRS"}>
                    <Row label={lang === "cz" ? "Skóre páru" : "Pair score"} desc={lang === "cz" ? "Bias base − bias quote. Kladné = buy, záporné = sell." : "Base bias − quote bias. Positive = buy, negative = sell."} />
                    <Row label={lang === "cz" ? "Risk ON/OFF" : "Risk ON/OFF"} desc={lang === "cz" ? "Risk ON: AUD, NZD, CAD. Risk OFF: USD, JPY, CHF. Neutral: EUR, GBP." : "Risk ON: AUD, NZD, CAD. Risk OFF: USD, JPY, CHF. Neutral: EUR, GBP."} />
                  </AccSection>

                  <div style={{ fontSize: 8, color: C.muted, textAlign: "center", paddingTop: 8, gridColumn: isMobile ? "1" : "1 / -1" }}>
                    {lang === "cz" ? "Data se aktualizují automaticky · COT každý pátek · Sezónnost každých 24h" : "Data updates automatically · COT every Friday · Seasonality every 24h"}
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
                const isDark = C.bg === "#080812";
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
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
              <TabBtn label={t("tabPairs")} active={rightTab === "pairs"} onClick={() => setRightTab("pairs")} />
              <TabBtn label={t("tabCurrencies")} active={rightTab === "currencies"} onClick={() => setRightTab("currencies")} />
              <TabBtn label={t("tabCbRates")} active={rightTab === "cb"} onClick={() => setRightTab("cb")} />
              <TabBtn label={t("tabWatchlist")} active={rightTab === "watchlist"} onClick={() => setRightTab("watchlist")} />
            </div>

            <div style={{ padding: 14 }}>


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
                const PAIRS_LIST = pairsWithConfluence;
                const RISK_CHAR = {
                  AUD: "risk_on", NZD: "risk_on", CAD: "risk_on",
                  EUR: "neutral", GBP: "neutral",
                  USD: "safe_haven", JPY: "safe_haven", CHF: "safe_haven"
                };
                const RISK_CHAR_LABEL = { risk_on: "Risk ON", safe_haven: "Safe Haven", neutral: lang === "cz" ? "Neutrální" : "Neutral" };

                if (selectedPair) {
                  const { pair, base, quote } = selectedPair;
                  const pairScore = Math.round(currencyTotals[base] - currencyTotals[quote]);
                  const pairCol = pairScore > 0 ? C.green : pairScore < 0 ? C.red : C.yellow;
                  const pairBias = pairScore > 0 ? (lang === "cz" ? "▲ NÁKUP (Long)" : "▲ BUY (Long)") : pairScore < 0 ? (lang === "cz" ? "▼ PRODEJ (Short)" : "▼ SELL (Short)") : (lang === "cz" ? "→ NEUTRÁLNÍ (Neutral)" : "→ NEUTRAL");

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
                  const biasCount = pairScore > 0 ? longCount : pairScore < 0 ? shortCount : Math.max(longCount, shortCount);
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
                          if (s.weight !== pairNewsFilter) return false;
                          const ci = typeof s.currency_impact === 'string' ? JSON.parse(s.currency_impact) : (s.currency_impact || {});
                          return (ci[base] && ci[base].score !== 0) || (ci[quote] && ci[quote].score !== 0);
                        }).slice(0, 5);
                        return (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 8, letterSpacing: 2, color: C.textDim }}>{lang === "cz" ? "ZPRÁVY" : "NEWS"}</span>
                              {["HIGH", "MED"].map(f => (
                                <button key={f} onClick={() => setPairNewsFilter(f)} style={{
                                  fontSize: 8, padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontWeight: pairNewsFilter === f ? 700 : 400,
                                  background: pairNewsFilter === f ? C.accent : C.border,
                                  color: pairNewsFilter === f ? "#000" : C.textDim,
                                  border: `1px solid ${pairNewsFilter === f ? C.accent : C.border}`
                                }}>{f}</button>
                              ))}
                            </div>
                            {relevant.length === 0 ? (
                              <div style={{ fontSize: 8, color: C.muted, padding: "8px 0" }}>{lang === "cz" ? `Žádné ${pairNewsFilter} zprávy pro tento pár.` : `No ${pairNewsFilter} news for this pair.`}</div>
                            ) : (
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
                            )}
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
                const isDark = C.bg === "#080812";
                return (
                  <div>
                    <SectionLabel>{t("pairsTitle")}</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                      {pairsWithConfluence.map(({ pair, base, quote, biasCount, biasDir }) => {
                        const score = Math.round(currencyTotals[base] - currencyTotals[quote]);
                        const col = score > 0 ? C.green : score < 0 ? C.red : C.yellow;
                        const isPerfect = biasCount === 5;
                        const perfectText = isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : C.text;
                        const perfectScore = isPerfect ? (isDark ? "#ffffff" : PERFECT_BLUE) : col;
                        return (
                          <div key={pair} onClick={() => setSelectedPair({ pair, base, quote })}
                            style={{ padding: "6px 8px",
                              background: isPerfect ? "rgba(24, 100, 220, 0.2)" : `${col}0a`,
                              border: isPerfect ? `1.5px solid ${PERFECT_BLUE}` : `1px solid ${col}33`,
                              borderLeft: `3px solid ${isPerfect ? PERFECT_BLUE : col}`, borderRadius: 6, cursor: "pointer",
                              animation: isPerfect ? "pulse 2s infinite" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                {isPerfect && <span style={{ fontSize: 9 }}>⚡</span>}
                                <span style={{ fontSize: 10, fontWeight: 700, color: perfectText }}>{pair}</span>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 900, color: col }}>{score > 0 ? "+" : ""}{score}</span>
                            </div>
                            <div style={{ marginBottom: 3 }}><ScoreBar score={score} height={3} /></div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 7, color: perfectScore, fontWeight: 700 }}>{biasCount}/5</span>
                              <span style={{ fontSize: 7, color: C.muted }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
                    {centralBanks.map(cb => {
                      const biasCol = cb.bias === "hawkish" ? C.green : cb.bias === "dovish" ? C.red : C.yellow;
                      return (
                        <div key={cb.bank} style={{ padding: "5px 7px", background: `${biasCol}08`, border: `1px solid ${biasCol}22`, borderRadius: 5 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{cb.currency}</span>
                            <span style={{ fontSize: 10, fontWeight: 900, color: biasCol }}>{cb.rate}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 7, color: C.muted }}>{cb.bank}</span>
                            <span style={{ fontSize: 7, color: biasCol, border: `1px solid ${biasCol}44`, padding: "0px 4px", borderRadius: 2 }}>{cb.bias}</span>
                          </div>
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

      {/* Markets – bottom strip (mobile only) */}
      {isMobile && <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: C.shadow, padding: "8px 12px", marginTop: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 6, borderBottom: `1px solid ${C.border}` }}>
          {[
            { key: "commodities", label: lang === "cz" ? "Komodity" : "Commodities" },
            { key: "stocks", label: lang === "cz" ? "Akcie" : "Stocks" },
            { key: "crypto", label: "Krypto" },
          ].map(tab => (
            <div key={tab.key} onClick={() => setMarketTab(tab.key)}
              style={{ padding: "3px 8px", fontSize: 9, fontWeight: marketTab === tab.key ? 700 : 400,
                color: marketTab === tab.key ? C.accent : C.muted, cursor: "pointer",
                borderBottom: marketTab === tab.key ? `2px solid ${C.accent}` : "2px solid transparent",
                letterSpacing: 1 }}>
              {tab.label}
            </div>
          ))}
        </div>
        {(() => {
          const items = marketTab === "commodities" ? commodities : marketTab === "stocks" ? stocksData : cryptoData;
          if (items.length === 0) return <div style={{ fontSize: 9, color: C.muted }}>{lang === "cz" ? "Načítám..." : "Loading..."}</div>;
          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
              {items.map(c => {
                const chCol = c.change > 0 ? C.green : c.change < 0 ? C.red : C.yellow;
                return (
                  <div key={c.name} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.text }}>{c.name}</span>
                      <span style={{ fontSize: 9, color: chCol }}>{c.change > 0 ? "▲" : c.change < 0 ? "▼" : "—"}{Math.abs(c.change)}%</span>
                    </div>
                    {c.currencies && <div><span style={{ fontSize: 7, color: C.muted }}>{c.currencies}</span></div>}
                  </div>
                );
              })}
            </div>
          );
        })()}
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
