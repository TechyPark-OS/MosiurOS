# API Integration Guide for TechyPark Engine

This guide explains how to connect page components to the real backend API.

## Pattern Overview

All pages should follow this pattern:

```jsx
import { useState, useEffect } from 'react'
import api from '../lib/api'

export default function MyPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getMyData()
      setData(Array.isArray(result) ? result : result.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      // Fallback to demo data
      setData(DEMO_DATA)
    } finally {
      setLoading(false)
    }
  }

  const create = async (newItem) => {
    try {
      const result = await api.createMyData(newItem)
      setData([...data, result])
    } catch (err) {
      console.error('Error creating:', err)
      alert('Failed to create item')
    }
  }

  const update = async (id, updates) => {
    try {
      await api.updateMyData(id, updates)
      setData(data.map(item => item.id === id ? { ...item, ...updates } : item))
    } catch (err) {
      console.error('Error updating:', err)
      alert('Failed to update item')
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.deleteMyData(id)
      setData(data.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting:', err)
      alert('Failed to delete item')
    }
  }

  if (loading) return <LoadingSpinner />
  if (error && data.length === 0) return <ErrorMessage error={error} />

  return (
    // Your component JSX
  )
}
```

## Available API Methods

The `api` object (from `src/lib/api.js`) provides these methods:

### Funnels
- `api.getFunnels()` - Get all funnels
- `api.getFunnel(id)` - Get single funnel
- `api.createFunnel(data)` - Create funnel
- `api.updateFunnel(id, data)` - Update funnel
- `api.deleteFunnel(id)` - Delete funnel

### Pages
- `api.getPages()` - Get all pages
- `api.getPage(id)` - Get single page
- `api.createPage(data)` - Create page
- `api.updatePage(id, data)` - Update page
- `api.deletePage(id)` - Delete page

### Products
- `api.getProducts()` - Get all products
- `api.getProduct(id)` - Get single product
- `api.createProduct(data)` - Create product
- `api.updateProduct(id, data)` - Update product
- `api.deleteProduct(id)` - Delete product

### Orders
- `api.getOrders()` - Get all orders
- `api.getOrder(id)` - Get single order

### Campaigns
- `api.getCampaigns()` - Get all campaigns
- `api.getCampaign(id)` - Get single campaign
- `api.createCampaign(data)` - Create campaign
- `api.updateCampaign(id, data)` - Update campaign
- `api.deleteCampaign(id)` - Delete campaign

### Subscribers
- `api.getSubscribers()` - Get all subscribers
- `api.getSubscriber(id)` - Get single subscriber
- `api.createSubscriber(data)` - Create subscriber
- `api.updateSubscriber(id, data)` - Update subscriber
- `api.deleteSubscriber(id)` - Delete subscriber

### Workflows
- `api.getWorkflows()` - Get all workflows
- `api.getWorkflow(id)` - Get single workflow
- `api.createWorkflow(data)` - Create workflow
- `api.updateWorkflow(id, data)` - Update workflow
- `api.deleteWorkflow(id)` - Delete workflow

### Contacts
- `api.getContacts()` - Get all contacts
- `api.getContact(id)` - Get single contact
- `api.createContact(data)` - Create contact
- `api.updateContact(id, data)` - Update contact
- `api.deleteContact(id)` - Delete contact

### Deals
- `api.getDeals()` - Get all deals
- `api.getDeal(id)` - Get single deal
- `api.createDeal(data)` - Create deal
- `api.updateDeal(id, data)` - Update deal
- `api.deleteDeal(id)` - Delete deal

### Tickets
- `api.getTickets()` - Get all tickets
- `api.getTicket(id)` - Get single ticket
- `api.createTicket(data)` - Create ticket
- `api.updateTicket(id, data)` - Update ticket
- `api.deleteTicket(id)` - Delete ticket

### Courses
- `api.getCourses()` - Get all courses
- `api.getCourse(id)` - Get single course
- `api.createCourse(data)` - Create course
- `api.updateCourse(id, data)` - Update course
- `api.deleteCourse(id)` - Delete course

### Blog
- `api.getBlogPosts()` - Get all blog posts
- `api.getBlogPost(id)` - Get single blog post
- `api.createBlogPost(data)` - Create blog post
- `api.updateBlogPost(id, data)` - Update blog post
- `api.deleteBlogPost(id)` - Delete blog post

### Analytics
- `api.getConversions()` - Get conversion data
- `api.getAnalytics(params)` - Get analytics data with filters

### Admin
- `api.getAdminUsers()` - Get all users (admin only)
- `api.updateUserRole(userId, role)` - Update user role
- `api.impersonateUser(userId)` - Impersonate user
- `api.getUserModules(userId)` - Get user's module access
- `api.updateUserModules(userId, modules)` - Update user's module access

### Settings
- `api.getSettings()` - Get settings
- `api.updateSettings(data)` - Update settings
- `api.updateProfile(data)` - Update user profile

## Pages That Need API Integration

### High Priority (User-Facing)
- [ ] Funnels.jsx
- [ ] Pages.jsx
- [ ] GlobalProducts.jsx
- [ ] Orders.jsx
- [ ] Campaigns.jsx
- [ ] Subscribers.jsx
- [ ] Workflows.jsx
- [ ] Contacts.jsx
- [ ] Deals.jsx
- [ ] Tickets.jsx
- [ ] Courses.jsx
- [ ] Blog.jsx
- [ ] Analytics.jsx
- [ ] Revenue.jsx

### Medium Priority (Infrastructure)
- [ ] Servers.jsx
- [ ] Sites.jsx
- [ ] DNS.jsx
- [ ] Email.jsx
- [ ] SSL.jsx
- [ ] Containers.jsx
- [ ] Databases.jsx
- [ ] Backups.jsx

### Low Priority (Admin/Settings)
- [x] AdminUsers.jsx (already connected)
- [x] AdminModules.jsx (already connected)
- [x] Settings.jsx (already connected)

## Loading States

Always show a loading spinner while fetching data:

```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}
```

## Error Handling

Show errors gracefully and fallback to demo data:

```jsx
try {
  const result = await api.getData()
  setData(result)
} catch (err) {
  console.error('Error:', err)
  setError(err.message)
  // Fallback to demo data so UI still works
  setData(DEMO_DATA)
}
```

## Next Steps

1. Update each page component to use the API pattern above
2. Test CRUD operations for each module
3. Add proper error messages and loading states
4. Remove hardcoded demo data once API is stable
