import express from 'express';
import gitService from './git-service.js';
import { userDb } from './database.js';

const router = express.Router();

/**
 * Middleware to verify admin user
 */
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const session = userDb.findSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = userDb.findById(session.userId);
  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.user = user;
  next();
};

// Apply admin verification to all git routes
router.use(verifyAdmin);

/**
 * Initialize Git repository
 * POST /api/git/init
 */
router.post('/init', async (req, res) => {
  try {
    const result = await gitService.init();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get current branch
 * GET /api/git/branch
 */
router.get('/branch', async (req, res) => {
  try {
    const result = await gitService.getCurrentBranch();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List all branches
 * GET /api/git/branches
 */
router.get('/branches', async (req, res) => {
  try {
    const result = await gitService.listBranches();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new branch
 * POST /api/git/branches
 * Body: { branchName: string }
 */
router.post('/branches', async (req, res) => {
  try {
    const { branchName } = req.body;
    if (!branchName) {
      return res.status(400).json({ error: 'Branch name required' });
    }
    const result = await gitService.createBranch(branchName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Switch to a branch
 * PUT /api/git/branches/:name
 */
router.put('/branches/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await gitService.switchBranch(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a branch
 * DELETE /api/git/branches/:name
 */
router.delete('/branches/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await gitService.deleteBranch(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get git status
 * GET /api/git/status
 */
router.get('/status', async (req, res) => {
  try {
    const result = await gitService.getStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stage all changes
 * POST /api/git/stage-all
 */
router.post('/stage-all', async (req, res) => {
  try {
    const result = await gitService.stageAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stage specific files
 * POST /api/git/stage
 * Body: { files: string[] }
 */
router.post('/stage', async (req, res) => {
  try {
    const { files } = req.body;
    if (!Array.isArray(files)) {
      return res.status(400).json({ error: 'Files array required' });
    }
    const result = await gitService.stageFiles(files);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Unstage files
 * POST /api/git/unstage
 * Body: { files: string[] }
 */
router.post('/unstage', async (req, res) => {
  try {
    const { files } = req.body;
    if (!Array.isArray(files)) {
      return res.status(400).json({ error: 'Files array required' });
    }
    const result = await gitService.unstageFiles(files);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Commit changes
 * POST /api/git/commit
 * Body: { message: string, author?: string }
 */
router.post('/commit', async (req, res) => {
  try {
    const { message, author } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Commit message required' });
    }
    const result = await gitService.commit(message, author || req.user.name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get commit history
 * GET /api/git/history?maxCount=50
 */
router.get('/history', async (req, res) => {
  try {
    const maxCount = parseInt(req.query.maxCount) || 50;
    const result = await gitService.getCommitHistory(maxCount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get diff
 * GET /api/git/diff?from=HEAD&to=HEAD~1
 */
router.get('/diff', async (req, res) => {
  try {
    const { from = 'HEAD', to } = req.query;
    const result = await gitService.getDiff(from, to);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get file diff
 * GET /api/git/diff/file?path=src/App.jsx&from=HEAD
 */
router.get('/diff/file', async (req, res) => {
  try {
    const { path, from = 'HEAD' } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path required' });
    }
    const result = await gitService.getFileDiff(path, from);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get file at commit
 * GET /api/git/file?path=src/App.jsx&commit=HEAD
 */
router.get('/file', async (req, res) => {
  try {
    const { path, commit = 'HEAD' } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path required' });
    }
    const result = await gitService.getFileAtCommit(path, commit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Revert to commit
 * POST /api/git/revert
 * Body: { commitHash: string }
 */
router.post('/revert', async (req, res) => {
  try {
    const { commitHash } = req.body;
    if (!commitHash) {
      return res.status(400).json({ error: 'Commit hash required' });
    }
    const result = await gitService.revertToCommit(commitHash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Reset to commit (hard reset)
 * POST /api/git/reset
 * Body: { commitHash: string }
 */
router.post('/reset', async (req, res) => {
  try {
    const { commitHash } = req.body;
    if (!commitHash) {
      return res.status(400).json({ error: 'Commit hash required' });
    }
    const result = await gitService.resetToCommit(commitHash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get blame information
 * GET /api/git/blame?path=src/App.jsx
 */
router.get('/blame', async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path required' });
    }
    const result = await gitService.getBlame(path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get commit details
 * GET /api/git/commit/:hash
 */
router.get('/commit/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const result = await gitService.getCommitDetails(hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate commit message
 * POST /api/git/generate-message
 * Body: { changeType: string, description: string, files?: string[] }
 */
router.post('/generate-message', (req, res) => {
  try {
    const { changeType, description, files } = req.body;
    if (!changeType || !description) {
      return res.status(400).json({ error: 'Change type and description required' });
    }
    const message = gitService.generateCommitMessage(changeType, description, files);
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create tag
 * POST /api/git/tags
 * Body: { tagName: string, message?: string }
 */
router.post('/tags', async (req, res) => {
  try {
    const { tagName, message } = req.body;
    if (!tagName) {
      return res.status(400).json({ error: 'Tag name required' });
    }
    const result = await gitService.createTag(tagName, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List tags
 * GET /api/git/tags
 */
router.get('/tags', async (req, res) => {
  try {
    const result = await gitService.listTags();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get repository info
 * GET /api/git/info
 */
router.get('/info', async (req, res) => {
  try {
    const result = await gitService.getRepoInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stash changes
 * POST /api/git/stash
 * Body: { message?: string }
 */
router.post('/stash', async (req, res) => {
  try {
    const { message } = req.body;
    const result = await gitService.stash(message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Apply stashed changes
 * POST /api/git/stash/apply
 * Body: { stashIndex?: number }
 */
router.post('/stash/apply', async (req, res) => {
  try {
    const { stashIndex = 0 } = req.body;
    const result = await gitService.applyStash(stashIndex);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List stashes
 * GET /api/git/stashes
 */
router.get('/stashes', async (req, res) => {
  try {
    const result = await gitService.listStashes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
