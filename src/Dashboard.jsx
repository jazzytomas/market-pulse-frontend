import React, { useEffect, useState } from "react";

const C = {
  bg: "#f0f4f8", panel: "#ffffff", border: "#d1dce8",
  accent: "#0077cc", green: "#00914d", red: "#d93025",
  yellow: "#c17f00", orange: "#c85a00", muted: "#9ab0c4",
  text: "#1a2733", textDim: "#5a7a94",
};

const NEUTRAL_THRESHOLD = 20;

const CURRENCIES = ["USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CAD", "NZD"];

const mockScenarios = [
  {
    id: 1, title: "Fed signalizuje snižování sazeb v H2", source: "Reuters",
    riskScore: -45, time: "14:32", weight: "HIGH",
    summary: "Powell naznačil možné snížení sazeb. Tlak na dolar.",
    currencyImpact: {
      USD: { score: -60, reason: "Nižší sazby snižují atraktivitu dolaru" },
      EUR: { score: +35, reason: "EUR/USD rally — ECB zatím drží sazby" },
      JPY: { score: +50, reason: "Carry trade unwind, JPY silně posiluje" },
      GBP: { score: +20, reason: "Mírný benefit, BoE drží vyšší sazby" },
      AUD: { score: -10, reason: "Risk-off tlumí commodity měny" },
      CHF: { score: +40, reason: "Safe haven + vlastní měnová politika" },
      CAD: { score: -15, reason: "Korelace s USD, oslabení" },
      NZD: { score: -8, reason: "Mírný risk-off vliv" },
    },
  },
  {
    id: 2, title: "China PMI výrazně překonalo odhady", source: "Bloomberg",
    riskScore: +38, time: "11:15", weight: "MED",
    summary: "Manufacturing PMI 52.4 vs 50.8 očekáváno.",
    currencyImpact: {
      USD: { score: -20, reason: "Risk-on tlak" },
      EUR: { score: +15, reason: "Exportní benefit pro Evropu" },
      JPY: { score: -25, reason: "Risk-on, carry trade obnoven" },
      GBP: { score: +10, reason: "Mírný benefit" },
      AUD: { score: +55, reason: "Největší beneficient — AU exportuje do Číny" },
      CHF: { score: -15, reason: "Safe haven prodáván" },
      CAD: { score: +30, reason: "Oil rally, commodity korelace" },
      NZD: { score: +40, reason: "NZD silně koreluje s AUD a Čínou" },
    },
  },
  {
    id: 3, title: "Geopolitické napětí na Blízkém východě", source: "FT",
    riskScore: -29, time: "09:47", weight: "MED",
    summary: "Riziko přerušení dodávek ropy. Safe haven bid.",
    currencyImpact: {
      USD: { score: +25, reason: "Safe haven demand" },
      EUR: { score: -30, reason: "Evropa závislá na energiích" },
      JPY: { score: +45, reason: "Klasický safe haven" },
      GBP: { score: -20, reason: "Risk-off" },
      AUD: { score: -35, reason: "Commodity crush" },
      CHF: { score: +40, reason: "Švýcarsko geopoliticky neutrální" },
      CAD: { score: +20, reason: "Oil exporter profituje" },
      NZD: { score: -30, reason: "Risk-off oslabení" },
    },
  },
  {
    id: 4, title: "US Jobless Claims pod 200K", source: "Reuters",
    riskScore: +18, time: "08:30", weight: "LOW",
    summary: "Claims 198K vs 215K forecast — trh práce odolný.",
    currencyImpact: {
      USD: { score: +30, reason: "Silný labor market = Fed drží sazby déle" },
      EUR: { score: -10, reason: "EUR/USD pod tlakem z USD síly" },
      JPY: { score: -20, reason: "Risk-on, carry trade obnoven" },
      GBP: { score: +5, reason: "Neutrální až mírně pozitivní" },
      AUD: { score: +15, reason: "Risk-on benefit" },
      CHF: { score: -10, reason: "Safe haven prodáván" },
      CAD: { score: +10, reason: "Commodity benefit" },
      NZD: { score: +12, reason: "Mírný risk-on uplift" },
    },
  },
];

