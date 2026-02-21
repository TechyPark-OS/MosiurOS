import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GitBranch, GitCommit, GitMerge, Trash2, Plus, Copy, Check,
  ChevronDown, ChevronRight, Clock, User, MessageSquare, AlertCircle,
  Tag, Archive, RotateCcw, Eye, Download
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function GitPanel({ token, onClose }) {
  const [activeTab, setActiveTab] = useState('status'); // status, history, branches, tags, stash
  const [status, setStatus] = useState(null);
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tags, setTags] = useState([]);
  const [stashes, setStashes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [diffView, setDiffView] = useState(null);
  const [copied, setCopied] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadGitStatus();
  }, []);

  const loadGitStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/git/status`, { headers });
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to load git status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommitHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/git/history?maxCount=50`, { headers });
      setCommits(response.data.commits || []);
    } catch (error) {
      console.error('Failed to load commit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/git/branches`, { headers });
      setBranches(response.data.branches || []);
    } catch (error) {
      console.error('Failed to load branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/git/tags`, { headers });
      setTags(response.data.tags || []);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStashes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/git/stashes`, { headers });
      setStashes(response.data.stashes || '');
    } catch (error) {
      console.error('Failed to load stashes:', error);
    } finally {
      setLoading(false);
    }
  };

  const stageAll = async () => {
    try {
      await axios.post(`${API_URL}/api/git/stage-all`, {}, { headers });
      loadGitStatus();
    } catch (error) {
      console.error('Failed to stage files:', error);
    }
  };

  const commit = async () => {
    if (!commitMessage.trim()) {
      alert('Commit message required');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/git/commit`,
        { message: commitMessage },
        { headers }
      );
      setCommitMessage('');
      loadGitStatus();
      loadCommitHistory();
    } catch (error) {
      console.error('Failed to commit:', error);
      alert('Failed to commit changes');
    }
  };

  const createBranch = async () => {
    if (!newBranchName.trim()) {
      alert('Branch name required');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/git/branches`,
        { branchName: newBranchName },
        { headers }
      );
      setNewBranchName('');
      loadBranches();
      loadGitStatus();
    } catch (error) {
      console.error('Failed to create branch:', error);
      alert('Failed to create branch');
    }
  };

  const switchBranch = async (branchName) => {
    try {
      await axios.put(`${API_URL}/api/git/branches/${branchName}`, {}, { headers });
      loadGitStatus();
      loadBranches();
    } catch (error) {
      console.error('Failed to switch branch:', error);
      alert('Failed to switch branch');
    }
  };

  const deleteBranch = async (branchName) => {
    if (!confirm(`Delete branch "${branchName}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/git/branches/${branchName}`, { headers });
      loadBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
      alert('Failed to delete branch');
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) {
      alert('Tag name required');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/git/tags`,
        { tagName: newTagName },
        { headers }
      );
      setNewTagName('');
      loadTags();
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag');
    }
  };

  const viewDiff = async (commitHash) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/git/diff?from=${commitHash}`,
        { headers }
      );
      setDiffView(response.data.diff);
      setSelectedCommit(commitHash);
    } catch (error) {
      console.error('Failed to load diff:', error);
    }
  };

  const resetToCommit = async (commitHash) => {
    if (!confirm(`Reset to commit ${commitHash.substring(0, 7)}? This cannot be undone.`)) {
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/git/reset`,
        { commitHash },
        { headers }
      );
      loadGitStatus();
      loadCommitHistory();
      alert('Reset successful');
    } catch (error) {
      console.error('Failed to reset:', error);
      alert('Failed to reset');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stashChanges = async () => {
    try {
      await axios.post(
        `${API_URL}/api/git/stash`,
        { message: 'AI-assisted changes' },
        { headers }
      );
      loadGitStatus();
      loadStashes();
      alert('Changes stashed');
    } catch (error) {
      console.error('Failed to stash:', error);
      alert('Failed to stash changes');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Git Version Control
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {[
          { id: 'status', label: 'Status', icon: AlertCircle },
          { id: 'history', label: 'History', icon: Clock },
          { id: 'branches', label: 'Branches', icon: GitBranch },
          { id: 'tags', label: 'Tags', icon: Tag },
          { id: 'stash', label: 'Stash', icon: Archive }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'history') loadCommitHistory();
              if (tab.id === 'branches') loadBranches();
              if (tab.id === 'tags') loadTags();
              if (tab.id === 'stash') loadStashes();
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="p-4 space-y-4">
            {status && (
              <>
                {/* Current Branch */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold">Current Branch</span>
                  </div>
                  <div className="text-lg font-mono text-green-400">{status.branch}</div>
                </div>

                {/* Changes Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Modified</div>
                    <div className="text-2xl font-bold text-yellow-400">{status.modified?.length || 0}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Created</div>
                    <div className="text-2xl font-bold text-green-400">{status.created?.length || 0}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Deleted</div>
                    <div className="text-2xl font-bold text-red-400">{status.deleted?.length || 0}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Staged</div>
                    <div className="text-2xl font-bold text-blue-400">{status.staged?.length || 0}</div>
                  </div>
                </div>

                {/* Changed Files */}
                {status.files && status.files.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold">Changed Files ({status.files.length})</span>
                      <button
                        onClick={stageAll}
                        className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        Stage All
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {status.files.map((file, idx) => (
                        <div key={idx} className="text-sm text-gray-400 font-mono">
                          {file.path}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commit Section */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-semibold mb-2">Commit Message</label>
                  <textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Describe your changes..."
                    className="w-full bg-gray-900 text-white rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={commit}
                    disabled={!commitMessage.trim()}
                    className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded transition font-medium"
                  >
                    <GitCommit className="w-4 h-4 inline mr-2" />
                    Commit Changes
                  </button>
                </div>

                {/* Stash Button */}
                <button
                  onClick={stashChanges}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition text-sm"
                >
                  <Archive className="w-4 h-4 inline mr-2" />
                  Stash Changes
                </button>
              </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-2">
            {commits.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No commits yet</div>
            ) : (
              commits.map((commit) => (
                <div key={commit.hash} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs text-green-400 font-mono">{commit.hash.substring(0, 7)}</code>
                        <button
                          onClick={() => copyToClipboard(commit.hash)}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-sm font-medium text-white truncate">{commit.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {commit.author} • {new Date(commit.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => viewDiff(commit.hash)}
                        className="p-1 hover:bg-gray-700 rounded transition"
                        title="View diff"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => resetToCommit(commit.hash)}
                        className="p-1 hover:bg-red-900 rounded transition text-red-400"
                        title="Reset to this commit"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Branches Tab */}
        {activeTab === 'branches' && (
          <div className="p-4 space-y-4">
            {/* Create Branch */}
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-semibold mb-2">Create New Branch</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="branch-name"
                  className="flex-1 bg-gray-900 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createBranch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Branches List */}
            <div className="space-y-2">
              {branches.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No branches</div>
              ) : (
                branches.map((branch) => (
                  <div key={branch} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-400" />
                      <span className="font-mono text-sm">{branch}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => switchBranch(branch)}
                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded transition"
                      >
                        Switch
                      </button>
                      {branch !== 'main' && branch !== 'master' && (
                        <button
                          onClick={() => deleteBranch(branch)}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="p-4 space-y-4">
            {/* Create Tag */}
            <div className="bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-semibold mb-2">Create New Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="v1.0.0"
                  className="flex-1 bg-gray-900 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createTag}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags List */}
            <div className="space-y-2">
              {tags.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No tags</div>
              ) : (
                tags.map((tag) => (
                  <div key={tag} className="bg-gray-800 rounded-lg p-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-yellow-400" />
                    <span className="font-mono text-sm">{tag}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Stash Tab */}
        {activeTab === 'stash' && (
          <div className="p-4">
            {stashes ? (
              <div className="bg-gray-800 rounded-lg p-4">
                <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
                  {stashes || 'No stashes'}
                </pre>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No stashes</div>
            )}
          </div>
        )}
      </div>

      {/* Diff Viewer */}
      {diffView && (
        <div className="border-t border-gray-700 bg-gray-800 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Diff for {selectedCommit?.substring(0, 7)}</span>
            <button
              onClick={() => setDiffView(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <pre className="text-xs text-gray-300 overflow-x-auto bg-gray-900 p-3 rounded max-h-40 font-mono">
            {diffView}
          </pre>
        </div>
      )}
    </div>
  );
}
