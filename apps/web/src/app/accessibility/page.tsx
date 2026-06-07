import Link from "next/link";

export const metadata = { title: "Accessibility Statement | B.O.S.S" };

export default function AccessibilityStatement() {
  return (
    <div style={{ minHeight: "100vh", background: "#02020c", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
        <Link href="/" style={{ color: "#06B6D4", fontSize: 13, textDecoration: "none" }}>← Back to B.O.S.S</Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#F1F5F9", margin: "24px 0 8px", letterSpacing: "-0.02em" }}>
          Accessibility Statement
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginBottom: 40 }}>
          Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {[
          {
            title: "Our Commitment",
            content: `B.O.S.S is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.`
          },
          {
            title: "Conformance Status",
            content: `We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.`
          },
          {
            title: "Accessibility Features",
            content: `B.O.S.S includes the following accessibility features:
- Adjustable text size (Normal, Large, Extra Large)
- High contrast mode for improved visibility
- Reduced motion option for users sensitive to animation
- Keyboard navigation support throughout the app
- ARIA labels on all interactive elements
- Semantic HTML structure for screen reader compatibility
- Sufficient colour contrast ratios
- Focus indicators on all interactive elements`
          },
          {
            title: "Known Limitations",
            content: `We are aware of the following limitations and are actively working to resolve them:
- Some data visualisation charts may not be fully accessible to screen readers
- Some complex interactive components may require further ARIA improvements

We are committed to resolving these issues in future updates.`
          },
          {
            title: "Technical Specifications",
            content: `B.O.S.S relies on the following technologies for conformance:
- HTML5
- CSS3
- JavaScript (React/Next.js)
- WAI-ARIA`
          },
          {
            title: "Feedback & Contact",
            content: `We welcome your feedback on the accessibility of B.O.S.S. If you experience any barriers or have suggestions for improvement, please contact us:

Email: accessibility@boss.co.ke
We aim to respond to accessibility feedback within 2 business days.`
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", marginBottom: 10 }}>{title}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
