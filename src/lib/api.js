// API client utility for making authenticated requests

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class APIClient {
  constructor() {
    this.baseURL = API_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Funnels
  async getFunnels() {
    return this.request('/api/funnels');
  }

  async getFunnel(id) {
    return this.request(`/api/funnels/${id}`);
  }

  async createFunnel(data) {
    return this.request('/api/funnels', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateFunnel(id, data) {
    return this.request(`/api/funnels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteFunnel(id) {
    return this.request(`/api/funnels/${id}`, {
      method: 'DELETE'
    });
  }

  // Pages
  async getPages() {
    return this.request('/api/pages');
  }

  async getPage(id) {
    return this.request(`/api/pages/${id}`);
  }

  async createPage(data) {
    return this.request('/api/pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updatePage(id, data) {
    return this.request(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deletePage(id) {
    return this.request(`/api/pages/${id}`, {
      method: 'DELETE'
    });
  }

  // Products
  async getProducts() {
    return this.request('/api/products');
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(data) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProduct(id, data) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async getOrders() {
    return this.request('/api/orders');
  }

  async getOrder(id) {
    return this.request(`/api/orders/${id}`);
  }

  // Email Campaigns
  async getCampaigns() {
    return this.request('/api/campaigns');
  }

  async getCampaign(id) {
    return this.request(`/api/campaigns/${id}`);
  }

  async createCampaign(data) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCampaign(id, data) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteCampaign(id) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'DELETE'
    });
  }

  // Subscribers
  async getSubscribers() {
    return this.request('/api/subscribers');
  }

  async getSubscriber(id) {
    return this.request(`/api/subscribers/${id}`);
  }

  async createSubscriber(data) {
    return this.request('/api/subscribers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateSubscriber(id, data) {
    return this.request(`/api/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteSubscriber(id) {
    return this.request(`/api/subscribers/${id}`, {
      method: 'DELETE'
    });
  }

  // Workflows
  async getWorkflows() {
    return this.request('/api/workflows');
  }

  async getWorkflow(id) {
    return this.request(`/api/workflows/${id}`);
  }

  async createWorkflow(data) {
    return this.request('/api/workflows', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateWorkflow(id, data) {
    return this.request(`/api/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteWorkflow(id) {
    return this.request(`/api/workflows/${id}`, {
      method: 'DELETE'
    });
  }

  // Contacts
  async getContacts() {
    return this.request('/api/contacts');
  }

  async getContact(id) {
    return this.request(`/api/contacts/${id}`);
  }

  async createContact(data) {
    return this.request('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateContact(id, data) {
    return this.request(`/api/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteContact(id) {
    return this.request(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
  }

  // Deals
  async getDeals() {
    return this.request('/api/deals');
  }

  async getDeal(id) {
    return this.request(`/api/deals/${id}`);
  }

  async createDeal(data) {
    return this.request('/api/deals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateDeal(id, data) {
    return this.request(`/api/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteDeal(id) {
    return this.request(`/api/deals/${id}`, {
      method: 'DELETE'
    });
  }

  // Analytics
  async getConversions() {
    return this.request('/api/conversions');
  }

  async getAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/analytics${query ? `?${query}` : ''}`);
  }

  // Stripe
  async createCheckoutSession(tier) {
    return this.request('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier })
    });
  }

  async getSubscription() {
    return this.request('/api/stripe/subscription');
  }

  async cancelSubscription() {
    return this.request('/api/stripe/cancel', {
      method: 'POST'
    });
  }

  async updateSubscription(tier) {
    return this.request('/api/stripe/update', {
      method: 'POST',
      body: JSON.stringify({ tier })
    });
  }

  async createPortalSession() {
    return this.request('/api/stripe/portal', {
      method: 'POST'
    });
  }

  // Tickets
  async getTickets() { return this.request('/api/tickets') }
  async getTicket(id) { return this.request(`/api/tickets/${id}`) }
  async createTicket(data) { return this.request('/api/tickets', { method: 'POST', body: JSON.stringify(data) }) }
  async updateTicket(id, data) { return this.request(`/api/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  async deleteTicket(id) { return this.request(`/api/tickets/${id}`, { method: 'DELETE' }) }

  // Courses
  async getCourses() { return this.request('/api/courses') }
  async getCourse(id) { return this.request(`/api/courses/${id}`) }
  async createCourse(data) { return this.request('/api/courses', { method: 'POST', body: JSON.stringify(data) }) }
  async updateCourse(id, data) { return this.request(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  async deleteCourse(id) { return this.request(`/api/courses/${id}`, { method: 'DELETE' }) }

  // Blog
  async getBlogPosts() { return this.request('/api/blog') }
  async getBlogPost(id) { return this.request(`/api/blog/${id}`) }
  async createBlogPost(data) { return this.request('/api/blog', { method: 'POST', body: JSON.stringify(data) }) }
  async updateBlogPost(id, data) { return this.request(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  async deleteBlogPost(id) { return this.request(`/api/blog/${id}`, { method: 'DELETE' }) }

  // Affiliates
  async getAffiliates() { return this.request('/api/affiliates') }
  async createAffiliate(data) { return this.request('/api/affiliates', { method: 'POST', body: JSON.stringify(data) }) }

  // API Keys
  async getApiKeys() { return this.request('/api/api-keys') }
  async createApiKey(data) { return this.request('/api/api-keys', { method: 'POST', body: JSON.stringify(data) }) }
  async deleteApiKey(id) { return this.request(`/api/api-keys/${id}`, { method: 'DELETE' }) }

  // Admin
  async getAdminUsers() { return this.request('/api/admin/users') }
  async updateUserRole(userId, role) { return this.request(`/api/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }) }
  async impersonateUser(userId) { return this.request(`/api/admin/impersonate/${userId}`, { method: 'POST' }) }
  async getUserModules(userId) { return this.request(`/api/admin/users/${userId}/modules`) }
  async updateUserModules(userId, modules) { return this.request(`/api/admin/users/${userId}/modules`, { method: 'PUT', body: JSON.stringify({ modules }) }) }

  // Invoices
  async getInvoices() { return this.request('/api/invoices') }

  // Settings
  async getSettings() { return this.request('/api/settings') }
  async updateSettings(data) { return this.request('/api/settings', { method: 'PUT', body: JSON.stringify(data) }) }
  async updateProfile(data) { return this.request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }) }

  // Generic CRUD helper
  async get(endpoint) { return this.request(endpoint) }
  async post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }) }
  async put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }) }
  async del(endpoint) { return this.request(endpoint, { method: 'DELETE' }) }
}

export const api = new APIClient();
export default api;
