import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import gitService from './git-service.js';
import { execSync } from 'child_process';
import path from 'path';

describe('Git Service - Version Control', () => {
  beforeAll(async () => {
    // Initialize git repo if not already
    try {
      await gitService.init();
    } catch (error) {
      console.log('Git already initialized');
    }
  });

  describe('Repository Initialization', () => {
    it('should initialize git repository', async () => {
      const result = await gitService.init();
      expect(result.success).toBe(true);
    });

    it('should get repository info', async () => {
      const result = await gitService.getRepoInfo();
      expect(result.success).toBe(true);
      expect(result.repo).toBeDefined();
      expect(result.repo.root).toBeDefined();
    });
  });

  describe('Branch Management', () => {
    it('should get current branch', async () => {
      const result = await gitService.getCurrentBranch();
      expect(result.success).toBe(true);
      expect(result.branch).toBeDefined();
    });

    it('should list branches', async () => {
      const result = await gitService.listBranches();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.branches)).toBe(true);
    });

    it('should create a new branch', async () => {
      const testBranch = `test-branch-${Date.now()}`;
      const result = await gitService.createBranch(testBranch);
      expect(result.success).toBe(true);
      
      // Cleanup
      await gitService.switchBranch('main').catch(() => 
        gitService.switchBranch('master')
      );
      await gitService.deleteBranch(testBranch);
    });
  });

  describe('Git Status', () => {
    it('should get git status', async () => {
      const result = await gitService.getStatus();
      expect(result.success).toBe(true);
      expect(result.branch).toBeDefined();
      expect(Array.isArray(result.files)).toBe(true);
    });
  });

  describe('Commit Operations', () => {
    it('should generate commit message', () => {
      const message = gitService.generateCommitMessage(
        'feature',
        'Add new feature',
        ['src/App.jsx', 'src/index.js']
      );
      expect(message).toContain('feat:');
      expect(message).toContain('Add new feature');
      expect(message).toContain('src/App.jsx');
    });

    it('should generate different commit types', () => {
      const types = ['feature', 'bugfix', 'refactor', 'docs', 'test'];
      const prefixes = ['feat:', 'fix:', 'refactor:', 'docs:', 'test:'];

      types.forEach((type, idx) => {
        const message = gitService.generateCommitMessage(type, 'Test message');
        expect(message).toContain(prefixes[idx]);
      });
    });

    it('should get commit history', async () => {
      const result = await gitService.getCommitHistory(10);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.commits)).toBe(true);
    });
  });

  describe('Stash Operations', () => {
    it('should list stashes', async () => {
      const result = await gitService.listStashes();
      expect(result.success).toBe(true);
    });
  });

  describe('Tag Operations', () => {
    it('should list tags', async () => {
      const result = await gitService.listTags();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.tags)).toBe(true);
    });

    it('should create a tag', async () => {
      const tagName = `test-tag-${Date.now()}`;
      const result = await gitService.createTag(tagName, 'Test tag');
      expect(result.success).toBe(true);
    });
  });

  describe('File Operations', () => {
    it('should get file at commit', async () => {
      const result = await gitService.getFileAtCommit('package.json', 'HEAD');
      if (result.success) {
        expect(result.content).toBeDefined();
        expect(typeof result.content).toBe('string');
      }
    });
  });

  describe('Diff Operations', () => {
    it('should get diff', async () => {
      const result = await gitService.getDiff('HEAD');
      expect(result.success).toBe(true);
    });
  });
});

describe('Git Service - Error Handling', () => {
  it('should handle invalid branch names gracefully', async () => {
    const result = await gitService.switchBranch('non-existent-branch-xyz');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle invalid commit hashes gracefully', async () => {
    const result = await gitService.getCommitDetails('invalid-hash-xyz');
    expect(result.success).toBe(false);
  });

  it('should handle invalid file paths gracefully', async () => {
    const result = await gitService.getFileAtCommit('non-existent-file.txt', 'HEAD');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('Git Service - Commit Message Generation', () => {
  it('should generate proper conventional commit messages', () => {
    const testCases = [
      {
        type: 'feature',
        desc: 'Add user authentication',
        expected: 'feat: Add user authentication'
      },
      {
        type: 'bugfix',
        desc: 'Fix login redirect issue',
        expected: 'fix: Fix login redirect issue'
      },
      {
        type: 'refactor',
        desc: 'Simplify API routes',
        expected: 'refactor: Simplify API routes'
      }
    ];

    testCases.forEach(({ type, desc, expected }) => {
      const message = gitService.generateCommitMessage(type, desc);
      expect(message).toContain(expected);
    });
  });

  it('should include file list in commit messages', () => {
    const files = ['src/auth.js', 'src/routes.js', 'tests/auth.test.js'];
    const message = gitService.generateCommitMessage('feature', 'Add auth', files);
    
    files.forEach(file => {
      expect(message).toContain(file);
    });
  });
});
