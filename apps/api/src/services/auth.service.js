const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth.middleware');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (name, email) => {
  const firstName = name.split(' ')[0];
  try {
    await resend.emails.send({
      from: 'B.O.S.S <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to B.O.S.S — Your Business Command Centre is Ready 🚀',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:12px;border:1px solid #222222;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px;text-align:center;">
              <h1 style="margin:0;font-size:36px;font-weight:900;letter-spacing:4px;color:#ffffff;">B.O.S.S</h1>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:3px;color:#6b7280;text-transform:uppercase;">Business Orchestration Software Systems</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;color:#6366f1;text-transform:uppercase;font-weight:600;">Welcome Aboard</p>
              <h2 style="margin:0 0 24px;font-size:28px;font-weight:700;color:#ffffff;">Hi ${firstName},</h2>
              
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#9ca3af;">
                Welcome to <strong style="color:#ffffff;">B.O.S.S</strong>. Your Business Command Centre is now ready.
              </p>

              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#9ca3af;">
                <strong style="color:#ffffff;">Business Orchestration Software Systems (B.O.S.S)</strong> is an AI-native business intelligence and operations platform designed to help businesses operate smarter through real-time intelligence, automation, analytics, and predictive insights.
              </p>

              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9ca3af;">
                Built with artificial intelligence at its core, B.O.S.S helps businesses move beyond traditional dashboards and static reporting into <strong style="color:#ffffff;">continuous operational intelligence</strong> and intelligent orchestration.
              </p>

              <!-- Feature Pills -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td width="25%" style="padding:4px;">
                    <div style="background:#1a1a2e;border:1px solid #2d2d5e;border-radius:8px;padding:12px;text-align:center;">
                      <div style="font-size:20px;margin-bottom:4px;">📊</div>
                      <div style="font-size:11px;color:#6366f1;font-weight:600;">Real-time Intel</div>
                    </div>
                  </td>
                  <td width="25%" style="padding:4px;">
                    <div style="background:#1a1a2e;border:1px solid #2d2d5e;border-radius:8px;padding:12px;text-align:center;">
                      <div style="font-size:20px;margin-bottom:4px;">🤖</div>
                      <div style="font-size:11px;color:#6366f1;font-weight:600;">AI-Native</div>
                    </div>
                  </td>
                  <td width="25%" style="padding:4px;">
                    <div style="background:#1a1a2e;border:1px solid #2d2d5e;border-radius:8px;padding:12px;text-align:center;">
                      <div style="font-size:20px;margin-bottom:4px;">⚡</div>
                      <div style="font-size:11px;color:#6366f1;font-weight:600;">Automation</div>
                    </div>
                  </td>
                  <td width="25%" style="padding:4px;">
                    <div style="background:#1a1a2e;border:1px solid #2d2d5e;border-radius:8px;padding:12px;text-align:center;">
                      <div style="font-size:20px;margin-bottom:4px;">🔮</div>
                      <div style="font-size:11px;color:#6366f1;font-weight:600;">Predictive</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Getting Started Box -->
              <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:24px;margin-bottom:32px;">
                <p style="margin:0 0 12px;font-size:13px;letter-spacing:2px;color:#6366f1;text-transform:uppercase;font-weight:600;">Getting Started</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#9ca3af;">
                  To get started, simply add your first business record and begin building the foundation of your organization's intelligence layer.
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://boss-engine.vercel.app" 
                       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:1px;padding:16px 40px;border-radius:8px;">
                      → Open B.O.S.S
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;line-height:1.7;color:#9ca3af;">
                We're excited to be part of your journey as you build, grow, and scale your business.
              </p>

              <p style="margin:24px 0 0;font-size:15px;color:#ffffff;font-weight:600;">Welcome aboard.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0a;border-top:1px solid #222222;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;letter-spacing:2px;color:#ffffff;">The B.O.S.S Team</p>
              <p style="margin:0;font-size:11px;color:#4b5563;letter-spacing:1px;">
                <em>Business Orchestration Software Systems</em><br>
                Intelligent by design. Powerful by nature.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`[Email] Welcome email sent to ${email}`);
  } catch (err) {
    // Fire-and-forget — never block registration if email fails
    console.error(
      `[Email] Failed to send welcome email to ${email}:`,
      err.message,
    );
  }
};

const register = async (name, email, password, business) => {
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [
    email.toLowerCase().trim(),
  ]);
  if (exists.rows[0]) throw new Error('Email already registered');
  const hashed = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password, business) VALUES ($1, $2, $3, $4) RETURNING id, name, email, business, created_at',
    [name, email.toLowerCase().trim(), hashed, business || 'My Business'],
  );
  const user = rows[0];
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  // Fire-and-forget — welcome email never blocks registration
  sendWelcomeEmail(name, email);

  return { user, token };
};

const login = async (email, password) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
    email.toLowerCase().trim(),
  ]);
  const user = rows[0];
  if (!user) throw new Error('Invalid email or password');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
  const { password: _, ...safe } = user;
  return { user: safe, token };
};

const getMe = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, business, created_at FROM users WHERE id = $1',
    [userId],
  );
  if (!rows[0]) throw new Error('User not found');
  return rows[0];
};

module.exports = { register, login, getMe };
