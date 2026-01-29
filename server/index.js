import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize ZeptoMail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zeptomail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.ZEPTOMAIL_USER || 'emailapikey',
    pass: process.env.ZEPTOMAIL_API_KEY
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for magic links (in production, use Redis or database)
const magicLinks = new Map();

// Store for verified sessions
const sessions = new Map();

// Generate a secure token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Send magic link endpoint
app.post('/api/auth/magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate unique token
    const token = generateToken();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store the magic link
    magicLinks.set(token, {
      email,
      expiresAt,
      used: false
    });

    // Build the magic link URL
    const baseUrl = process.env.APP_URL || 'https://5173-ixdmg3hbaaxfll447b4dd-eeaad10b.us1.manus.computer';
    const magicLinkUrl = `${baseUrl}/verify?token=${token}`;

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to TechyPark Engine</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">TechyPark Engine</h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Cloud Control Platform</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px; font-weight: 600; text-align: center;">Sign in to your account</h2>
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6; text-align: center;">
                      Click the button below to securely sign in to TechyPark Engine. This link will expire in 10 minutes.
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);">
                            Sign in to TechyPark
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Alternative link -->
                    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; text-align: center;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 8px 0 0; color: #3b82f6; font-size: 12px; word-break: break-all; text-align: center;">
                      ${magicLinkUrl}
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                    <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
                      © ${new Date().getFullYear()} TechyPark Engine. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email via ZeptoMail SMTP
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TechyPark Engine <noreply@techypark.com>',
      to: email,
      subject: 'Sign in to TechyPark Engine',
      html: htmlContent,
      text: `Sign in to TechyPark Engine\n\nClick the link below to sign in:\n${magicLinkUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this email, you can safely ignore it.`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Magic link email sent:', { email, messageId: info.messageId });
    
    res.json({ 
      success: true, 
      message: 'Magic link sent successfully',
      // Don't expose the token in production, this is for debugging
      ...(process.env.NODE_ENV === 'development' && { debug: { token } })
    });

  } catch (error) {
    console.error('Error sending magic link:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Verify magic link endpoint
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const linkData = magicLinks.get(token);

    if (!linkData) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    if (linkData.used) {
      return res.status(400).json({ error: 'This link has already been used' });
    }

    if (Date.now() > linkData.expiresAt) {
      magicLinks.delete(token);
      return res.status(400).json({ error: 'This link has expired' });
    }

    // Mark the link as used
    linkData.used = true;
    magicLinks.set(token, linkData);

    // Create a session
    const sessionToken = generateToken();
    const sessionData = {
      email: linkData.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    sessions.set(sessionToken, sessionData);

    // Clean up the magic link after a short delay
    setTimeout(() => {
      magicLinks.delete(token);
    }, 60000);

    res.json({
      success: true,
      user: {
        id: uuidv4(),
        email: linkData.email,
        name: linkData.email.split('@')[0],
        role: 'User',
        provider: 'email'
      },
      sessionToken
    });

  } catch (error) {
    console.error('Error verifying magic link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate session endpoint
app.post('/api/auth/session', async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    const sessionData = sessions.get(sessionToken);

    if (!sessionData) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (Date.now() > sessionData.expiresAt) {
      sessions.delete(sessionToken);
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      valid: true,
      user: {
        email: sessionData.email,
        name: sessionData.email.split('@')[0],
        role: 'User',
        provider: 'email'
      }
    });

  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (sessionToken) {
      sessions.delete(sessionToken);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`TechyPark Engine API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  
  if (!process.env.ZEPTOMAIL_API_KEY) {
    console.warn('⚠️  Warning: ZEPTOMAIL_API_KEY is not set. Email sending will fail.');
  }
});

export default app;
