# TechyPark Engine - Deployment Guide

## Production Deployment

The platform is deployed to Vercel at: **https://techypark-engine.vercel.app**

### Custom Domains

Configure these domains in Vercel:
- **Frontend**: app.mosiur.com
- **Backend API**: crm.mosiur.com

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
STRIPE_LIVE_KEY=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
STRIPE_PRICE_STARTER=price_1T35ynJ5HFy0vPwt7bnndUuX
STRIPE_PRICE_PROFESSIONAL=price_1T35yoJ5HFy0vPwtYPnTzPTS
STRIPE_PRICE_PREMIUM_PRO=price_1T35ypJ5HFy0vPwtJmIdmvSg
VITE_API_URL=https://crm.mosiur.com
VITE_APP_URL=https://app.mosiur.com
```

### Stripe Webhook Configuration

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://crm.mosiur.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Super Admin Setup

After first deployment, create the super admin account:

```bash
npm run setup:admin
```

This creates: **mosiur@beverlyhillspublishing.com** as Admin

### Database

**Current**: SQLite (file-based, resets on deployment)
**Recommended for Production**: Migrate to Vercel Postgres or external PostgreSQL

#### To upgrade to Vercel Postgres:

1. Create database in Vercel Dashboard → Storage → Create Database → Postgres
2. Link to project
3. Update `server/database.js` to use `POSTGRES_URL` environment variable
4. Run migrations

### Pricing Tiers

- **Starter**: $97/month
- **Professional**: $997/month  
- **Premium Pro**: $4,997/month
- **Trial**: 14 days free (all tiers)

### Features

- 53 functional modules (Infrastructure + ClickFunnels features)
- Stripe payment integration with trials
- Super admin dashboard
- Module management per user
- User impersonation
- Role-based access control

### Support

For issues or questions: mosiur@beverlyhillspublishing.com
