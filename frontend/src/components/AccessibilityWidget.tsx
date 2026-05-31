"use client";
import { useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  const btnStyle = (active: boolean) => ({
    flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11,
    border: active ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(59,130,246,0.2)" : "transparent",
    color: active ? "#60A5FA" : "#475569",
    cursor: "pointer" as const, fontWeight: 500,
  });

  const toggleStyle = (active: boolean) => ({
    width: 40, height: 22, borderRadius: 11, border: "none",
    background: active ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "rgba(255,255,255,0.1)",
    cursor: "pointer" as const, transition: "background 0.2s", flexShrink: 0,
  });

  return (
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9998 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Accessibility settings"
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(59,130,246,0.2)",
          border: "1px solid rgba(59,130,246,0.4)",
          color: "#94A3B8", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        ♿
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: 54, right: 0,
          background: "rgba(5,5,15,0.97)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "20px", width: 280,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 16 }}>
            ♿ Accessibility
          </p>

          <p style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>TEXT SIZE</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["normal", "large", "xl"] as const).map(size => (
              <button key={size} onClick={() => updateSetting("fontSize", size)} style={btnStyle(settings.fontSize === size)}>
                {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "#F1F5F9", margin: 0 }}>High Contrast</p>
            <button onClick={() => updateSetting("highContrast", !settings.highContrast)} style={toggleStyle(settings.highContrast)} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "#F1F5F9", margin: 0 }}>Reduce Motion</p>
            <button onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)} style={toggleStyle(settings.reducedMotion)} />
          </div>

          <a href="/accessibility" style={{ fontSize: 11, color: "#06B6D4", textDecoration: "none" }}>
            Accessibility Statement →
          </a>
        </div>
      )}
    </div>
  );
}
