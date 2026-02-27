// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = {
  // Generic fetch helper
  async fetch(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Funnels
  getFunnels: () => api.fetch('/api/funnels'),
  getFunnel: (id) => api.fetch(`/api/funnels/${id}`),
  createFunnel: (data) => api.fetch('/api/funnels', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateFunnel: (id, data) => api.fetch(`/api/funnels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteFunnel: (id) => api.fetch(`/api/funnels/${id}`, {
    method: 'DELETE',
  }),

  // Add other API methods similarly...
};

export default api;