# Git Integration Guide for Dev Console

## Overview

The Dev Console now includes comprehensive Git integration for version control of all AI-assisted code changes. This enables super admins to track, review, and rollback changes with full version history.

## Features

### 1. Automatic Commit Tracking
When you save a file in the Dev Console's file editor, changes are automatically:
- Staged in Git
- Committed with a descriptive message
- Tracked in the commit history

### 2. Branch Management
- **Create branches** for experimental features
- **Switch branches** to work on different features
- **Delete branches** when no longer needed
- **View current branch** status

### 3. Commit History
- **View all commits** with timestamps and authors
- **Copy commit hashes** for reference
- **View diffs** for each commit
- **Reset to commits** to revert changes

### 4. Diff Viewer
- **View changes** between commits
- **Syntax highlighting** for code diffs
- **File-specific diffs** to see what changed in each file

### 5. Rollback Functionality
- **Revert commits** to undo changes while keeping history
- **Reset to commits** for hard resets (use with caution)
- **Stash changes** to temporarily save work

### 6. Tag Management
- **Create tags** for release versions
- **List tags** for version tracking
- **Reference tags** in commits

## Using Git in Dev Console

### Opening the Git Panel

Click the **🔀 Git** button in the Dev Console header to open the Git panel. The panel slides up from the bottom with full version control capabilities.

### Git Status Tab

The Status tab shows:
- **Current branch** name
- **Modified files** count
- **Created files** count
- **Deleted files** count
- **Staged files** count
- **List of changed files**

**Actions:**
- **Stage All** - Stage all changes for commit
- **Commit** - Create a commit with your message
- **Stash** - Temporarily save changes

### Commit History Tab

View all commits with:
- **Commit hash** (first 7 characters)
- **Commit message**
- **Author name**
- **Commit date**

**Actions:**
- **Copy hash** - Copy commit hash to clipboard
- **View diff** - See what changed in that commit
- **Reset** - Reset to this commit (hard reset)

### Branches Tab

Manage your Git branches:
- **Create branch** - Enter a new branch name and click Create
- **Switch branch** - Click Switch to checkout a branch
- **Delete branch** - Remove a branch (not available for main/master)

### Tags Tab

Create and view release tags:
- **Create tag** - Enter a tag name (e.g., v1.0.0)
- **List tags** - View all existing tags

### Stash Tab

View all stashed changes for later retrieval.

## API Endpoints

All Git operations are available via REST API:

### Status
```
GET /api/git/status
GET /api/git/info
```

### Branches
```
GET /api/git/branches
POST /api/git/branches { branchName }
PUT /api/git/branches/:name
DELETE /api/git/branches/:name
```

### Commits
```
GET /api/git/history?maxCount=50
POST /api/git/commit { message, author }
GET /api/git/commit/:hash
```

### Diffs
```
GET /api/git/diff?from=HEAD&to=HEAD~1
GET /api/git/diff/file?path=src/App.jsx&from=HEAD
```

### Rollback
```
POST /api/git/revert { commitHash }
POST /api/git/reset { commitHash }
```

### Tags
```
GET /api/git/tags
POST /api/git/tags { tagName, message }
```

### Stash
```
POST /api/git/stash { message }
POST /api/git/stash/apply { stashIndex }
GET /api/git/stashes
```

## Workflow Examples

### Example 1: Making and Committing Changes

1. Open Dev Console
2. Go to **Files** tab
3. Select a file to edit
4. Make your changes
5. Click **Save** - changes are automatically committed
6. Open **Git** panel to view the new commit

### Example 2: Creating a Feature Branch

1. Open **Git** panel
2. Go to **Branches** tab
3. Enter branch name: `feature/new-feature`
4. Click **Create**
5. Make your changes and save files
6. Each save creates a commit on this branch

### Example 3: Reviewing Changes

1. Open **Git** panel
2. Go to **History** tab
3. Click **View diff** on a commit
4. Review the changes in the diff viewer
5. Click **Reset** if you want to undo

### Example 4: Reverting to a Previous State

1. Open **Git** panel
2. Go to **History** tab
3. Find the commit you want to revert to
4. Click **Reset** (hard reset) or **Revert** (soft revert)
5. Confirm the action

## Best Practices

### 1. Meaningful Commit Messages
The system auto-generates commit messages like:
```
chore: Update App.jsx via Dev Console
feat: Add new authentication system
fix: Resolve login redirect issue
```

When manually committing, use clear, descriptive messages:
```
✅ Good: "Add email validation to signup form"
❌ Bad: "fix stuff"
```

### 2. Frequent Commits
- Commit after each logical change
- Keep commits small and focused
- Makes it easier to revert specific changes

### 3. Branch Strategy
- Use `main` or `master` for production code
- Create feature branches for new features
- Delete branches after merging

### 4. Before Major Changes
- Create a tag: `v1.0.0-backup`
- Create a branch: `experimental/risky-feature`
- Test thoroughly before merging to main

### 5. Regular Backups
- Create tags for important versions
- Push to remote repository if available
- Review history regularly

## Security Considerations

### Access Control
- Git operations require **Admin role**
- All changes are logged with user information
- API endpoints verify authentication

### Safe Operations
- **Revert** creates a new commit (safe)
- **Reset** overwrites history (use with caution)
- **Stash** temporarily saves changes

### Audit Trail
Every commit includes:
- Author name
- Timestamp
- Commit message
- Changed files

## Troubleshooting

### "Failed to commit" Error
- Ensure files are staged
- Check commit message is not empty
- Verify you have write permissions

### Branch Switch Failed
- Ensure no uncommitted changes
- Use Stash to save changes first
- Check branch name is correct

### Diff Not Showing
- Verify commit exists
- Check file path is correct
- Try viewing a different commit

### Reset Didn't Work
- Hard reset overwrites working directory
- Stash any unsaved changes first
- Check commit hash is correct

## Advanced Usage

### Custom Commit Messages
When manually committing, use conventional commit format:
```
feat: Add new feature
fix: Resolve bug
refactor: Improve code structure
docs: Update documentation
test: Add unit tests
chore: Update dependencies
```

### Viewing File History
```
GET /api/git/file?path=src/App.jsx&commit=HEAD
```

Get a specific file's content at any commit.

### Blame Information
```
GET /api/git/blame?path=src/App.jsx
```

See who made each change in a file.

## Integration with Dev Console

### Auto-Commit on File Save
When you save a file in the Files tab:
1. File is automatically staged
2. Commit is created with auto-generated message
3. Change appears in Git history

### Manual Commits
In the Git panel Status tab:
1. Write a custom commit message
2. Click "Commit Changes"
3. All staged files are committed

### Diff Viewer Integration
Click "View diff" on any commit to see:
- Full diff output
- Syntax highlighting
- Line-by-line changes

## Future Enhancements

Planned features:
- [ ] Remote repository integration (GitHub, GitLab)
- [ ] Pull/Push operations
- [ ] Merge conflict resolution UI
- [ ] Code review interface
- [ ] Automated testing on commits
- [ ] Deployment automation
- [ ] Webhook integrations
- [ ] Git hooks support

## Support

For issues or questions:
1. Check this guide first
2. Review server logs: `server/index.js`
3. Test API endpoints directly
4. Check browser console for errors

## Related Documentation

- [Dev Console Guide](./DEV_CONSOLE_GUIDE.md)
- [Backend API Documentation](./server/README.md)
- [Git Service API](./server/git-routes.js)
