import express from 'express';
import { 
  sendToManusAI, 
  generateFeature, 
  analyzeCode, 
  generateSQL, 
  debugCode 
} from './manus-ai.js';
import { sessionDb } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Middleware to check if user is super admin
const requireSuperAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDb.findByToken(token);

    if (!session || session.role !== 'Admin') {
      return res.status(403).json({ error: 'Super Admin access required' });
    }

    req.session = session;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Chat with Manus AI
router.post('/chat', requireSuperAdmin, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await sendToManusAI(message, conversationHistory || []);

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Generate a feature
router.post('/generate-feature', requireSuperAdmin, async (req, res) => {
  try {
    const { featureRequest, context } = req.body;

    if (!featureRequest) {
      return res.status(400).json({ error: 'Feature request is required' });
    }

    const response = await generateFeature(featureRequest, context);

    res.json(response);
  } catch (error) {
    console.error('Generate feature error:', error);
    res.status(500).json({ error: 'Failed to generate feature' });
  }
});

// Analyze code
router.post('/analyze-code', requireSuperAdmin, async (req, res) => {
  try {
    const { code, filePath } = req.body;

    if (!code || !filePath) {
      return res.status(400).json({ error: 'Code and file path are required' });
    }

    const response = await analyzeCode(code, filePath);

    res.json(response);
  } catch (error) {
    console.error('Analyze code error:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

// Generate SQL
router.post('/generate-sql', requireSuperAdmin, async (req, res) => {
  try {
    const { request, schema } = req.body;

    if (!request) {
      return res.status(400).json({ error: 'SQL request is required' });
    }

    const response = await generateSQL(request, schema);

    res.json(response);
  } catch (error) {
    console.error('Generate SQL error:', error);
    res.status(500).json({ error: 'Failed to generate SQL' });
  }
});

// Debug code
router.post('/debug-code', requireSuperAdmin, async (req, res) => {
  try {
    const { code, error } = req.body;

    if (!code || !error) {
      return res.status(400).json({ error: 'Code and error description are required' });
    }

    const response = await debugCode(code, error);

    res.json(response);
  } catch (error) {
    console.error('Debug code error:', error);
    res.status(500).json({ error: 'Failed to debug code' });
  }
});

// List project files
router.get('/files', requireSuperAdmin, async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    const files = [];

    function walkDir(dir, baseDir = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        // Skip node_modules, .git, and other build directories
        if (entry.name === 'node_modules' || 
            entry.name === '.git' || 
            entry.name === 'dist' || 
            entry.name === 'build' ||
            entry.name.startsWith('.')) {
          continue;
        }

        if (entry.isDirectory()) {
          walkDir(fullPath, relativePath);
        } else {
          files.push({
            path: relativePath,
            name: entry.name,
            type: path.extname(entry.name).slice(1) || 'file'
          });
        }
      }
    }

    walkDir(projectRoot);

    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Read a file
router.get('/file', requireSuperAdmin, async (req, res) => {
  try {
    const { path: filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const projectRoot = path.join(__dirname, '..');
    const fullPath = path.join(projectRoot, filePath);

    // Security check: ensure file is within project
    if (!fullPath.startsWith(projectRoot)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    res.json({ 
      path: filePath,
      content,
      size: content.length
    });
  } catch (error) {
    console.error('Read file error:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Write a file
router.post('/file', requireSuperAdmin, async (req, res) => {
  try {
    const { path: filePath, content } = req.body;

    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'File path and content are required' });
    }

    const projectRoot = path.join(__dirname, '..');
    const fullPath = path.join(projectRoot, filePath);

    // Security check: ensure file is within project
    if (!fullPath.startsWith(projectRoot)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');

    res.json({ 
      success: true,
      path: filePath,
      message: 'File saved successfully'
    });
  } catch (error) {
    console.error('Write file error:', error);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// Get database schema
router.get('/database-schema', requireSuperAdmin, async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'database-expanded.js');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Extract table creation statements
    const tableMatches = schemaContent.match(/CREATE TABLE[^;]+;/g) || [];

    res.json({
      tables: tableMatches,
      fullSchema: schemaContent
    });
  } catch (error) {
    console.error('Get schema error:', error);
    res.status(500).json({ error: 'Failed to get database schema' });
  }
});

// Execute code (with safety limits)
router.post('/execute', requireSuperAdmin, async (req, res) => {
  try {
    const { code, type } = req.body;

    if (!code || !type) {
      return res.status(400).json({ error: 'Code and type are required' });
    }

    // For now, just return a message - actual code execution would need sandboxing
    res.json({
      success: true,
      message: 'Code execution endpoint - implement with proper sandboxing',
      note: 'For security, direct code execution is disabled. Use file operations instead.'
    });
  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

export default router;
