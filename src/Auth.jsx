import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

const GOLD = "#c9a227";
const BG = "#0a0c12";
const PANEL = "#10141d";
const BORDER = "#232b3d";
const TEXT = "#e8ecf4";
const DIM = "#93a0b8";
const GREEN = "#2ebd85";
const RED = "#ff3d5e";

const font = "'Space Grotesk', sans-serif";
const fontTitle = "'Orbitron', sans-serif";

const API_URL = "https://market-pulse-fdgb.onrender.com";

async function startCheckout(plan, user) {
  try {
    const res = await fetch(`${API_URL}/api/create_checkout_session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        user_id: user.id,
        user_email: user.email,
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.detail || "Checkout failed");
    }
  } catch (e) {
    alert("Chyba při vytváření platby: " + e.message);
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "monthly";

  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    // Po loginu: zjistit subscription status, pokud není aktivní → checkout
    try {
      const token = data.session?.access_token;
      const meRes = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();
      const active = ["active", "trialing"].includes(me.subscription_status);
      if (active) {
        navigate("/dashboard");
      } else {
        await startCheckout(selectedPlan, data.user);
      }
    } catch (e) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { plan: selectedPlan } },
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    // Pokud je session rovnou vytvořena (email confirm vypnutý) → checkout
    if (data.session && data.user) {
      await startCheckout(selectedPlan, data.user);
    } else {
      setMessage("Zkontroluj email pro potvrzení účtu, pak se přihlaš.");
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setMessage("Password reset link sent to your email!");
    }
  };

  const handleSubmit = mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgot;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ cursor: "pointer", marginBottom: 40 }} onClick={() => navigate("/")}>
        <img src="/logo.svg" alt="MarkeTrade" style={{ height: 42, objectFit: "contain" }} />
      </div>

      <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ fontFamily: fontTitle, fontSize: 14, letterSpacing: 2, color: TEXT, textAlign: "center", marginBottom: 24 }}>
          {mode === "login" ? "LOG IN" : mode === "register" ? "CREATE ACCOUNT" : "RESET PASSWORD"}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", color: DIM, fontSize: 12, marginBottom: 6, fontFamily: fontTitle, letterSpacing: 1 }}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px 12px", background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontFamily: font, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" }}
            placeholder="your@email.com"
          />

          {mode !== "forgot" && (
            <>
              <label style={{ display: "block", color: DIM, fontSize: 12, marginBottom: 6, fontFamily: fontTitle, letterSpacing: 1 }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontFamily: font, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" }}
                placeholder="Min. 6 characters"
              />
            </>
          )}

          {error && <div style={{ color: RED, fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</div>}
          {message && <div style={{ color: GREEN, fontSize: 13, marginBottom: 12, textAlign: "center" }}>{message}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: GOLD, color: "#0a0c12", border: "none", padding: "12px 0", borderRadius: 8, fontFamily: fontTitle, fontSize: 13, letterSpacing: 1, cursor: loading ? "wait" : "pointer", fontWeight: 700, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : mode === "login" ? "LOG IN" : mode === "register" ? "SIGN UP" : "SEND RESET LINK"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 13 }}>
          {mode === "login" && (
            <>
              <span style={{ color: DIM }}>No account? </span>
              <button onClick={() => { setMode("register"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Sign up</button>
              <br />
              <button onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: DIM, cursor: "pointer", fontFamily: font, fontSize: 12, marginTop: 8 }}>Forgot password?</button>
            </>
          )}
          {mode === "register" && (
            <>
              <span style={{ color: DIM }}>Already have an account? </span>
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Log in</button>
            </>
          )}
          {mode === "forgot" && (
            <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Back to login</button>
          )}
        </div>
      </div>

      <div style={{ color: DIM, fontSize: 11, marginTop: 24, textAlign: "center" }}>
        By signing up you agree to our Terms of Service.
      </div>
    </div>
  );
}
