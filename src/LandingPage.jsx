import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GOLD = "#c9a227";
const BG = "#080812";
const PANEL = "#0f0f22";
const BORDER = "#2a1d6e";
const TEXT = "#f0eaff";
const DIM = "#9080c4";
const GREEN = "#00e5a8";
const RED = "#ff3d5e";

const font = "'Space Grotesk', sans-serif";
const fontTitle = "'Orbitron', sans-serif";

const plans = [
  {
    name: "MONTHLY",
    price: "$19",
    period: "/mo",
    desc: "Full access, cancel anytime",
    features: ["All AI signals & scenarios", "Live economic calendar", "COT data & correlations", "Commodity & watchlist tracking", "Email support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "YEARLY",
    price: "$190",
    period: "/yr",
    desc: "Save 17% vs monthly",
    features: ["Everything in Monthly", "Priority support", "Early access to new features", "Save $38 per year"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "LIFETIME",
    price: "$350",
    period: " once",
    desc: "Pay once, use forever",
    features: ["Everything in Yearly", "Lifetime updates", "Founding member badge", "Direct founder access"],
    cta: "Get Lifetime Access",
    popular: false,
  },
];

const faqs = [
  {
    q: "What is Market Pulse?",
    a: "Market Pulse is an AI-powered forex trading dashboard. It scans news sources in real-time, scores them using Claude AI, and gives you a clear fundamental sentiment picture for 8 major currencies. It also includes an economic calendar, COT positioning, commodity tracking, correlations, and seasonal analysis.",
  },
  {
    q: "How does the 3-day free trial work?",
    a: "After signing up, you get full access for 3 days at no cost. You'll need to enter a payment method, but you won't be charged until the trial ends. Cancel anytime before the 3 days are up and you pay nothing.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly and yearly subscriptions can be cancelled at any time from your account settings. You keep access until the end of your billing period.",
  },
  {
    q: "What data sources does it use?",
    a: "We aggregate data from Reuters, ForexFactory, Bloomberg, FXStreet, and other major financial news sources. Economic data comes from ForexFactory's calendar. COT data is sourced from CFTC weekly reports. Commodity and forex prices come from live market feeds.",
  },
  {
    q: "Is this a trading signal service?",
    a: "No. Market Pulse provides fundamental analysis and sentiment data to help you make informed trading decisions. It does not provide buy/sell signals or financial advice. Always do your own research.",
  },
  {
    q: "What's included in the Lifetime plan?",
    a: "The Lifetime plan is a one-time payment that gives you permanent access to Market Pulse, including all future updates and features. This plan is available for a limited time for early supporters.",
  },
];

const features = [
  { icon: "🤖", title: "AI Sentiment Scoring", desc: "Claude AI analyzes every headline and scores its impact on 8 major currencies in real-time." },
  { icon: "📅", title: "Economic Calendar", desc: "ForexFactory events with actual vs forecast data, volatility ratings, and impact windows." },
  { icon: "📊", title: "COT Positioning", desc: "Weekly CFTC Commitment of Traders data showing institutional positioning across 7 currencies." },
  { icon: "🔗", title: "Live Correlations", desc: "30-day rolling Pearson correlations between major forex pairs, updated hourly." },
  { icon: "📈", title: "Seasonal Patterns", desc: "10-year average monthly returns for 8 currencies to identify seasonal trends." },
  { icon: "⚡", title: "Commodity Tracking", desc: "Live prices for Gold, Silver, Oil, Natural Gas and more with risk signal indicators." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const goAuth = (plan) => navigate("/auth", { state: { plan } });

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: font }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px", borderBottom: `1px solid ${BORDER}`, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 18, color: GOLD, letterSpacing: 2 }}>MARKET PULSE</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#features" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>Features</a>
          <a href="#pricing" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>Pricing</a>
          <a href="#faq" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>FAQ</a>
          <button onClick={() => navigate("/auth")} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontFamily: fontTitle, fontSize: 12, letterSpacing: 1 }}>LOG IN</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, marginBottom: 16 }}>AI-POWERED FOREX INTELLIGENCE</div>
        <h1 style={{ fontFamily: fontTitle, fontSize: "clamp(28px, 5vw, 48px)", color: TEXT, margin: "0 0 20px", lineHeight: 1.2 }}>
          Fundamental sentiment<br />
          <span style={{ color: GOLD }}>at a glance</span>
        </h1>
        <p style={{ color: DIM, fontSize: 17, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
          Real-time AI analysis of forex news, economic events, COT data, and commodity flows — everything you need to understand market fundamentals in one dashboard.
        </p>
        <button onClick={() => goAuth("monthly")} style={{ background: GOLD, color: "#080812", border: "none", padding: "14px 36px", borderRadius: 10, fontFamily: fontTitle, fontSize: 14, letterSpacing: 1, cursor: "pointer", fontWeight: 700 }}>
          START 3-DAY FREE TRIAL
        </button>
        <div style={{ color: DIM, fontSize: 12, marginTop: 10 }}>No charge for 3 days. Cancel anytime.</div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 40 }}>FEATURES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: fontTitle, fontSize: 13, letterSpacing: 1, marginBottom: 8, color: TEXT }}>{f.title}</div>
              <div style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 12 }}>PRICING</div>
        <p style={{ textAlign: "center", color: DIM, fontSize: 15, marginBottom: 40 }}>Every plan starts with a 3-day free trial</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              background: PANEL,
              border: `${p.popular ? 2 : 1}px solid ${p.popular ? GOLD : BORDER}`,
              borderRadius: 12,
              padding: 28,
              position: "relative",
              transform: p.popular ? "scale(1.03)" : "none",
            }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: GOLD, color: "#080812", fontFamily: fontTitle, fontSize: 10, letterSpacing: 2, padding: "4px 16px", borderRadius: 20, fontWeight: 700 }}>MOST POPULAR</div>
              )}
              <div style={{ fontFamily: fontTitle, fontSize: 12, letterSpacing: 2, color: DIM, marginBottom: 12 }}>{p.name}</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: fontTitle, fontSize: 36, color: TEXT }}>{p.price}</span>
                <span style={{ color: DIM, fontSize: 15 }}>{p.period}</span>
              </div>
              <div style={{ color: DIM, fontSize: 13, marginBottom: 20 }}>{p.desc}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ color: TEXT, fontSize: 14, padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: GREEN, fontSize: 14 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => goAuth(p.name.toLowerCase())} style={{
                width: "100%",
                background: p.popular ? GOLD : "transparent",
                color: p.popular ? "#080812" : GOLD,
                border: p.popular ? "none" : `1px solid ${GOLD}`,
                padding: "12px 0",
                borderRadius: 8,
                fontFamily: fontTitle,
                fontSize: 12,
                letterSpacing: 1,
                cursor: "pointer",
                fontWeight: 700,
              }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 40 }}>FAQ</div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, marginBottom: 0 }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", background: "transparent", border: "none", color: TEXT, fontFamily: font, fontSize: 15, padding: "18px 0", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              {f.q}
              <span style={{ color: GOLD, fontSize: 18, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </button>
            {openFaq === i && (
              <div style={{ color: DIM, fontSize: 14, lineHeight: 1.7, padding: "0 0 18px" }}>{f.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 24px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 14, color: GOLD, letterSpacing: 2, marginBottom: 12 }}>MARKET PULSE</div>
        <div style={{ color: DIM, fontSize: 13, marginBottom: 8 }}>
          Need help? <a href="mailto:support@marketpulse.com" style={{ color: GOLD, textDecoration: "none" }}>support@marketpulse.com</a>
        </div>
        <div style={{ color: DIM, fontSize: 12 }}>
          &copy; {new Date().getFullYear()} Market Pulse. All rights reserved. This is not financial advice.
        </div>
      </footer>
    </div>
  );
}
