import express from 'express';
import { userDb, sessionDb } from './database.js';
import { moduleDb, adminLogDb, impersonationDb, AVAILABLE_MODULES } from './modules-db.js';

const router = express.Router();

// Middleware to verify admin access
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = sessionDb.getByToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const user = userDb.getById(session.userId);
  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.adminId = user.id;
  req.adminEmail = user.email;
  next();
}

// ==================== USER MANAGEMENT ====================

// Get all users (admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    const users = userDb.getAll();
    adminLogDb.log(req.adminId, 'view_all_users', null, null, req.ip);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', requireAdmin, (req, res) => {
  try {
    const user = userDb.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    adminLogDb.log(req.adminId, 'view_user', user.id, { email: user.email }, req.ip);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/users/:id', requireAdmin, (req, res) => {
  try {
    const { email, name, role } = req.body;
    const user = userDb.getById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) user.email = email;
    if (name) user.name = name;
    if (role) user.role = role;

    userDb.update(user.id, user);
    
    adminLogDb.log(req.adminId, 'update_user', user.id, { changes: req.body }, req.ip);
    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', requireAdmin, (req, res) => {
  try {
    const user = userDb.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    userDb.delete(req.params.id);
    
    adminLogDb.log(req.adminId, 'delete_user', req.params.id, { email: user.email }, req.ip);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MODULE MANAGEMENT ====================

// Get all available modules
router.get('/modules', requireAdmin, (req, res) => {
  try {
    res.json({ modules: AVAILABLE_MODULES });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get modules for a specific user
router.get('/users/:id/modules', requireAdmin, (req, res) => {
  try {
    const modules = moduleDb.getUserModules(req.params.id);
    res.json({ modules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enable a module for a user
router.post('/users/:id/modules/:moduleId/enable', requireAdmin, (req, res) => {
  try {
    moduleDb.enableModule(req.params.id, req.params.moduleId);
    
    adminLogDb.log(req.adminId, 'enable_module', req.params.id, { 
      moduleId: req.params.moduleId 
    }, req.ip);
    
    res.json({ message: 'Module enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disable a module for a user
router.post('/users/:id/modules/:moduleId/disable', requireAdmin, (req, res) => {
  try {
    moduleDb.disableModule(req.params.id, req.params.moduleId);
    
    adminLogDb.log(req.adminId, 'disable_module', req.params.id, { 
      moduleId: req.params.moduleId 
    }, req.ip);
    
    res.json({ message: 'Module disabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set all modules for a user at once
router.post('/users/:id/modules', requireAdmin, (req, res) => {
  try {
    const { moduleIds } = req.body;
    
    if (!Array.isArray(moduleIds)) {
      return res.status(400).json({ error: 'moduleIds must be an array' });
    }

    moduleDb.setUserModules(req.params.id, moduleIds);
    
    adminLogDb.log(req.adminId, 'set_user_modules', req.params.id, { 
      moduleIds 
    }, req.ip);
    
    res.json({ message: 'Modules updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER IMPERSONATION ====================

// Start impersonating a user
router.post('/impersonate/:userId', requireAdmin, (req, res) => {
  try {
    const targetUser = userDb.getById(req.params.userId);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow impersonating other admins
    if (targetUser.role === 'Admin') {
      return res.status(403).json({ error: 'Cannot impersonate other admins' });
    }

    const impToken = impersonationDb.start(req.adminId, req.params.userId);
    
    // Create a temporary session for the target user
    const userSession = sessionDb.create(targetUser.id);
    
    adminLogDb.log(req.adminId, 'start_impersonation', req.params.userId, { 
      targetEmail: targetUser.email 
    }, req.ip);
    
    res.json({ 
      impersonationToken: impToken,
      userSession: userSession.token,
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End impersonation
router.post('/impersonate/end', requireAdmin, (req, res) => {
  try {
    const { impersonationToken } = req.body;
    
    if (!impersonationToken) {
      return res.status(400).json({ error: 'Impersonation token required' });
    }

    const session = impersonationDb.getSession(impersonationToken);
    if (!session) {
      return res.status(404).json({ error: 'Impersonation session not found' });
    }

    impersonationDb.end(impersonationToken);
    
    adminLogDb.log(req.adminId, 'end_impersonation', session.target_user_id, null, req.ip);
    
    res.json({ message: 'Impersonation ended successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active impersonation sessions
router.get('/impersonate/sessions', requireAdmin, (req, res) => {
  try {
    const sessions = impersonationDb.getActiveSessions(req.adminId);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACTIVITY LOGS ====================

// Get all admin activity logs
router.get('/logs', requireAdmin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const logs = adminLogDb.getLogs(limit, offset);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logs for a specific user
router.get('/logs/user/:userId', requireAdmin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = adminLogDb.getLogsByUser(req.params.userId, limit);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logs by admin
router.get('/logs/admin/:adminId', requireAdmin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = adminLogDb.getLogsByAdmin(req.params.adminId, limit);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DASHBOARD STATS ====================

// Get admin dashboard statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const allUsers = userDb.getAll();
    const totalUsers = allUsers.length;
    const adminUsers = allUsers.filter(u => u.role === 'Admin').length;
    const regularUsers = totalUsers - adminUsers;
    
    const recentLogs = adminLogDb.getLogs(10, 0);
    const activeSessions = impersonationDb.getAllSessions(10);

    res.json({
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        recentActivity: recentLogs.length,
        activeImpersonations: activeSessions.filter(s => !s.ended_at).length
      },
      recentLogs,
      activeSessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
