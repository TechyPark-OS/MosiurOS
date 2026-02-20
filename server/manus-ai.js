import axios from 'axios';

const MANUS_API_KEY = process.env.MANUS_API_KEY || 'sk-c-IOE6e6HZTanSGkAHoBTSj48i_kOzunuzUUwNBx_wtRV1nXhFld8pw5aaOVei9bFx19SFD77-etVLSFraAumA-QNzHr';
const MANUS_API_URL = 'https://api.manus.im/v1/chat/completions';

/**
 * Send a message to Manus AI and get a response
 * @param {string} message - The user's message/command
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} - AI response with content and metadata
 */
export async function sendToManusAI(message, conversationHistory = []) {
  try {
    const messages = [
      {
        role: 'system',
        content: `You are an expert full-stack developer assistant for TechyPark Engine, a ClickFunnels-style platform. 
You help super admins build and modify features using natural language commands.

Your capabilities:
- Generate React components and pages
- Create backend API endpoints
- Modify database schemas
- Write SQL queries
- Generate complete features with frontend + backend
- Provide code snippets in JavaScript/React
- Explain technical implementations

Always provide:
1. Clear, production-ready code
2. Proper error handling
3. Security best practices
4. Comments explaining complex logic

Format your responses with:
- Code blocks with language tags
- Step-by-step instructions when needed
- File paths for where code should go
- Database migration steps if needed`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post(
      MANUS_API_URL,
      {
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${MANUS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: response.data.model
    };

  } catch (error) {
    console.error('Manus AI Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Generate code based on a feature request
 * @param {string} featureRequest - Description of the feature to build
 * @param {string} context - Additional context (current files, database schema, etc.)
 * @returns {Promise<Object>} - Generated code and implementation steps
 */
export async function generateFeature(featureRequest, context = '') {
  const prompt = `Generate a complete implementation for this feature:

Feature Request: ${featureRequest}

${context ? `Context:\n${context}\n` : ''}

Please provide:
1. All necessary code files with full paths
2. Database schema changes (if needed)
3. API endpoints (if needed)
4. React components (if needed)
5. Step-by-step implementation instructions

Format each code block with the file path as a comment at the top.`;

  return await sendToManusAI(prompt);
}

/**
 * Analyze and suggest improvements for existing code
 * @param {string} code - The code to analyze
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Suggestions and improved code
 */
export async function analyzeCode(code, filePath) {
  const prompt = `Analyze this code and suggest improvements:

File: ${filePath}

\`\`\`javascript
${code}
\`\`\`

Please provide:
1. Code quality assessment
2. Security issues (if any)
3. Performance improvements
4. Best practices recommendations
5. Refactored code (if improvements are significant)`;

  return await sendToManusAI(prompt);
}

/**
 * Generate SQL queries based on natural language
 * @param {string} request - Natural language description of what to query
 * @param {string} schema - Database schema information
 * @returns {Promise<Object>} - SQL query and explanation
 */
export async function generateSQL(request, schema = '') {
  const prompt = `Generate SQL query for this request:

Request: ${request}

${schema ? `Database Schema:\n${schema}\n` : ''}

Please provide:
1. The SQL query
2. Explanation of what it does
3. Any indexes that might be needed
4. Sample expected results`;

  return await sendToManusAI(prompt);
}

/**
 * Debug code and suggest fixes
 * @param {string} code - The code with issues
 * @param {string} error - Error message or description of the problem
 * @returns {Promise<Object>} - Diagnosis and fixed code
 */
export async function debugCode(code, error) {
  const prompt = `Debug this code:

Error/Issue: ${error}

Code:
\`\`\`javascript
${code}
\`\`\`

Please provide:
1. Root cause analysis
2. Fixed code
3. Explanation of the fix
4. How to prevent similar issues`;

  return await sendToManusAI(prompt);
}

export default {
  sendToManusAI,
  generateFeature,
  analyzeCode,
  generateSQL,
  debugCode
};
