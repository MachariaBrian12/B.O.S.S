import Link from "next/link";

export const metadata = { title: "Privacy Policy | B.O.S.S" };

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", background: "#02020c", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
        <Link href="/" style={{ color: "#06B6D4", fontSize: 13, textDecoration: "none" }}>← Back to B.O.S.S</Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#F1F5F9", margin: "24px 0 8px", letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginBottom: 40 }}>
          Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {[
          {
            title: "1. Who We Are",
            content: `B.O.S.S (Business Operations & Orchestration Software Systems) is a SaaS platform designed to help African businesses manage operations, track revenue, and gain AI-powered insights. We are based in Nairobi, Kenya and operate under the Kenya Data Protection Act, 2019.`
          },
          {
            title: "2. What Data We Collect",
            content: `We collect the following information when you use B.O.S.S:
- Account information: name, email address, business name
- Business data: revenue, expenses, and operational entries you input
- Usage data: pages visited, features used, session duration
- Device data: browser type, operating system, IP address
- Error data: crash reports and performance metrics (via Sentry)`
          },
          {
            title: "3. How We Use Your Data",
            content: `We use your data to:
- Provide and improve the B.O.S.S platform
- Generate AI-powered business insights
- Send important service notifications
- Detect and fix errors in our application
- Comply with legal obligations under Kenyan and applicable international law`
          },
          {
            title: "4. Cookies",
            content: `We use cookies and similar technologies for:
- Essential cookies: required for authentication and core functionality
- Analytics cookies: to understand how users interact with B.O.S.S (Sentry)
- Marketing cookies: for personalised content (only with your consent)

You can manage your cookie preferences at any time using the cookie banner at the bottom of the page.`
          },
          {
            title: "5. Third-Party Services",
            content: `B.O.S.S uses the following third-party services which may process your data:
- Supabase: authentication and database storage
- Sentry: error tracking and performance monitoring
- Stripe: payment processing (PCI DSS compliant)
- Vercel: hosting and deployment

Each of these providers has their own privacy policy and data processing agreements.`
          },
          {
            title: "6. Data Storage & Security",
            content: `Your data is stored securely on servers within compliant cloud infrastructure. We implement industry-standard security measures including encryption in transit (TLS) and at rest, access controls, and regular security audits.`
          },
          {
            title: "7. Your Rights",
            content: `Under the Kenya Data Protection Act, 2019 and applicable regulations, you have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your account and associated data
- Object to processing of your data
- Data portability

To exercise any of these rights, contact us at privacy@boss.co.ke`
          },
          {
            title: "8. Data Retention",
            content: `We retain your data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.`
          },
          {
            title: "9. Changes to This Policy",
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Your continued use of B.O.S.S after changes constitutes acceptance of the updated policy.`
          },
          {
            title: "10. Contact Us",
            content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at:

B.O.S.S — Business Operations & Orchestration Software Systems
Email: privacy@boss.co.ke
Nairobi, Kenya`
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