const upcomingEvents = [
  { name: "NFP", date: "Pá 08:30 EST", impact: "HIGH", note: "Non-Farm Payrolls — extrémní vol. Sniž size 30min před." },
  { name: "FOMC Minutes", date: "St 14:00 EST", impact: "HIGH", note: "Hawks vs doves — sleduj revize path sazeb." },
  { name: "CPI (Core)", date: "Čt 08:30 EST", impact: "HIGH", note: "Inflační print — největší market mover pro USD." },
  { name: "ECB Rate Decision", date: "Čt 13:45 EST", impact: "MED", note: "EUR vol okno 13:30–15:00." },
  { name: "BoJ Outlook Report", date: "Po 00:30 EST", impact: "MED", note: "JPY páry — gap risk v asijské session." },
];


const centralBanks = [
  { bank: "Fed", currency: "USD", rate: "4.50%", nextMeeting: "19. Mar", bias: "neutral", lastChange: "-25bp Dec'25" },
  { bank: "ECB", currency: "EUR", rate: "2.50%", nextMeeting: "6. Mar", bias: "neutral", lastChange: "-25bp Dec'25" },
  { bank: "BoJ", currency: "JPY", rate: "0.50%", nextMeeting: "19. Mar", bias: "hawkish", lastChange: "+25bp Jan'26" },
  { bank: "BoE", currency: "GBP", rate: "4.50%", nextMeeting: "20. Mar", bias: "dovish", lastChange: "-25bp Feb'26" },
  { bank: "RBA", currency: "AUD", rate: "4.10%", nextMeeting: "1. Apr", bias: "dovish", lastChange: "-25bp Feb'26" },
  { bank: "SNB", currency: "CHF", rate: "0.25%", nextMeeting: "19. Mar", bias: "dovish", lastChange: "-25bp Dec'25" },
  { bank: "BoC", currency: "CAD", rate: "3.00%", nextMeeting: "12. Mar", bias: "dovish", lastChange: "-25bp Jan'26" },
  { bank: "RBNZ", currency: "NZD", rate: "3.75%", nextMeeting: "9. Apr", bias: "dovish", lastChange: "-50bp Feb'26" },
];

const correlationData = {
  pairs: ["EURUSD", "GBPUSD", "AUDUSD", "USDJPY", "USDCHF", "USDCAD"],
  matrix: [
    [1.00, 0.87, 0.72, -0.65, -0.81, -0.58],
    [0.87, 1.00, 0.68, -0.71, -0.76, -0.52],
    [0.72, 0.68, 1.00, -0.59, -0.63, -0.44],
    [-0.65, -0.71, -0.59, 1.00, 0.70, 0.61],
    [-0.81, -0.76, -0.63, 0.70, 1.00, 0.55],
    [-0.58, -0.52, -0.44, 0.61, 0.55, 1.00],
  ],
};

const seasonalData = [
  { month: "Jan", USD: +2, EUR: -1, JPY: +3, AUD: -2 },
  { month: "Feb", USD: +1, EUR: +1, JPY: +2, AUD: -1 },
  { month: "Mar", USD: -1, EUR: +2, JPY: +4, AUD: -3 },
  { month: "Apr", USD: -2, EUR: +3, JPY: +2, AUD: +1 },
  { month: "May", USD: +1, EUR: -1, JPY: -1, AUD: +2 },
  { month: "Jun", USD: +3, EUR: -2, JPY: -2, AUD: +3 },
];

const historyData = [
  { date: "24.2", score: -22, label: "RISK OFF", events: "PCE data miss" },
  { date: "23.2", score: +15, label: "NEUTRAL", events: "FOMC neutral" },
  { date: "22.2", score: +42, label: "RISK ON", events: "China PMI beat" },
  { date: "21.2", score: -38, label: "RISK OFF", events: "Geopolitical" },
  { date: "20.2", score: -18, label: "NEUTRAL", events: "Mixed data" },
  { date: "19.2", score: +55, label: "RISK ON", events: "NFP beat" },
  { date: "18.2", score: +30, label: "RISK ON", events: "Risk appetite" },
];

