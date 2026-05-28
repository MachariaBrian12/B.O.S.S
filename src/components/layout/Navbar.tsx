"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-6 py-3 rounded-full whitespace-nowrap"
      style={{
        background: scrolled ? "rgba(5,5,8,0.9)" : "rgba(10,10,20,0.7)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 0 40px rgba(79,142,247,0.1)",
        transition: "background 0.3s",
      }}
    >
      {/* Logo */}
      <div style={{
        fontSize: 15, fontWeight: 800, letterSpacing: 2,
        background: "linear-gradient(90deg,var(--cyan),var(--blue),var(--purple))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        B.O.S.S
      </div>

      {/* Links */}
      <div className="flex gap-6">
        {["Features","AI","Pricing","Reviews"].map(link => (
          <a key={link} href={`#${link.toLowerCase()}`}
            className="text-[13px] transition-colors duration-200"
            style={{ color: "var(--muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f0f0ff")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(79,142,247,0.5)" }}
        whileTap={{ scale: 0.97 }}
        className="text-[13px] font-semibold px-5 py-2 rounded-full text-black border-none"
        style={{ background: "linear-gradient(135deg,var(--blue),var(--cyan))", cursor: "none" }}
      >
        Start Free →
      </motion.button>
    </motion.nav>
  )
}
