import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { userDb, sessionDb, magicLinkDb } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize ZeptoMail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zeptomail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'emailapikey',
    pass: process.env.ZEPTOMAIL_API_KEY
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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

    // Create magic link in database
    const magicLink = magicLinkDb.create(email);

    // Build the magic link URL
    const baseUrl = process.env.APP_URL || 'https://5173-ixdmg3hbaaxfll447b4dd-eeaad10b.us1.manus.computer';
    const magicLinkUrl = `${baseUrl}/verify?token=${magicLink.token}`;

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
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">TechyPark Engine</h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Cloud Control Platform</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px; font-weight: 600; text-align: center;">Sign in to your account</h2>
                    <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6; text-align: center;">
                      Click the button below to securely sign in to TechyPark Engine. This link will expire in 10 minutes.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);">
                            Sign in to TechyPark
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; text-align: center;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 8px 0 0; color: #3b82f6; font-size: 12px; word-break: break-all; text-align: center;">
                      ${magicLinkUrl}
                    </p>
                  </td>
                </tr>
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
      message: 'Magic link sent successfully'
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

    // Find magic link in database
    const magicLink = magicLinkDb.findByToken(token);

    if (!magicLink) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    // Mark magic link as used
    magicLinkDb.markUsed(token);

    // Find or create user
    const user = userDb.findOrCreate({
      email: magicLink.email,
      provider: 'email'
    });

    // Update last login
    userDb.updateLastLogin(user.id);

    // Create session
    const session = sessionDb.create(user.id, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        provider: user.provider
      },
      sessionToken: session.token
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

    const session = sessionDb.findByToken(sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.json({
      valid: true,
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        avatar: session.avatar,
        role: session.role,
        provider: session.provider
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
      sessionDb.delete(sessionToken);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.json({
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        avatar: session.avatar,
        role: session.role,
        provider: session.provider,
        status: session.status
      }
    });

  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile endpoint
app.patch('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { name, avatar } = req.body;
    const updatedUser = userDb.update(session.user_id, { name, avatar });

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        provider: updatedUser.provider
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== User Management API (Admin) ====================

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session || session.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const users = userDb.findAll(limit, offset);
    const total = userDb.count();

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatar: u.avatar,
        role: u.role,
        provider: u.provider,
        status: u.status,
        createdAt: u.created_at,
        lastLogin: u.last_login
      })),
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single user (admin only)
app.get('/api/users/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session || session.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const user = userDb.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        provider: user.provider,
        status: user.status,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
app.patch('/api/users/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session || session.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, role, status } = req.body;
    const updatedUser = userDb.update(req.params.id, { name, role, status });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        provider: updatedUser.provider,
        status: updatedUser.status
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session || session.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Prevent self-deletion
    if (req.params.id === session.user_id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = userDb.delete(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`TechyPark Engine API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database initialized with user management`);
  
  if (!process.env.ZEPTOMAIL_API_KEY) {
    console.warn('⚠️  Warning: ZEPTOMAIL_API_KEY is not set. Email sending will fail.');
  }
});

export default app;
