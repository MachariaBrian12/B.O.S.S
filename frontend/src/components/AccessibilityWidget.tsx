"use client";
import React, { useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  return (
    <React.Fragment>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        style={{
          position: "fixed", bottom: 80, right: 20, zIndex: 9998,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(59,130,246,0.2)",
          border: "1px solid rgba(59,130,246,0.4)",
          color: "#94A3B8", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        ♿
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Accessibility settings panel"
          style={{
            position: "fixed", bottom: 134, right: 20, zIndex: 9998,
            background: "rgba(5,5,15,0.97)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "20px", width: 280,
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 16 }}>
            ♿ Accessibility Settings
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 8 }}>
              TEXT SIZE
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              {(["normal", "large", "xl"] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting("fontSize", size)}
                  aria-pressed={settings.fontSize === size}
                  style={{
                    flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11,
                    border: settings.fontSize === size ? "1px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)",
                    background: settings.fontSize === size ? "rgba(59,130,246,0.2)" : "transparent",
                    color: settings.fontSize === size ? "#60A5FA" : "#475569",
                    cursor: "pointer", fontWeight: 500,
                  }}
                >
                  {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#F1F5F9" }}>High Contrast</div>
              <div style={{ fontSize: 11, color: "#475569" }}>Improve text visibility</div>
            </div>
            <button
              role="switch"
              aria-checked={settings.highContrast}
              onClick={() => updateSetting("highContrast", !settings.highContrast)}
              style={{
                width: 40, height: 22, borderRadius: 11, border: "none",
                background: settings.highContrast ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "rgba(255,255,255,0.1)",
                cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#F1F5F9" }}>Reduce Motion</div>
              <div style={{ fontSize: 11, color: "#475569" }}>Minimise animations</div>
            </div>
            <button
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
              style={{
                width: 40, height: 22, borderRadius: 11, border: "none",
                background: settings.reducedMotion ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "rgba(255,255,255,0.1)",
                cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
              }}
            />
          </div>

          
            href="/accessibility"
            style={{ fontSize: 11, color: "#06B6D4", textDecoration: "none", display: "block", marginTop: 4 }}
          >
            View Accessibility Statement →
          </a>
        </div>
      )}
    </React.Fragment>
  );
}