const watchlistPairs = ["EURUSD", "GBPJPY", "AUDUSD", "USDJPY", "XAUUSD"];

const volWindows = [
  { session: "Tokyo", time: "00:00–09:00", vol: 35, pairs: "JPY, AUD, NZD" },
  { session: "London", time: "03:00–12:00", vol: 78, pairs: "EUR, GBP, CHF" },
  { session: "NY Open", time: "08:00–12:00", vol: 95, pairs: "USD, CAD" },
  { session: "Overlap", time: "08:00–11:00", vol: 100, pairs: "Všechny páry" },
  { session: "NY Close", time: "14:00–17:00", vol: 45, pairs: "USD páry" },
  { session: "Weekend", time: "Pá 17:00–Ne 17:00", vol: 10, pairs: "⚠ GAP riziko" },
];

function computeCurrencyTotals(list) {
  const totals = {};
  CURRENCIES.forEach((c) => { totals[c] = 0; });

  (list || []).forEach((s) => {
    CURRENCIES.forEach((c) => {
      if (s.currencyImpact && s.currencyImpact[c]) {
        totals[c] += (s.currencyImpact[c].score || 0);
      }
    });
  });

  const max = Math.max(1, ...Object.values(totals).map((v) => Math.abs(v)));
  CURRENCIES.forEach((c) => { totals[c] = Math.round((totals[c] / max) * 100); });

  return totals;
}

function ScoreBar({ score, height = 6 }) {
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
  const clamp = Math.max(-100, Math.min(100, score));
  const angle = (clamp / 100) * 90;
  const color = clamp > NEUTRAL_THRESHOLD ? C.green : clamp < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
  const label = clamp > NEUTRAL_THRESHOLD ? "RISK ON" : clamp < -NEUTRAL_THRESHOLD ? "RISK OFF" : "NEUTRAL";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width="190" height="118" viewBox="0 0 190 118">
        <defs>
          <linearGradient id="riskOffGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.red} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.yellow} stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="riskOnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.yellow} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M 12 100 A 82 82 0 0 1 178 100" fill="none" stroke={C.border} strokeWidth="9" strokeLinecap="round" />
        <path d="M 12 100 A 82 82 0 0 1 95 18" fill="none" stroke="url(#riskOffGrad)" strokeWidth="9" strokeLinecap="round" />
        <path d="M 95 18 A 82 82 0 0 1 178 100" fill="none" stroke="url(#riskOnGrad)" strokeWidth="9" strokeLinecap="round" />
        <g transform={`rotate(${angle}, 95, 100)`}>
          <line x1="95" y1="100" x2="95" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="95" cy="100" r="5" fill={color} />
        </g>
        <text x="38" y="98" fill={C.red} fontSize="8" fontFamily="monospace" textAnchor="middle">-100</text>
        <text x="38" y="108" fill={C.red} fontSize="7" fontFamily="monospace" textAnchor="middle">risk off</text>
        <text x="95" y="12" fill={C.yellow} fontSize="8" fontFamily="monospace" textAnchor="middle">0</text>
        <text x="152" y="98" fill={C.green} fontSize="8" fontFamily="monospace" textAnchor="middle">+100</text>
        <text x="152" y="108" fill={C.green} fontSize="7" fontFamily="monospace" textAnchor="middle">risk on</text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "monospace", filter: `drop-shadow(0 0 8px ${color})` }}>
          {clamp > 0 ? "+" : ""}{clamp}
        </div>
        <div style={{ fontSize: 10, letterSpacing: 4, color }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
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
  return <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10, textAlign: center ? "center" : "left" }}>{children}</div>;
}

