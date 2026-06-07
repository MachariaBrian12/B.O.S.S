"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export type CookieConsent = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_KEY = "boss_cookie_consent";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COOKIE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [prefs, setPrefs] = useState<CookieConsent>({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) setVisible(true);
  }, []);

  const save = (consent: CookieConsent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  const acceptAll = () => save({ essential: true, analytics: true, marketing: true });
  const rejectAll = () => save({ essential: true, analytics: false, marketing: false });
  const savePrefs = () => save(prefs);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "rgba(5,5,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)", padding: "20px 24px",
    }}>
      {!managing ? (
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, lineHeight: 1.6 }}>
              🍪 We use cookies to improve your experience, analyse usage, and personalise content.
              By clicking "Accept All" you consent to our{" "}
              <Link href="/privacy-policy" style={{ color: "#06B6D4", textDecoration: "none" }}>Privacy Policy</Link>.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setManaging(true)} style={{
              padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#94A3B8", fontSize: 12, cursor: "pointer",
            }}>Manage</button>
            <button onClick={rejectAll} style={{
              padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#94A3B8", fontSize: 12, cursor: "pointer",
            }}>Reject All</button>
            <button onClick={acceptAll} style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Accept All</button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <p style={{ fontSize: 14, color: "#F1F5F9", fontWeight: 600, marginBottom: 12 }}>Manage Cookie Preferences</p>
          {[
            { key: "essential", label: "Essential", desc: "Required for the app to work. Cannot be disabled.", locked: true },
            { key: "analytics", label: "Analytics", desc: "Helps us understand how you use B.O.S.S (Sentry).", locked: false },
            { key: "marketing", label: "Marketing", desc: "Used for personalised content and ads.", locked: false },
          ].map(({ key, label, desc, locked }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{desc}</div>
              </div>
              <button
                disabled={locked}
                onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key as keyof CookieConsent] }))}
                style={{
                  width: 40, height: 22, borderRadius: 11, border: "none", cursor: locked ? "not-allowed" : "pointer",
                  background: (locked || prefs[key as keyof CookieConsent]) ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "rgba(255,255,255,0.1)",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => setManaging(false)} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#94A3B8", fontSize: 12, cursor: "pointer",
            }}>Back</button>
            <button onClick={savePrefs} style={{
              flex: 2, padding: "8px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Save Preferences</button>
          </div>
        </div>
      )}
    </div>
  );
}
