"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AccessibilitySettings {
  fontSize: "normal" | "large" | "xl";
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
}

const defaults: AccessibilitySettings = {
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaults);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("boss_accessibility");
      if (stored) setSettings(JSON.parse(stored));
    } catch {}

    // Respect system reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setSettings(s => ({ ...s, reducedMotion: true }));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Font size
    root.style.setProperty("--font-scale", settings.fontSize === "xl" ? "1.25" : settings.fontSize === "large" ? "1.12" : "1");
    // High contrast
    root.setAttribute("data-high-contrast", settings.highContrast ? "true" : "false");
    // Reduced motion
    root.setAttribute("data-reduced-motion", settings.reducedMotion ? "true" : "false");
    // Persist
    localStorage.setItem("boss_accessibility", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}
