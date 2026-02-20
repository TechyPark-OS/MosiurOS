# Super Admin Dev Console Guide

## Overview

The Dev Console is an AI-powered development environment that allows super admins to build and modify features using natural language commands. It's powered by the Manus AI API and provides direct access to code generation, debugging, and file management.

## Access

**URL:** `/dev-console`

**Requirements:**
- Must be logged in as a user with `Admin` role
- Non-admin users will be redirected to the dashboard

## Features

### 1. Chat Mode 💬
General-purpose AI assistant for development questions and guidance.

**Example Prompts:**
```
- "How do I add a new API endpoint for managing tags?"
- "What's the best way to implement real-time notifications?"
- "Explain the current authentication flow"
- "How can I optimize the database queries for the funnels page?"
```

### 2. Generate Feature Mode ⚡
AI generates complete features with frontend + backend code.

**Example Prompts:**
```
- "Create a tags system for organizing funnels with CRUD operations"
- "Build a notification center with real-time updates"
- "Add export functionality to download contacts as CSV"
- "Create a dashboard widget showing recent sales"
```

**Output Format:**
- Complete code files with paths
- Database schema changes
- API endpoint specifications
- React components
- Step-by-step implementation instructions

### 3. SQL Generator Mode 🗄️
Generate SQL queries from natural language.

**Example Prompts:**
```
- "Get all funnels created in the last 30 days with conversion rates"
- "Find top 10 products by revenue"
- "List all active subscriptions expiring this month"
- "Show contacts who haven't opened an email in 90 days"
```

### 4. Debug Code Mode 🐛
Analyze and fix code issues.

**How to Use:**
1. Paste the problematic code
2. Describe the error or issue
3. AI will provide root cause analysis and fixed code

**Example:**
```javascript
// Paste your code here
const result = await fetchData()
console.log(result.data.items) // Getting "Cannot read property 'items' of undefined"
```

### 5. Files Mode 📁
Browse and edit project files directly.

**Features:**
- View all project files
- Edit files in-browser
- Save changes directly
- Syntax highlighting

**Security:**
- Files are restricted to project directory
- No access to system files
- All changes are logged

## API Endpoints

All endpoints require Bearer token authentication with Admin role.

### Chat
```
POST /api/dev/chat
Body: {
  "message": "Your question or command",
  "conversationHistory": [] // Optional
}
```

### Generate Feature
```
POST /api/dev/generate-feature
Body: {
  "featureRequest": "Description of feature",
  "context": "Additional context" // Optional
}
```

### Generate SQL
```
POST /api/dev/generate-sql
Body: {
  "request": "Natural language query description",
  "schema": "Database schema info" // Optional
}
```

### Debug Code
```
POST /api/dev/debug-code
Body: {
  "code": "Code to debug",
  "error": "Error description"
}
```

### List Files
```
GET /api/dev/files
```

### Read File
```
GET /api/dev/file?path=src/pages/Dashboard.jsx
```

### Write File
```
POST /api/dev/file
Body: {
  "path": "src/pages/NewPage.jsx",
  "content": "File content"
}
```

### Get Database Schema
```
GET /api/dev/database-schema
```

## Best Practices

### 1. Be Specific
❌ "Add a button"
✅ "Add a blue 'Export' button to the top-right of the Contacts page that downloads all contacts as CSV"

### 2. Provide Context
Include relevant information about:
- Current file structure
- Related features
- Database schema
- API patterns used in the project

### 3. Iterate
Start with a basic feature, test it, then ask for enhancements:
1. "Create a basic tags system"
2. "Add color coding to tags"
3. "Add tag filtering to the funnels page"

### 4. Review Generated Code
Always review AI-generated code before implementing:
- Check for security issues
- Verify it follows project patterns
- Test thoroughly
- Ensure error handling is adequate

## Example Workflows

### Building a New Feature

1. **Plan the Feature**
   ```
   Mode: Chat
   Prompt: "I want to add a notes feature to contacts. What tables and endpoints do I need?"
   ```

2. **Generate the Code**
   ```
   Mode: Generate Feature
   Prompt: "Create a notes system for contacts with:
   - Add/edit/delete notes
   - Timestamp and author tracking
   - Display notes on contact detail page
   - API endpoints for CRUD operations"
   ```

3. **Implement the Code**
   - Use Files mode to create new files
   - Copy generated code
   - Make necessary adjustments

4. **Test and Debug**
   ```
   Mode: Debug Code
   If issues arise, paste the problematic code and error message
   ```

### Optimizing Existing Code

1. **Analyze Current Code**
   ```
   Mode: Chat
   Prompt: "Analyze src/pages/Funnels.jsx and suggest performance improvements"
   ```

2. **Get Specific Recommendations**
   ```
   Mode: Chat
   Prompt: "The funnels page is slow when loading 100+ funnels. How can I optimize it?"
   ```

3. **Implement Changes**
   Use Files mode to edit the file with suggested improvements

## Security Considerations

### What the Dev Console CAN Do:
✅ Read project files
✅ Write to project files
✅ Query database schema
✅ Generate code and SQL
✅ Provide development guidance

### What the Dev Console CANNOT Do:
❌ Execute arbitrary code
❌ Access system files outside project
❌ Modify database directly (only generates SQL)
❌ Access environment variables (except via file reading)
❌ Make external API calls (except to Manus AI)

### Recommendations:
1. Only grant Admin role to trusted developers
2. Review all generated code before deployment
3. Test in development before production
4. Keep conversation history for audit trail
5. Regularly backup your project

## Troubleshooting

### "No token provided" Error
- Ensure you're logged in
- Check that your session hasn't expired
- Verify you have Admin role

### "Failed to generate" Error
- Check your internet connection
- Verify Manus API key is set correctly
- Try simplifying your prompt
- Check server logs for details

### Generated Code Doesn't Work
- Review the code for project-specific adjustments needed
- Check that all dependencies are installed
- Verify file paths are correct
- Look for missing imports

### File Not Found
- Ensure the file path is relative to project root
- Check for typos in the path
- Verify the file exists in the file browser

## Tips for Better Results

1. **Use Examples**
   "Create a feature like the Funnels page but for Templates"

2. **Specify Technologies**
   "Use React hooks and Tailwind CSS"

3. **Request Tests**
   "Include unit tests for the API endpoints"

4. **Ask for Documentation**
   "Add JSDoc comments to all functions"

5. **Incremental Development**
   Build features step-by-step rather than all at once

## Manus AI Configuration

The Dev Console uses the Manus AI API with the following settings:

- **Model:** GPT-4o
- **Temperature:** 0.7 (balanced creativity and accuracy)
- **Max Tokens:** 4000 (long responses for complex features)

### API Key Setup

The API key is configured in the backend:
```javascript
// server/manus-ai.js
const MANUS_API_KEY = process.env.MANUS_API_KEY || 'sk-c-IOE6e6HZTanSGkAHoBTSj48i_kOzunuzUUwNBx_wtRV1nXhFld8pw5aaOVei9bFx19SFD77-etVLSFraAumA-QNzHr';
```

For production, set the `MANUS_API_KEY` environment variable.

## Support

For issues or questions:
1. Check this guide first
2. Review server logs: `server/index.js`
3. Test API endpoints directly with curl/Postman
4. Check browser console for frontend errors

## Future Enhancements

Planned features:
- [ ] Code execution sandbox
- [ ] Git integration for version control
- [ ] Collaborative editing
- [ ] AI-powered code review
- [ ] Automated testing generation
- [ ] Deployment automation
- [ ] Performance profiling
- [ ] Security scanning