export default function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("checking...");

  useEffect(() => {
    fetch("https://market-pulse-fdgb.onrender.com/api/health")
      .then((r) => r.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("OFFLINE"));
  }, []);
const API = "https://market-pulse-fdgb.onrender.com";

const [scenarios, setScenarios] = useState([]);
const [events, setEvents] = useState([]);
const [sentiment, setSentiment] = useState({ total_score: 0, label: "NEUTRAL" });
const [cotData, setCotData] = useState([]);
useEffect(() => {
  fetch(`${API}/api/cot`)
    .then(r => r.json())
    .then(data => {
      const mapped = data.map(c => ({
        currency: c.currency,
        net: c.net,
        change: 0,
        sentiment: c.net > 0 ? "bullish" : "bearish"
      }));
      setCotData(mapped);
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
      // když backend spadne, necháme prázdné
      setScenarios([]);
      setEvents([]);
      setSentiment({ total_score: 0, label: "NEUTRAL" });
    });
}, []);
  const [centerTab, setCenterTab] = useState("scenarios");
  const [rightTab, setRightTab] = useState("status");
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [totalScore] = useState(-18);
  const [scanning, setScanning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("14:38:22");
  const currencyTotals = computeCurrencyTotals(scenarios.length > 0 ? scenarios : mockScenarios);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdate(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
      setScanning(false);
    }, 1800);
  };

  const riskColor = totalScore > NEUTRAL_THRESHOLD ? C.green : totalScore < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
  const riskLabel = totalScore > NEUTRAL_THRESHOLD ? "RISK ON" : totalScore < -NEUTRAL_THRESHOLD ? "RISK OFF" : "NEUTRAL";

  const corrColor = (val) => {
    if (val >= 0.7) return C.green;
    if (val <= -0.7) return C.red;
    if (Math.abs(val) <= 0.3) return C.muted;
    return C.yellow;
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "monospace", padding: 14, boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
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
        </div>
      </div>

      {/* 2-col layout: LEFT gauge | RIGHT stacked panels */}
      <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 12 }}>

        {/* ── LEFT — Gauge ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Gauge panel */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <SectionLabel center>RISK SENTIMENT</SectionLabel>
            <RiskMeter score={totalScore} />

            {/* Měnový přehled pod gaugeom */}
            <div style={{ marginTop: 12, padding: "10px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <SectionLabel>MĚNOVÝ PŘEHLED</SectionLabel>
              {(() => {
                const isRiskOn = totalScore > NEUTRAL_THRESHOLD;
                const isRiskOff = totalScore < -NEUTRAL_THRESHOLD;
                const groups = isRiskOff ? [
                  { label: "🟢 Bullish", currencies: ["JPY", "CHF", "USD"], color: C.green },
                  { label: "🟡 Neutral", currencies: ["EUR", "GBP"], color: C.yellow },
                  { label: "🔴 Bearish", currencies: ["AUD", "NZD", "CAD"], color: C.red },
                ] : isRiskOn ? [
                  { label: "🟢 Bullish", currencies: ["AUD", "NZD", "CAD"], color: C.green },
                  { label: "🟡 Neutral", currencies: ["EUR", "GBP", "USD"], color: C.yellow },
                  { label: "🔴 Bearish", currencies: ["JPY", "CHF"], color: C.red },
                ] : [
                  { label: "🟢 Bullish", currencies: [], color: C.green },
                  { label: "🟡 Neutral", currencies: ["USD", "EUR", "GBP", "JPY", "AUD", "CHF", "CAD", "NZD"], color: C.yellow },
                  { label: "🔴 Bearish", currencies: [], color: C.red },
                ];
                return groups.map(group => (
                  <div key={group.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, color: group.color, width: 66 }}>{group.label}</span>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {group.currencies.length > 0 ? group.currencies.map(c => (
                        <span key={c} style={{
                          fontSize: 9, color: group.color,
                          border: `1px solid ${group.color}55`,
                          background: `${group.color}12`,
                          padding: "1px 5px", borderRadius: 3,
                        }}>{c}</span>
                      )) : <span style={{ fontSize: 9, color: C.muted }}>—</span>}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Sub-kategorie */}
            <div style={{ marginTop: 12 }}>
              {[
                { label: "News Sentiment", val: -18 },
                { label: "Macro Conditions", val: +22 },
                { label: "Geopolitical", val: -35 },
                { label: "Central Banks", val: +10 },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: C.textDim }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: item.val > 0 ? C.green : item.val < 0 ? C.red : C.yellow }}>
                      {item.val > 0 ? "+" : ""}{item.val}
                    </span>
                  </div>
                  <ScoreBar score={item.val} />
                </div>
              ))}
            </div>
          </div>

          {/* Gap Risk */}
          <div style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}44`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: C.orange, marginBottom: 6 }}>⚠ GAP RISK</div>
            <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.6 }}>
              Sentiment: <span style={{ color: C.red }}>-18 (RISK OFF)</span><br />
              Víkend close: Pá 17:00 EST<br />
              <span style={{ color: C.orange }}>Střední riziko gap v pondělí.</span>
            </div>
          </div>

          {/* Commodities */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px" }}>
            <SectionLabel>KOMODITY</SectionLabel>
            {[
              { name: "Ropa (WTI)", price: "$78.42", change: +1.2, signal: "risk on", currencies: "CAD ↑", color: C.green },
              { name: "Zlato (XAU)", price: "$2,024", change: +0.8, signal: "risk off", currencies: "AUD ↑ / safe haven", color: C.red },
              { name: "Měď", price: "$3.84", change: -0.4, signal: "neutral", currencies: "AUD, NZD", color: C.yellow },
            ].map(c => {
              const chCol = c.change > 0 ? C.green : c.change < 0 ? C.red : C.yellow;
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
                    <span style={{ fontSize: 8, color: c.color, border: `1px solid ${c.color}44`, padding: "1px 5px", borderRadius: 3 }}>{c.signal}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>Mock data — v produkci live feed</div>
          </div>

        </div>

        {/* ── RIGHT — CENTER + BOTTOM stacked ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* CENTER — main tabs */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
              <TabBtn label="⚡ Scenarios" active={centerTab === "scenarios"} onClick={() => setCenterTab("scenarios")} />
              <TabBtn label="📅 Events" active={centerTab === "calendar"} onClick={() => setCenterTab("calendar")} />
              <TabBtn label="📊 COT" active={centerTab === "cot"} onClick={() => setCenterTab("cot")} />
              <TabBtn label="🔗 Korelace" active={centerTab === "corr"} onClick={() => setCenterTab("corr")} />
              <TabBtn label="📈 Sezóna" active={centerTab === "seasonal"} onClick={() => setCenterTab("seasonal")} />
              <TabBtn label="🕐 Historie" active={centerTab === "history"} onClick={() => setCenterTab("history")} />
            </div>

            {/* SCENARIOS */}
            {centerTab === "scenarios" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 2 }}>Klikni na scénář pro detail dopadu ▼</div>
                {scenarios.map(s => {
                  const isExp = expandedScenario === s.id;
                  const sc = (s.riskScore || s.risk_score || 0) > 0 ? C.green : C.red;
                  const rScore = s.riskScore || s.risk_score || 0;
                  return (
                    <div key={s.id} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${sc}`, borderRadius: 6, background: `${sc}06`, overflow: "hidden" }}>
                      <div onClick={() => setExpandedScenario(isExp ? null : s.id)} style={{ padding: "10px 12px", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.text, flex: 1, paddingRight: 8 }}>{s.title}</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 8, color: C.textDim, background: C.border, padding: "2px 5px", borderRadius: 3 }}>{s.weight}</span>
                            <span style={{ fontSize: 13, fontWeight: 900, color: sc }}>{s.riskScore > 0 ? "+" : ""}{s.riskScore}</span>
                            <span style={{ fontSize: 9, color: C.textDim }}>{isExp ? "▲" : "▼"}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: C.textDim, marginBottom: 5 }}>{s.summary}</div>
                        <ScoreBar score={s.riskScore} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontSize: 8, color: C.muted }}>{s.source}</span>
                          <span style={{ fontSize: 8, color: C.muted }}>{s.time}</span>
                        </div>
                      </div>
                      {isExp && (
                        <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 12px", background: `${C.bg}cc` }}>
                          <SectionLabel>DOPAD NA MĚNY</SectionLabel>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                            {CURRENCIES.map(curr => {
                              const impact = typeof s.currency_impact === 'string' ? JSON.parse(s.currency_impact) : (s.currency_impact || s.currencyImpact || {});
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
            )}

            {/* CALENDAR */}
            {centerTab === "calendar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {events.map((ev, i) => {
                  const col = ev.impact === "HIGH" ? C.red : ev.impact === "MED" ? C.orange : C.muted;
                  return (
                    <div key={i} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${col}`, borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: `0 0 4px ${col}`, display: "inline-block" }} />
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{ev.name}</span>
                          <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3 }}>{ev.impact}</span>
                        </div>
                        <span style={{ fontSize: 10, color: C.accent }}>{ev.date || ev.event_time}</span>
                      </div>
                      <div style={{ fontSize: 9, color: C.textDim }}>{ev.note}</div>
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

            {/* COT */}
            {centerTab === "cot" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>CFTC Commitments of Traders — pozice velkých hráčů (update každý pátek)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {cotData.map(c => {
                    const col = c.sentiment === "bullish" ? C.green : C.red;
                    const chCol = c.change > 0 ? C.green : C.red;
                    return (
                      <div key={c.currency} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: `${col}08`, border: `1px solid ${col}22`, borderRadius: 6 }}>
                        <span style={{ width: 30, fontSize: 11, fontWeight: 700, color: col }}>{c.currency}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 9, color: C.textDim }}>Net positions</span>
                            <span style={{ fontSize: 9, color: col }}>{c.net > 0 ? "+" : ""}{c.net.toLocaleString()}</span>
                          </div>
                          <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 3 }}>
                            <div style={{ width: `${Math.min(100, Math.abs(c.net) / 800)}%`, height: "100%", background: col, borderRadius: 3 }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 9, color: chCol, width: 65, textAlign: "right" }}>
                          {c.change > 0 ? "▲+" : "▼"}{Math.abs(c.change).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CORRELATION */}
            {centerTab === "corr" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>Korelační matice měnových párů (30D rolling)</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
                    <thead>
                      <tr>
                        <td style={{ padding: "4px 6px", color: C.muted }}></td>
                        {correlationData.pairs.map(p => (
                          <td key={p} style={{ padding: "4px 6px", color: C.textDim, textAlign: "center", fontSize: 8 }}>{p.replace("USD","")}</td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {correlationData.pairs.map((pair, i) => (
                        <tr key={pair}>
                          <td style={{ padding: "4px 6px", color: C.textDim, fontSize: 8 }}>{pair.replace("USD","")}</td>
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
                  <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 8, color: C.green }}>■ Silná pozitivní (&gt;0.7)</span>
                    <span style={{ fontSize: 8, color: C.red }}>■ Silná negativní (&lt;-0.7)</span>
                    <span style={{ fontSize: 8, color: C.yellow }}>■ Střední</span>
                  </div>
                </div>
              </div>
            )}

            {/* SEASONAL */}
            {centerTab === "seasonal" && (
              <div>
                <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>Historické sezónní vzory (průměr posledních 10 let)</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  {["USD","EUR","JPY","AUD"].map((c, i) => (
                    <span key={c} style={{ fontSize: 9, color: C.textDim, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 10, height: 3, background: [C.accent, C.green, C.yellow, C.orange][i], display: "inline-block", borderRadius: 2 }} />
                      {c}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 100 }}>
                  {seasonalData.map((m) => (
                    <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      {[{ val: m.USD, col: C.accent }, { val: m.EUR, col: C.green }, { val: m.JPY, col: C.yellow }, { val: m.AUD, col: C.orange }].map((item, i) => (
                        <div key={i} style={{ width: "100%", height: Math.abs(item.val) * 6, background: item.col, opacity: 0.7, borderRadius: 2, marginBottom: 1 }} />
                      ))}
                      <div style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>{m.month}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 9, color: C.textDim }}>
                  Aktuální: <span style={{ color: C.accent }}>Únor</span> — historicky silný JPY, slabý AUD
                </div>
              </div>
            )}

            {/* HISTORY */}
            {centerTab === "history" && (
              <div>
                <SectionLabel>POSLEDNÍCH 7 DNÍ</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {historyData.map((h, i) => {
                    const col = h.score > 15 ? C.green : h.score < -15 ? C.red : C.yellow;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: `${col}08`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                        <span style={{ fontSize: 10, color: C.textDim, width: 36 }}>{h.date}</span>
                        <span style={{ fontSize: 11, fontWeight: 900, color: col, width: 36 }}>{h.score > 0 ? "+" : ""}{h.score}</span>
                        <span style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3, width: 58, textAlign: "center" }}>{h.label}</span>
                        <span style={{ fontSize: 9, color: C.textDim, flex: 1 }}>{h.events}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14 }}>
                  <SectionLabel>VÝVOJ SENTIMENTU</SectionLabel>
                  <svg width="100%" height="60" viewBox="0 0 400 60">
                    <polyline
                      points={historyData.map((h, i) => `${i * 60 + 20},${30 - h.score * 0.25}`).join(" ")}
                      fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <line x1="0" y1="30" x2="400" y2="30" stroke={C.muted} strokeWidth="1" strokeDasharray="4,4" />
                    {historyData.map((h, i) => (
                      <circle key={i} cx={i * 60 + 20} cy={30 - h.score * 0.25} r="3"
                        fill={h.score > 15 ? C.green : h.score < -15 ? C.red : C.yellow} />
                    ))}
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM — right tabs panel */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
              <TabBtn label="Status" active={rightTab === "status"} onClick={() => setRightTab("status")} />
              <TabBtn label="Měny" active={rightTab === "currencies"} onClick={() => setRightTab("currencies")} />
              <TabBtn label="Páry" active={rightTab === "pairs"} onClick={() => setRightTab("pairs")} />
              <TabBtn label="CB Sazby" active={rightTab === "cb"} onClick={() => setRightTab("cb")} />
              <TabBtn label="Watchlist" active={rightTab === "watchlist"} onClick={() => setRightTab("watchlist")} />
            </div>

            <div style={{ padding: 14 }}>

              {/* PAIRS */}
              {rightTab === "pairs" && (
                <div>
                  <SectionLabel>SKÓRE PÁRŮ — AI FUNDAMENTAL BIAS</SectionLabel>
                  <div style={{ fontSize: 9, color: C.textDim, marginBottom: 12 }}>
                    Počítáno jako rozdíl skóre dvou měn z AI scénářů. Kladné = první měna silnější.
                  </div>
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
                      const score = Math.round((currencyTotals[base] + currencyTotals[quote]) / 2);
                      const col = score > NEUTRAL_THRESHOLD ? C.green : score < -NEUTRAL_THRESHOLD ? C.red : C.yellow;
                      const direction = score > NEUTRAL_THRESHOLD ? "▲ LONG" : score < -NEUTRAL_THRESHOLD ? "▼ SHORT" : "→ NEUTRAL";
                      return (
                        <div key={pair} style={{
                          padding: "8px 10px",
                          background: `${col}0a`,
                          border: `1px solid ${col}33`,
                          borderLeft: `3px solid ${col}`,
                          borderRadius: 6,
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{pair}</span>
                            <span style={{ fontSize: 12, fontWeight: 900, color: col }}>{score > 0 ? "+" : ""}{score}</span>
                          </div>
                          <div style={{ marginBottom: 5 }}>
                            <ScoreBar score={score} height={4} />
                          </div>
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

              {/* STATUS */}
              {rightTab === "status" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: `${riskColor}12`, border: `1px solid ${riskColor}44`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 8 }}>CURRENT STATE</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: riskColor, letterSpacing: 3 }}>{riskLabel}</div>
                    <div style={{ fontSize: 9, color: C.textDim, marginTop: 8, lineHeight: 1.6 }}>
                      {totalScore > NEUTRAL_THRESHOLD ? "Trh preferuje risk assets. AUD, NZD supported."
                        : totalScore < -NEUTRAL_THRESHOLD ? "Risk aversion. JPY, CHF, Gold outperformují."
                        : "Smíšené signály. Čekej na potvrzení."}
                    </div>
                  </div>
                  <div style={{ background: `${C.red}08`, border: `1px solid ${C.red}33`, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: C.red }}>⚠ RISK EVENTS</div>
                      <div style={{ fontSize: 8, color: C.textDim, background: C.border, padding: "2px 6px", borderRadius: 3 }}>příštích 48h</div>
                    </div>
                    {[
                      { name: "CPI (Core)", time: "Dnes 08:30 EST", impact: "HIGH", hoursLeft: 3 },
                      { name: "FOMC Minutes", time: "Zítra 14:00 EST", impact: "HIGH", hoursLeft: 28 },
                    ].map((ev, i) => {
                      const col = ev.impact === "HIGH" ? C.red : C.orange;
                      return (
                        <div key={i} style={{ background: `${col}12`, border: `1px solid ${col}33`, borderRadius: 6, padding: "8px 10px", marginBottom: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: col }}>{ev.name}</div>
                            <div style={{ fontSize: 8, color: col, border: `1px solid ${col}44`, padding: "1px 5px", borderRadius: 3 }}>za {ev.hoursLeft}h</div>
                          </div>
                          <div style={{ fontSize: 9, color: C.textDim, marginTop: 3 }}>{ev.time}</div>
                        </div>
                      );
                    })}
                    <div style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>NFP v pátek je mimo 48h okno</div>
                  </div>
                </div>
              )}

              {/* CURRENCIES */}
              {rightTab === "currencies" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <SectionLabel>CELKOVÝ MĚNOVÝ BIAS</SectionLabel>
                    <div style={{ fontSize: 9, color: C.muted, marginBottom: 10 }}>Součet všech AI scénářů</div>
                    {CURRENCIES.sort((a, b) => currencyTotals[b] - currencyTotals[a]).map(curr => (
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
                    <SectionLabel>PŘEHLED BIAS</SectionLabel>
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

              {/* CENTRAL BANKS */}
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
                          <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>Poslední: {cb.lastChange}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WATCHLIST */}
              {rightTab === "watchlist" && (
                <div>
                  <SectionLabel>WATCHLIST</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {watchlistPairs.map((pair, i) => {
                      const mockChange = [-0.32, +0.45, +0.18, -0.67, +1.24][i];
                      const col = mockChange > 0 ? C.green : C.red;
                      return (
                        <div key={pair} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: `${col}08`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{pair}</span>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 10, color: col }}>{mockChange > 0 ? "▲" : "▼"} {Math.abs(mockChange)}%</div>
                            <div style={{ fontSize: 8, color: C.textDim }}>
                              {pair === "EURUSD" ? "1.0842" : pair === "GBPJPY" ? "192.34" : pair === "AUDUSD" ? "0.6521" : pair === "USDJPY" ? "149.82" : "2,024.5"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 9, color: C.muted }}>+ Přidat pár (v produkci)</div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <div style={{ fontSize: 8, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 12, display: "flex", justifyContent: "space-between" }}>
        <span>⚡ AI scanning: Reuters · Bloomberg · FT · ForexFactory · CFTC</span>
        <span>NOT FINANCIAL ADVICE — INFORMATIONAL ONLY</span>
      </div>
    </div>
  );
}