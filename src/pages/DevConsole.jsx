import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function DevConsole() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat'); // chat, feature, sql, debug, files
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const messagesEndRef = useRef(null);

  // Check if user is super admin
  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (mode === 'files') {
      loadFiles();
    }
  }, [mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadFiles = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await axios.get(`${API_URL}/api/dev/files`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const loadFile = async (filePath) => {
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await axios.get(`${API_URL}/api/dev/file`, {
        params: { path: filePath },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedFile(filePath);
      setFileContent(response.data.content);
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const saveFile = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      await axios.post(
        `${API_URL}/api/dev/file`,
        { path: selectedFile, content: fileContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('File saved successfully!');
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('sessionToken');
      let endpoint = '/api/dev/chat';
      let payload = { message: input };

      if (mode === 'feature') {
        endpoint = '/api/dev/generate-feature';
        payload = { featureRequest: input };
      } else if (mode === 'sql') {
        endpoint = '/api/dev/generate-sql';
        payload = { request: input };
      } else if (mode === 'debug') {
        endpoint = '/api/dev/debug-code';
        payload = { code: input, error: 'Debug this code' };
      } else {
        payload.conversationHistory = messages;
      }

      const response = await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.content || response.data.error || 'No response'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error: ' + (error.response?.data?.error || error.message) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">🔧 Super Admin Dev Console</h1>
            <p className="text-sm text-gray-400 mt-1">AI-Powered Development Environment</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setMode('chat')}
            className={`px-4 py-2 rounded-lg transition ${
              mode === 'chat' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setMode('feature')}
            className={`px-4 py-2 rounded-lg transition ${
              mode === 'feature' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            ⚡ Generate Feature
          </button>
          <button
            onClick={() => setMode('sql')}
            className={`px-4 py-2 rounded-lg transition ${
              mode === 'sql' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            🗄️ SQL Generator
          </button>
          <button
            onClick={() => setMode('debug')}
            className={`px-4 py-2 rounded-lg transition ${
              mode === 'debug' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            🐛 Debug Code
          </button>
          <button
            onClick={() => setMode('files')}
            className={`px-4 py-2 rounded-lg transition ${
              mode === 'files' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            📁 Files
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)]">
        {mode === 'files' ? (
          // File Browser Mode
          <div className="flex w-full">
            {/* File List */}
            <div className="w-1/3 bg-gray-800 border-r border-gray-700 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Project Files</h3>
                <div className="space-y-1">
                  {files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => loadFile(file.path)}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition ${
                        selectedFile === file.path ? 'bg-gray-700' : ''
                      }`}
                    >
                      <div className="text-sm text-gray-300">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.path}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* File Editor */}
            <div className="flex-1 flex flex-col">
              {selectedFile ? (
                <>
                  <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-sm text-gray-300">{selectedFile}</span>
                    <button
                      onClick={saveFile}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a file to edit
                </div>
              )}
            </div>
          </div>
        ) : (
          // Chat Mode
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-xl mb-4">👋 Welcome to the Dev Console</p>
                  <p className="text-sm">
                    {mode === 'chat' && 'Ask me anything about development, code, or features.'}
                    {mode === 'feature' && 'Describe a feature you want to build.'}
                    {mode === 'sql' && 'Describe the data you want to query.'}
                    {mode === 'debug' && 'Paste code that needs debugging.'}
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {msg.role === 'user' ? 'You' : '🤖 Manus AI'}
                    </div>
                    <div className="whitespace-pre-wrap prose prose-invert max-w-none">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    mode === 'chat'
                      ? 'Ask me anything...'
                      : mode === 'feature'
                      ? 'Describe the feature you want to build...'
                      : mode === 'sql'
                      ? 'Describe what data you need...'
                      : 'Paste code to debug...'
                  }
                  className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition"
                  >
                    Send
                  </button>
                  <button
                    onClick={clearChat}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
