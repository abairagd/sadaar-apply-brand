import React, { useState } from "react";
import { Check } from "lucide-react";

const API_BASE = "https://sadaar-backend-production.up.railway.app/api";

const C = {
  ink: "#14282E", sand: "#F3ECDD", warm: "#FBF8F1", bronze: "#B08D57",
  char: "#22201B", line: "#DCD2BB", muted: "#7A7566", danger: "#A3402F",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const inputStyle = { border: `1px solid ${C.line}`, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, background: C.warm, color: C.char, width: "100%", boxSizing: "border-box" };

export default function ApplyAsBrand() {
  const [form, setForm] = useState({ name: "", description: "", category: "Men", contactEmail: "", contactPhone: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");

    if (!form.name.trim()) return setError("Brand name is required.");
    if (!form.contactEmail.trim().includes("@")) return setError("Enter a valid contact email.");
    if (!form.password || form.password.length < 4) return setError("Password must be at least 4 characters.");
    if (form.password !== confirmPassword) return setError("Passwords don't match.");

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
      setError(err.message || "Something went wrong — please try again in a moment.");
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
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.char, lineHeight: 1.6, marginTop: 12 }}>
            Thanks for applying to sell on SADAAR. Our team reviews every application personally — we'll be in
            touch at <strong>{form.contactEmail}</strong> once your brand has been reviewed, usually within a few
            business days.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginTop: 16 }}>
            Once approved, you'll be able to log in to your brand dashboard with the email and password you just set.
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
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 4 }}>Apply as a brand</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 24, lineHeight: 1.5 }}>
          Join independent Saudi fashion brands selling on SADAAR. You keep full ownership of your inventory and
          fulfillment — we handle the storefront, checkout, and customer relationship.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={form.name} onChange={set("name")} placeholder="Brand name" style={inputStyle} />
          <textarea value={form.description} onChange={set("description")} placeholder="Tell us about your brand — what you make, your style, your story" rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} />
          <div>
            <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 4 }}>Who do you primarily design for?</label>
            <select value={form.category} onChange={set("category")} style={inputStyle}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <input type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="Contact email" style={inputStyle} />
          <input type="tel" value={form.contactPhone} onChange={set("contactPhone")} placeholder="Contact phone (optional)" style={inputStyle} />
          <input type="password" value={form.password} onChange={set("password")} placeholder="Choose a dashboard password" style={inputStyle} />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" style={inputStyle} />
          {error && <p style={{ color: C.danger, fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
          <button type="button" onClick={submit} disabled={submitting} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.muted, marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
          Every application is reviewed by our team before your brand goes live on SADAAR.
        </p>
      </div>
    </div>
  );
}
