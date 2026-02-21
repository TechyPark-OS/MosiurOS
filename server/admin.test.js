import { describe, it, expect, beforeAll } from 'vitest';
import { userDb } from './database.js';
import { moduleDb, adminLogDb, impersonationDb } from './modules-db.js';

describe('Admin Features', () => {
  let testUserId;
  let testAdminId;

  beforeAll(() => {
    // Create test users
    const admin = userDb.create({ email: 'admin@test.com', name: 'Admin User', role: 'Admin' });
    testAdminId = admin.id;

    const user = userDb.create({ email: 'user@test.com', name: 'Test User' });
    testUserId = user.id;
  });

  describe('Module Management', () => {
    it('should get all available modules', () => {
      const modules = moduleDb.getAvailableModules();
      expect(modules).toBeInstanceOf(Array);
      expect(modules.length).toBeGreaterThan(0);
      expect(modules[0]).toHaveProperty('id');
      expect(modules[0]).toHaveProperty('name');
      expect(modules[0]).toHaveProperty('description');
    });

    it('should initialize default modules for user', () => {
      moduleDb.initializeUserModules(testUserId, 'starter');
      const modules = moduleDb.getUserModules(testUserId);
      expect(modules).toBeInstanceOf(Array);
      expect(modules.some(m => m.enabled)).toBe(true);
    });

    it('should enable a module for user', () => {
      moduleDb.enableModule(testUserId, 'funnels');
      const hasAccess = moduleDb.hasAccess(testUserId, 'funnels');
      expect(hasAccess).toBe(true);
    });

    it('should disable a module for user', () => {
      moduleDb.enableModule(testUserId, 'products');
      moduleDb.disableModule(testUserId, 'products');
      const hasAccess = moduleDb.hasAccess(testUserId, 'products');
      expect(hasAccess).toBe(false);
    });

    it('should set multiple modules at once', () => {
      moduleDb.setUserModules(testUserId, ['dashboard', 'funnels', 'email']);
      expect(moduleDb.hasAccess(testUserId, 'dashboard')).toBe(true);
      expect(moduleDb.hasAccess(testUserId, 'funnels')).toBe(true);
      expect(moduleDb.hasAccess(testUserId, 'email')).toBe(true);
      expect(moduleDb.hasAccess(testUserId, 'products')).toBe(false);
    });
  });

  describe('Admin Activity Logging', () => {
    it('should log admin actions', () => {
      adminLogDb.log(testAdminId, 'test_action', testUserId, { test: 'data' }, '127.0.0.1');
      const logs = adminLogDb.getLogsByAdmin(testAdminId, 10);
      expect(logs).toBeInstanceOf(Array);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].action).toBe('test_action');
    });

    it('should get logs by user', () => {
      adminLogDb.log(testAdminId, 'view_user', testUserId, null, '127.0.0.1');
      const logs = adminLogDb.getLogsByUser(testUserId, 10);
      expect(logs).toBeInstanceOf(Array);
      expect(logs.some(l => l.action === 'view_user')).toBe(true);
    });

    it('should get all logs with limit', () => {
      const logs = adminLogDb.getLogs(5, 0);
      expect(logs).toBeInstanceOf(Array);
      expect(logs.length).toBeLessThanOrEqual(5);
    });
  });

  describe('User Impersonation', () => {
    it('should start impersonation session', () => {
      const token = impersonationDb.start(testAdminId, testUserId);
      expect(token).toBeTruthy();
      expect(token).toMatch(/^imp_/);
    });

    it('should get active impersonation session', () => {
      const token = impersonationDb.start(testAdminId, testUserId);
      const session = impersonationDb.getSession(token);
      expect(session).toBeTruthy();
      expect(session.admin_id).toBe(testAdminId);
      expect(session.target_user_id).toBe(testUserId);
      expect(session.ended_at).toBeNull();
    });

    it('should end impersonation session', () => {
      const token = impersonationDb.start(testAdminId, testUserId);
      impersonationDb.end(token);
      const session = impersonationDb.getSession(token);
      expect(session).toBeNull();
    });

    it('should get active sessions for admin', () => {
      impersonationDb.start(testAdminId, testUserId);
      const sessions = impersonationDb.getActiveSessions(testAdminId);
      expect(sessions).toBeInstanceOf(Array);
      expect(sessions.length).toBeGreaterThan(0);
    });
  });
});
