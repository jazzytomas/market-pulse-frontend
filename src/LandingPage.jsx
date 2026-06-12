import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GOLD = "#c9a227";
const BG = "#0a0c12";
const PANEL = "#10141d";
const BORDER = "#232b3d";
const TEXT = "#e8ecf4";
const DIM = "#93a0b8";
const GREEN = "#2ebd85";

const font = "'Space Grotesk', sans-serif";
const fontTitle = "'Space Grotesk', sans-serif";

const LANGS = ["cz", "en", "es"];
const LANG_FLAGS = { cz: "cz", en: "us", es: "es" };
const LANG_LABELS = { cz: "CZ", en: "EN", es: "ES" };

const T = {
  nav: {
    features: { cz: "Funkce", en: "Features", es: "Funciones" },
    pricing: { cz: "Ceník", en: "Pricing", es: "Precios" },
    faq: { cz: "FAQ", en: "FAQ", es: "FAQ" },
    login: { cz: "PŘIHLÁSIT", en: "LOG IN", es: "INGRESAR" },
  },
  hero: {
    badge: { cz: "AI FOREX INTELIGENCE", en: "AI-POWERED FOREX INTELLIGENCE", es: "INTELIGENCIA FOREX CON IA" },
    title1: { cz: "Fundamentální sentiment", en: "Fundamental sentiment", es: "Sentimiento fundamental" },
    title2: { cz: "na první pohled", en: "at a glance", es: "de un vistazo" },
    desc: {
      cz: "AI analýza forex zpráv, ekonomických událostí, COT dat a komoditních toků v reálném čase — vše co potřebujete pro pochopení tržních fundamentů v jednom dashboardu.",
      en: "Real-time AI analysis of forex news, economic events, COT data, and commodity flows — everything you need to understand market fundamentals in one dashboard.",
      es: "Análisis en tiempo real con IA de noticias forex, eventos económicos, datos COT y flujos de materias primas — todo lo que necesitas para entender los fundamentales del mercado en un solo panel.",
    },
    cta: { cz: "VYZKOUŠET 3 DNY ZDARMA", en: "START 3-DAY FREE TRIAL", es: "PRUEBA GRATIS 3 DÍAS" },
    sub: { cz: "3 dny bez poplatku. Zrušit kdykoliv.", en: "No charge for 3 days. Cancel anytime.", es: "Sin cargo por 3 días. Cancela cuando quieras." },
  },
  sections: {
    features: { cz: "FUNKCE", en: "FEATURES", es: "FUNCIONES" },
    pricing: { cz: "CENÍK", en: "PRICING", es: "PRECIOS" },
    pricingSub: { cz: "Každý plán začíná 3denním bezplatným zkušebním obdobím", en: "Every plan starts with a 3-day free trial", es: "Cada plan incluye 3 días de prueba gratis" },
    faq: { cz: "ČASTÉ DOTAZY", en: "FAQ", es: "PREGUNTAS FRECUENTES" },
  },
  plans: [
    {
      key: "monthly",
      name: { cz: "MĚSÍČNÍ", en: "MONTHLY", es: "MENSUAL" },
      price: "$14.9",
      period: { cz: "/měs", en: "/mo", es: "/mes" },
      desc: { cz: "Plný přístup, zrušit kdykoliv", en: "Full access, cancel anytime", es: "Acceso completo, cancela cuando quieras" },
      features: {
        cz: ["Všechny AI signály a scénáře", "Živý ekonomický kalendář", "COT data a korelace", "Komodity a watchlist", "Email podpora"],
        en: ["All AI signals & scenarios", "Live economic calendar", "COT data & correlations", "Commodity & watchlist tracking", "Email support"],
        es: ["Todas las señales y escenarios IA", "Calendario económico en vivo", "Datos COT y correlaciones", "Seguimiento de materias primas y watchlist", "Soporte por email"],
      },
      cta: { cz: "Vyzkoušet zdarma", en: "Start Free Trial", es: "Empezar prueba gratis" },
      popular: false,
    },
    {
      key: "yearly",
      name: { cz: "ROČNÍ", en: "YEARLY", es: "ANUAL" },
      price: "$119",
      period: { cz: "/rok", en: "/yr", es: "/año" },
      desc: { cz: "Ušetřete 33 % oproti měsíčnímu", en: "Save 33% vs monthly", es: "Ahorra 33% vs mensual" },
      features: {
        cz: ["Vše z měsíčního plánu", "Prioritní podpora", "Přednostní přístup k novinkám", "Ušetříte $60 ročně"],
        en: ["Everything in Monthly", "Priority support", "Early access to new features", "Save $60 per year"],
        es: ["Todo lo del plan mensual", "Soporte prioritario", "Acceso anticipado a nuevas funciones", "Ahorra $60 al año"],
      },
      cta: { cz: "Vyzkoušet zdarma", en: "Start Free Trial", es: "Empezar prueba gratis" },
      popular: true,
    },
    {
      key: "lifetime",
      name: { cz: "DOŽIVOTNÍ", en: "LIFETIME", es: "DE POR VIDA" },
      price: "$350",
      period: { cz: " jednorázově", en: " once", es: " único pago" },
      desc: { cz: "Zaplaťte jednou, používejte navždy", en: "Pay once, use forever", es: "Paga una vez, usa para siempre" },
      features: {
        cz: ["Vše z ročního plánu", "Doživotní aktualizace", "Odznak zakládajícího člena", "Přímý přístup k zakladateli"],
        en: ["Everything in Yearly", "Lifetime updates", "Founding member badge", "Direct founder access"],
        es: ["Todo lo del plan anual", "Actualizaciones de por vida", "Insignia de miembro fundador", "Acceso directo al fundador"],
      },
      cta: { cz: "Získat doživotní přístup", en: "Get Lifetime Access", es: "Obtener acceso de por vida" },
      popular: false,
    },
  ],
  popular: { cz: "NEJOBLÍBENĚJŠÍ", en: "MOST POPULAR", es: "MÁS POPULAR" },
  heroStats: [
    { cz: "8 měn sledováno 24/5", en: "8 currencies tracked 24/5", es: "8 divisas monitoreadas 24/5" },
    { cz: "AI skóre zpráv v reálném čase", en: "Real-time AI news scoring", es: "Scoring IA de noticias en tiempo real" },
    { cz: "COT · korelace · sezónnost", en: "COT · correlations · seasonality", es: "COT · correlaciones · estacionalidad" },
    { cz: "Telegram alerty", en: "Telegram alerts", es: "Alertas por Telegram" },
  ],
  liveLabel: { cz: "ŽIVÝ DASHBOARD", en: "LIVE DASHBOARD", es: "DASHBOARD EN VIVO" },
  ctaEnd: {
    title: { cz: "Připraven vidět trh jasněji?", en: "Ready to see the market clearly?", es: "¿Listo para ver el mercado con claridad?" },
    desc: { cz: "Vyzkoušej MarkeTrade na 3 dny zdarma. Zrušit můžeš kdykoliv.", en: "Try MarkeTrade free for 3 days. Cancel anytime.", es: "Prueba MarkeTrade gratis por 3 días. Cancela cuando quieras." },
  },
  features: [
    { icon: "🤖", title: { cz: "AI Sentiment Scoring", en: "AI Sentiment Scoring", es: "Scoring de sentimiento IA" }, desc: { cz: "Claude AI analyzuje každý titulek a v reálném čase hodnotí jeho dopad na 8 hlavních měn.", en: "Claude AI analyzes every headline and scores its impact on 8 major currencies in real-time.", es: "Claude AI analiza cada titular y evalúa su impacto en 8 divisas principales en tiempo real." } },
    { icon: "📅", title: { cz: "Ekonomický kalendář", en: "Economic Calendar", es: "Calendario económico" }, desc: { cz: "Události z ForexFactory s daty actual vs forecast, hodnocením volatility a okny dopadu.", en: "ForexFactory events with actual vs forecast data, volatility ratings, and impact windows.", es: "Eventos de ForexFactory con datos real vs pronóstico, ratings de volatilidad y ventanas de impacto." } },
    { icon: "📊", title: { cz: "COT Pozice", en: "COT Positioning", es: "Posicionamiento COT" }, desc: { cz: "Týdenní CFTC data ukazující institucionální pozice napříč 7 měnami.", en: "Weekly CFTC Commitment of Traders data showing institutional positioning across 7 currencies.", es: "Datos semanales CFTC mostrando el posicionamiento institucional en 7 divisas." } },
    { icon: "🔗", title: { cz: "Živé korelace", en: "Live Correlations", es: "Correlaciones en vivo" }, desc: { cz: "30denní klouzavé Pearsonovy korelace mezi hlavními forex páry, aktualizováno každou hodinu.", en: "30-day rolling Pearson correlations between major forex pairs, updated hourly.", es: "Correlaciones Pearson de 30 días entre pares forex principales, actualizadas cada hora." } },
    { icon: "📈", title: { cz: "Sezónní vzorce", en: "Seasonal Patterns", es: "Patrones estacionales" }, desc: { cz: "10leté průměrné měsíční výnosy pro 8 měn k identifikaci sezónních trendů.", en: "10-year average monthly returns for 8 currencies to identify seasonal trends.", es: "Rendimientos mensuales promedio de 10 años para 8 divisas para identificar tendencias estacionales." } },
    { icon: "⚡", title: { cz: "Sledování komodit", en: "Commodity Tracking", es: "Seguimiento de materias primas" }, desc: { cz: "Živé ceny zlata, stříbra, ropy, zemního plynu a dalších s indikátory rizikového signálu.", en: "Live prices for Gold, Silver, Oil, Natural Gas and more with risk signal indicators.", es: "Precios en vivo de oro, plata, petróleo, gas natural y más con indicadores de señal de riesgo." } },
    { icon: "📲", title: { cz: "Telegram alerty", en: "Telegram Alerts", es: "Alertas por Telegram" }, desc: { cz: "Ranní briefing každý den v 7:00 s přehledem HIGH impact eventů a sentimentem. Okamžité upozornění při důležitých zprávách přímo do Telegramu.", en: "Daily morning briefing at 7:00 AM with HIGH impact events and sentiment overview. Instant notifications for important news delivered straight to Telegram.", es: "Briefing matutino diario a las 7:00 con eventos de alto impacto y resumen de sentimiento. Notificaciones instantáneas de noticias importantes directamente en Telegram." } },
  ],
  faqs: [
    {
      q: { cz: "Co je MarkeTrade?", en: "What is MarkeTrade?", es: "¿Qué es MarkeTrade?" },
      a: { cz: "MarkeTrade je AI forex trading dashboard. V reálném čase skenuje zpravodajské zdroje, hodnotí je pomocí Claude AI a poskytuje jasný obraz fundamentálního sentimentu pro 8 hlavních měn. Zahrnuje také ekonomický kalendář, COT pozice, sledování komodit, korelace a sezónní analýzu.", en: "MarkeTrade is an AI-powered forex trading dashboard. It scans news sources in real-time, scores them using Claude AI, and gives you a clear fundamental sentiment picture for 8 major currencies. It also includes an economic calendar, COT positioning, commodity tracking, correlations, and seasonal analysis.", es: "MarkeTrade es un dashboard de trading forex impulsado por IA. Escanea fuentes de noticias en tiempo real, las evalúa usando Claude AI y proporciona una imagen clara del sentimiento fundamental para 8 divisas principales. También incluye calendario económico, posicionamiento COT, seguimiento de materias primas, correlaciones y análisis estacional." },
    },
    {
      q: { cz: "Jak funguje 3denní zkušební verze zdarma?", en: "How does the 3-day free trial work?", es: "¿Cómo funciona la prueba gratis de 3 días?" },
      a: { cz: "Po registraci získáte plný přístup na 3 dny zdarma. Budete muset zadat platební metodu, ale nebude vám nic účtováno dokud zkušební doba neskončí. Zrušte kdykoliv během 3 dnů a neplatíte nic.", en: "After signing up, you get full access for 3 days at no cost. You'll need to enter a payment method, but you won't be charged until the trial ends. Cancel anytime before the 3 days are up and you pay nothing.", es: "Después de registrarte, obtienes acceso completo durante 3 días sin costo. Necesitarás ingresar un método de pago, pero no se te cobrará hasta que termine la prueba. Cancela en cualquier momento antes de los 3 días y no pagas nada." },
    },
    {
      q: { cz: "Mohu předplatné kdykoliv zrušit?", en: "Can I cancel anytime?", es: "¿Puedo cancelar en cualquier momento?" },
      a: { cz: "Ano. Měsíční i roční předplatné lze zrušit kdykoliv v nastavení účtu. Přístup si ponecháte do konce fakturačního období.", en: "Yes. Monthly and yearly subscriptions can be cancelled at any time from your account settings. You keep access until the end of your billing period.", es: "Sí. Las suscripciones mensuales y anuales se pueden cancelar en cualquier momento desde la configuración de tu cuenta. Mantienes el acceso hasta el final de tu período de facturación." },
    },
    {
      q: { cz: "Jaké datové zdroje používáte?", en: "What data sources does it use?", es: "¿Qué fuentes de datos utiliza?" },
      a: { cz: "Agregujeme data z Reuters, ForexFactory, Bloomberg, FXStreet a dalších finančních zpravodajských zdrojů. Ekonomická data pochází z kalendáře ForexFactory. COT data ze týdenních reportů CFTC. Ceny komodit a forexu z živých tržních zdrojů.", en: "We aggregate data from Reuters, ForexFactory, Bloomberg, FXStreet, and other major financial news sources. Economic data comes from ForexFactory's calendar. COT data is sourced from CFTC weekly reports. Commodity and forex prices come from live market feeds.", es: "Agregamos datos de Reuters, ForexFactory, Bloomberg, FXStreet y otras fuentes de noticias financieras importantes. Los datos económicos provienen del calendario de ForexFactory. Los datos COT provienen de los informes semanales de la CFTC. Los precios de materias primas y forex provienen de feeds de mercado en vivo." },
    },
    {
      q: { cz: "Je to služba obchodních signálů?", en: "Is this a trading signal service?", es: "¿Es un servicio de señales de trading?" },
      a: { cz: "Ne. MarkeTrade poskytuje fundamentální analýzu a sentimentová data, která vám pomohou při informovaném rozhodování. Neposkytuje signály k nákupu/prodeji ani finanční poradenství. Vždy provádějte vlastní výzkum.", en: "No. MarkeTrade provides fundamental analysis and sentiment data to help you make informed trading decisions. It does not provide buy/sell signals or financial advice. Always do your own research.", es: "No. MarkeTrade proporciona análisis fundamental y datos de sentimiento para ayudarte a tomar decisiones de trading informadas. No proporciona señales de compra/venta ni asesoramiento financiero. Siempre haz tu propia investigación." },
    },
    {
      q: { cz: "Co zahrnuje doživotní plán?", en: "What's included in the Lifetime plan?", es: "¿Qué incluye el plan de por vida?" },
      a: { cz: "Doživotní plán je jednorázová platba, která vám dává trvalý přístup k MarkeTrade, včetně všech budoucích aktualizací a funkcí. Tento plán je k dispozici po omezenou dobu pro první podporovatele.", en: "The Lifetime plan is a one-time payment that gives you permanent access to MarkeTrade, including all future updates and features. This plan is available for a limited time for early supporters.", es: "El plan de por vida es un pago único que te da acceso permanente a MarkeTrade, incluyendo todas las actualizaciones y funciones futuras. Este plan está disponible por tiempo limitado para los primeros seguidores." },
    },
  ],
  footer: {
    help: { cz: "Potřebujete pomoc?", en: "Need help?", es: "¿Necesitas ayuda?" },
    rights: { cz: "Všechna práva vyhrazena. Nejedná se o finanční poradenství.", en: "All rights reserved. This is not financial advice.", es: "Todos los derechos reservados. Esto no es asesoramiento financiero." },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("mp_lang") || "en");

  const t = (obj) => obj[lang] || obj.en;
  const goAuth = (plan) => navigate("/auth", { state: { plan } });

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: font, overflowX: "hidden", maxWidth: "100vw" }}>
      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, background: `${BG}ee`, backdropFilter: "blur(8px)", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 24px", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box", flexWrap: "wrap" }}>
          <img src="/logo.svg" alt="MarkeTrade" style={{ height: 34, objectFit: "contain" }} />
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <a href="#features" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>{t(T.nav.features)}</a>
            <a href="#pricing" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>{t(T.nav.pricing)}</a>
            <a href="#faq" style={{ color: DIM, textDecoration: "none", fontSize: 14 }}>{t(T.nav.faq)}</a>
            <button onClick={() => { const i = LANGS.indexOf(lang); const next = LANGS[(i + 1) % LANGS.length]; setLang(next); localStorage.setItem("mp_lang", next); }} style={{
              background: "none", border: `1px solid ${BORDER}`,
              padding: "4px 8px", cursor: "pointer", borderRadius: 7, lineHeight: 1, display: "flex", alignItems: "center", gap: 5,
            }}>
              <img src={`https://flagcdn.com/24x18/${LANG_FLAGS[lang]}.png`} width="22" height="16" alt={LANG_LABELS[lang]} style={{ display: "block", borderRadius: 2 }} />
              <span style={{ color: DIM, fontSize: 12, fontFamily: font }}>{LANG_LABELS[lang]}</span>
            </button>
            <button onClick={() => navigate("/auth")} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: font, fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{t(T.nav.login)}</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${GOLD}14, transparent)` }}>
      <section style={{ textAlign: "center", padding: "76px 24px 0", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "inline-block", fontFamily: font, fontWeight: 600, fontSize: 12, letterSpacing: 2.5, color: GOLD, marginBottom: 18, border: `1px solid ${GOLD}44`, background: `${GOLD}12`, padding: "5px 14px", borderRadius: 20 }}>{t(T.hero.badge)}</div>
        <h1 style={{ fontFamily: font, fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 700, color: TEXT, margin: "0 0 20px", lineHeight: 1.15, letterSpacing: -1 }}>
          {t(T.hero.title1)}<br />
          <span style={{ color: GOLD }}>{t(T.hero.title2)}</span>
        </h1>
        <p style={{ color: DIM, fontSize: 17, lineHeight: 1.7, maxWidth: 620, margin: "0 auto 32px" }}>
          {t(T.hero.desc)}
        </p>
        <button onClick={() => goAuth("monthly")} style={{ background: GOLD, color: "#0a0c12", border: "none", padding: "15px 40px", borderRadius: 10, fontFamily: font, fontSize: 15, letterSpacing: 0.5, cursor: "pointer", fontWeight: 700, boxShadow: `0 8px 30px ${GOLD}33` }}>
          {t(T.hero.cta)}
        </button>
        <div style={{ color: DIM, fontSize: 13, marginTop: 12 }}>{t(T.hero.sub)}</div>
      </section>

      {/* SCREENSHOT – ukázka produktu */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 8px" }}>
        <div style={{ borderRadius: 14, border: `1px solid ${BORDER}`, background: PANEL, boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${GOLD}10`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#f6465d" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#d9a425" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#2ebd85" }} />
            <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ebd85", display: "inline-block" }} />
              <span style={{ fontSize: 11, color: DIM, letterSpacing: 2, fontWeight: 600 }}>{t(T.liveLabel)}</span>
            </span>
          </div>
          <img src="/screenshot-dashboard.png" alt="MarkeTrade dashboard" style={{ display: "block", width: "100%" }} />
        </div>
        {/* Stats band */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px 36px", flexWrap: "wrap", padding: "26px 0 6px" }}>
          {T.heroStats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: GREEN, fontSize: 14, fontWeight: 700 }}>✓</span>
              <span style={{ color: DIM, fontSize: 14 }}>{t(s)}</span>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 40 }}>{t(T.sections.features)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 20 }}>
          {T.features.map((f, i) => (
            <div key={i} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: font, fontSize: 15, fontWeight: 700, marginBottom: 8, color: TEXT }}>{t(f.title)}</div>
              <div style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>{t(f.desc)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 12 }}>{t(T.sections.pricing)}</div>
        <p style={{ textAlign: "center", color: DIM, fontSize: 15, marginBottom: 40 }}>{t(T.sections.pricingSub)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: 20, alignItems: "stretch" }}>
          {T.plans.map((p, i) => (
            <div key={i} style={{
              background: PANEL,
              border: `${p.popular ? 2 : 1}px solid ${p.popular ? GOLD : BORDER}`,
              borderRadius: 14,
              padding: 28,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              boxShadow: p.popular ? `0 12px 50px ${GOLD}1f` : "none",
            }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: GOLD, color: "#0a0c12", fontFamily: font, fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "4px 16px", borderRadius: 20 }}>{t(T.popular)}</div>
              )}
              <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: DIM, marginBottom: 12, textTransform: "uppercase" }}>{t(p.name)}</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: font, fontSize: 36, fontWeight: 700, color: TEXT }}>{p.price}</span>
                <span style={{ color: DIM, fontSize: 15 }}>{t(p.period)}</span>
              </div>
              <div style={{ color: DIM, fontSize: 13, marginBottom: 20 }}>{t(p.desc)}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
                {t(p.features).map((f, j) => (
                  <li key={j} style={{ color: TEXT, fontSize: 14, padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: GREEN, fontSize: 14 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => goAuth(p.key)} style={{
                width: "100%",
                background: p.popular ? GOLD : "transparent",
                color: p.popular ? "#0a0c12" : GOLD,
                border: p.popular ? "none" : `1px solid ${GOLD}`,
                padding: "12px 0",
                borderRadius: 8,
                fontFamily: font,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}>{t(p.cta)}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ fontFamily: fontTitle, fontSize: 11, letterSpacing: 4, color: GOLD, textAlign: "center", marginBottom: 40 }}>{t(T.sections.faq)}</div>
        {T.faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, marginBottom: 0 }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", background: "transparent", border: "none", color: TEXT, fontFamily: font, fontSize: 15, padding: "18px 0", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              {t(f.q)}
              <span style={{ color: GOLD, fontSize: 18, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </button>
            {openFaq === i && (
              <div style={{ color: DIM, fontSize: 14, lineHeight: 1.7, padding: "0 0 18px" }}>{t(f.a)}</div>
            )}
          </div>
        ))}
      </section>

      {/* ZÁVĚREČNÉ CTA */}
      <section style={{ textAlign: "center", padding: "30px 24px 80px", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "44px 32px", boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 60px ${GOLD}0d` }}>
          <h2 style={{ fontFamily: font, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, color: TEXT, margin: "0 0 12px", letterSpacing: -0.5 }}>{t(T.ctaEnd.title)}</h2>
          <p style={{ color: DIM, fontSize: 15, margin: "0 0 26px" }}>{t(T.ctaEnd.desc)}</p>
          <button onClick={() => goAuth("monthly")} style={{ background: GOLD, color: "#0a0c12", border: "none", padding: "14px 38px", borderRadius: 10, fontFamily: font, fontSize: 15, cursor: "pointer", fontWeight: 700, boxShadow: `0 8px 30px ${GOLD}33` }}>
            {t(T.hero.cta)}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 24px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img src="/logo.svg" alt="MarkeTrade" style={{ height: 28, objectFit: "contain" }} />
        </div>
        <div style={{ color: DIM, fontSize: 13, marginBottom: 8 }}>
          {t(T.footer.help)} <a href="mailto:support@marketpulse.com" style={{ color: GOLD, textDecoration: "none" }}>support@marketpulse.com</a>
        </div>
        <div style={{ color: DIM, fontSize: 12 }}>
          &copy; {new Date().getFullYear()} MarkeTrade. {t(T.footer.rights)}
        </div>
      </footer>
    </div>
  );
}
