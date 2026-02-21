# Audit Findings

## Missing Routes in App.jsx (from mapping table)
- /funnels/:id/edit → FunnelBuilder.jsx (MISSING component)
- /pages → Pages.jsx (MISSING component, LandingPages exists)
- /pages/:id/edit → PageBuilder.jsx (MISSING component)
- /products/:id → ProductDetail.jsx (MISSING component, GlobalProducts exists)
- /campaigns → Campaigns.jsx (MISSING, EmailMarketing exists)
- /campaigns/:id/edit → CampaignEditor.jsx (MISSING component)
- /subscribers → Subscribers.jsx (MISSING component)
- /workflows/:id/edit → WorkflowBuilder.jsx (MISSING component)
- /courses/:id/edit → CourseBuilder.jsx (MISSING component)
- /contacts/:id → ContactDetail.jsx (MISSING component)
- /deals → Deals.jsx (MISSING component)
- /tickets → Tickets.jsx (MISSING component)
- /tickets/:id → TicketDetail.jsx (MISSING component)
- /messages → Messages.jsx (MISSING, MessageHub exists)
- /blog/:id/edit → BlogEditor.jsx (MISSING component)
- /invoices → Invoices.jsx (MISSING component)
- /plans → Plans.jsx (MISSING component)
- /revenue → Revenue.jsx (MISSING component)
- /settings/general → General.jsx (MISSING, Settings exists)
- /settings/profile → Profile.jsx (MISSING component)
- /settings/security → Security.jsx (MISSING component)
- /settings/notifications → Notifications.jsx (MISSING component)
- /settings/appearance → Appearance.jsx (MISSING component)
- /settings/api-keys → APIKeys.jsx (MISSING component)
- /admin/users → AdminUsers.jsx (MISSING component)
- /admin/modules → AdminModules.jsx (MISSING component)
- /admin/subscriptions → AdminSubscriptions.jsx (MISSING component)
- /customer-portal → CustomerPortal.jsx (MISSING, CustomerCenter exists)

## Sidebar Issues
- Navigation links use relative paths (e.g., /funnels) but routes are nested under /dashboard
- Need to verify NavLink vs Link usage
- Missing many sub-items from mapping table

## Backend API Issues
- api-routes.js has endpoints but need to verify all mapping table endpoints exist
- No separate route files for individual modules
