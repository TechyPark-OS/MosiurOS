import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve(process.cwd());
const git = simpleGit(PROJECT_ROOT);

/**
 * Git Service Module
 * Provides Git operations for version control of AI-assisted code changes
 */

export const gitService = {
  /**
   * Initialize Git repository if not already initialized
   */
  async init() {
    try {
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        await git.init();
        console.log('Git repository initialized');
      }
      return { success: true, message: 'Repository ready' };
    } catch (error) {
      console.error('Git init error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current branch name
   */
  async getCurrentBranch() {
    try {
      const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
      return { success: true, branch: branch.trim() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * List all branches
   */
  async listBranches() {
    try {
      const branchSummary = await git.branch();
      return {
        success: true,
        branches: branchSummary.all,
        current: branchSummary.current
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create a new branch
   */
  async createBranch(branchName) {
    try {
      await git.checkoutLocalBranch(branchName);
      return { success: true, message: `Branch ${branchName} created and checked out` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Switch to a branch
   */
  async switchBranch(branchName) {
    try {
      await git.checkout(branchName);
      return { success: true, message: `Switched to branch ${branchName}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a branch
   */
  async deleteBranch(branchName) {
    try {
      await git.deleteLocalBranch(branchName);
      return { success: true, message: `Branch ${branchName} deleted` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get git status
   */
  async getStatus() {
    try {
      const status = await git.status();
      return {
        success: true,
        branch: status.current,
        files: status.files,
        modified: status.modified,
        created: status.created,
        deleted: status.deleted,
        renamed: status.renamed,
        conflicted: status.conflicted,
        staged: status.staged,
        ahead: status.ahead,
        behind: status.behind
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Stage all changes
   */
  async stageAll() {
    try {
      await git.add('.');
      return { success: true, message: 'All changes staged' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Stage specific files
   */
  async stageFiles(files) {
    try {
      await git.add(files);
      return { success: true, message: `${files.length} file(s) staged` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unstage files
   */
  async unstageFiles(files) {
    try {
      await git.reset(files);
      return { success: true, message: `${files.length} file(s) unstaged` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Commit changes with AI-generated message
   */
  async commit(message, author = 'AI Assistant') {
    try {
      const result = await git.commit(message, {
        '--author': `"${author} <ai@techypark.dev>"`
      });
      return {
        success: true,
        message: `Commit created: ${result.commit}`,
        hash: result.commit
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get commit history
   */
  async getCommitHistory(maxCount = 50) {
    try {
      const log = await git.log({ maxCount });
      return {
        success: true,
        commits: log.all.map(commit => ({
          hash: commit.hash,
          message: commit.message,
          author: commit.author_name,
          date: commit.date,
          refs: commit.refs
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get diff between commits or working directory
   */
  async getDiff(fromCommit = 'HEAD', toCommit = null) {
    try {
      let diff;
      if (toCommit) {
        diff = await git.diff([fromCommit, toCommit]);
      } else {
        diff = await git.diff([fromCommit]);
      }
      return { success: true, diff };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get diff for specific file
   */
  async getFileDiff(filePath, fromCommit = 'HEAD') {
    try {
      const diff = await git.diff([fromCommit, '--', filePath]);
      return { success: true, diff };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get file content at specific commit
   */
  async getFileAtCommit(filePath, commit = 'HEAD') {
    try {
      const content = await git.show([`${commit}:${filePath}`]);
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Revert to a specific commit
   */
  async revertToCommit(commitHash) {
    try {
      await git.revert(commitHash);
      return { success: true, message: `Reverted to commit ${commitHash}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset to a specific commit (hard reset)
   */
  async resetToCommit(commitHash) {
    try {
      await git.reset(['--hard', commitHash]);
      return { success: true, message: `Reset to commit ${commitHash}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blame information for a file
   */
  async getBlame(filePath) {
    try {
      const blame = await git.blame(filePath);
      return { success: true, blame };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get commit details
   */
  async getCommitDetails(commitHash) {
    try {
      const log = await git.log([commitHash, '-1']);
      if (log.all.length === 0) {
        return { success: false, error: 'Commit not found' };
      }
      const commit = log.all[0];
      return {
        success: true,
        commit: {
          hash: commit.hash,
          message: commit.message,
          author: commit.author_name,
          email: commit.author_email,
          date: commit.date,
          body: commit.body
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate commit message for AI changes
   */
  generateCommitMessage(changeType, description, files = []) {
    const fileList = files.length > 0 ? `\n\nFiles changed:\n${files.map(f => `- ${f}`).join('\n')}` : '';
    
    const messages = {
      feature: `feat: ${description}${fileList}`,
      bugfix: `fix: ${description}${fileList}`,
      refactor: `refactor: ${description}${fileList}`,
      docs: `docs: ${description}${fileList}`,
      test: `test: ${description}${fileList}`,
      style: `style: ${description}${fileList}`,
      chore: `chore: ${description}${fileList}`
    };

    return messages[changeType] || `chore: ${description}${fileList}`;
  },

  /**
   * Create a tag
   */
  async createTag(tagName, message = '') {
    try {
      if (message) {
        await git.tag(['-a', tagName, '-m', message]);
      } else {
        await git.tag([tagName]);
      }
      return { success: true, message: `Tag ${tagName} created` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * List tags
   */
  async listTags() {
    try {
      const tags = await git.tags();
      return { success: true, tags: tags.all };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get repository info
   */
  async getRepoInfo() {
    try {
      const remotes = await git.getRemotes(true);
      const branch = await this.getCurrentBranch();
      const status = await this.getStatus();
      
      return {
        success: true,
        repo: {
          root: PROJECT_ROOT,
          branch: branch.branch,
          remotes: remotes,
          hasChanges: status.files.length > 0,
          stagedChanges: status.staged.length > 0
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Stash changes
   */
  async stash(message = 'AI-assisted changes') {
    try {
      await git.stash(['save', message]);
      return { success: true, message: 'Changes stashed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Apply stashed changes
   */
  async applyStash(stashIndex = 0) {
    try {
      await git.stash(['apply', `stash@{${stashIndex}}`]);
      return { success: true, message: 'Stash applied' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * List stashes
   */
  async listStashes() {
    try {
      const stashes = await git.stash(['list']);
      return { success: true, stashes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default gitService;
