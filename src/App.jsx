import React, { useState } from "react";
import { Check } from "lucide-react";

const API_BASE = "https://sadaar-backend-production.up.railway.app/api";

const C = {
  ink: "#16261C", sand: "#F3ECDD", warm: "#FBF8F1", bronze: "#B08D57",
  char: "#22201B", line: "#DCD2BB", muted: "#7A7566", danger: "#A3402F",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const inputStyle = { border: `1px solid ${C.line}`, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, background: C.warm, color: C.char, width: "100%", boxSizing: "border-box" };

export default function ApplyAsBrand() {
  const [form, setForm] = useState({ name: "", description: "", category: "Contemporary", contactEmail: "", contactPhone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [diag, setDiag] = useState(null);
  const [diagRunning, setDiagRunning] = useState(false);

  const runDiagnostic = async () => {
    setDiagRunning(true);
    setDiag(null);
    const lines = [];
    try {
      lines.push(`Testing GET ${API_BASE}/health ...`);
      const healthRes = await fetch(`${API_BASE}/health`);
      lines.push(`GET /health status: ${healthRes.status}`);
      const healthBody = await healthRes.text();
      lines.push(`GET /health body: ${healthBody}`);
    } catch (err) {
      lines.push(`GET /health FAILED: ${err.name}: ${err.message}`);
    }
    try {
      lines.push(`Testing OPTIONS preflight to ${API_BASE}/brands/apply ...`);
      const optRes = await fetch(`${API_BASE}/brands/apply`, { method: "OPTIONS" });
      lines.push(`OPTIONS status: ${optRes.status}`);
      lines.push(`Access-Control-Allow-Origin: ${optRes.headers.get("access-control-allow-origin")}`);
      lines.push(`Access-Control-Allow-Methods: ${optRes.headers.get("access-control-allow-methods")}`);
    } catch (err) {
      lines.push(`OPTIONS preflight FAILED: ${err.name}: ${err.message}`);
    }
    setDiag(lines.join("\n"));
    setDiagRunning(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");

    if (!form.name.trim()) return setError("Brand name is required.");
    if (!form.contactEmail.trim().includes("@")) return setError("Enter a valid contact email.");
    if (!form.password) return setError("Password is required.");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/brands/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
      setResult(data);
    } catch (err) {
      setError(`${err.name || "Error"}: ${err.message || "Network error — could not reach the API."}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={{ minHeight: "100vh", background: C.sand, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{FONTS}</style>
        <div style={{ width: 440, background: C.warm, border: `1px solid ${C.line}`, padding: 32, textAlign: "center" }}>
          <Check size={28} color={C.ink} style={{ marginBottom: 12 }} />
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: C.ink, margin: "0 0 8px" }}>Application submitted</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 4 }}>
            Brand ID: {result.id} — status: <strong>{result.status}</strong>
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.6, marginTop: 16 }}>
            New brands start as <strong>pending</strong>. There's no approval dashboard yet, so to log in and test
            the brand dashboard right now, open Supabase → Table Editor → <code>brands</code> table, find this row,
            and change its <code>status</code> column from <code>pending</code> to <code>active</code>. Then log in
            with the email and password you just set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.sand, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{FONTS}</style>
      <div style={{ width: 440, background: C.warm, border: `1px solid ${C.line}`, padding: 32 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 22, color: C.ink, marginBottom: 4 }}>SADAAR</div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>Apply as a brand</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={form.name} onChange={set("name")} placeholder="Brand name" style={inputStyle} />
          <textarea value={form.description} onChange={set("description")} placeholder="Short description" rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} />
          <select value={form.category} onChange={set("category")} style={inputStyle}>
            {["Contemporary", "Abayas", "Streetwear", "Accessories", "Footwear"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="text" value={form.contactEmail} onChange={set("contactEmail")} placeholder="Contact email" style={inputStyle} />
          <input value={form.contactPhone} onChange={set("contactPhone")} placeholder="Contact phone (optional)" style={inputStyle} />
          <input type="text" value={form.password} onChange={set("password")} placeholder="Choose a dashboard password" style={inputStyle} />
          {error && <p style={{ color: C.danger, fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
          <button type="button" onClick={submit} disabled={submitting} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
          <button type="button" onClick={runDiagnostic} disabled={diagRunning} style={{ background: "none", border: `1px solid ${C.line}`, padding: "8px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer", color: C.char }}>
            {diagRunning ? "Testing connection..." : "Test connection to API"}
          </button>
          {diag && (
            <pre style={{ marginTop: 10, background: C.sand, padding: 12, fontSize: 11, fontFamily: "monospace", whiteSpace: "pre-wrap", color: C.char, border: `1px solid ${C.line}` }}>{diag}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
