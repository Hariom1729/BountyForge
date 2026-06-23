# BountyForge 🛠️🌌

An AI-powered GitHub Bounty Marketplace connecting Open Source Maintainers and Contributors, built with Next.js 16, Prisma, Tailwind CSS, BullMQ, and Three.js.

BountyForge features an enterprise-grade, hardware-accelerated 3D wave backdrop and role-isolated workspaces modeled after Linear, Vercel, and Stripe.

---

## 🚀 Key Architectural Features

### 1. Hard-Boundary Role Separation
- **Strict Separation of Flows**: Decatur routes into parallel route groups:
  - `(dashboards)/maintainer/*` - Workspace for repository owners.
  - `(dashboards)/contributor/*` - Dashboard for developers working on active claims.
  - `(dashboards)/guest/*` - Read-only sandbox allowing full previews.
  - `(dashboards)/admin/*` - Admin controls.
- **Edge-first RBAC Middleware**: Strict role validation on JWT signatures before hitting the database, with real-time sync to handle role transitions instantly.

### 2. Redesigned Maintainer Workspace
A comprehensive, all-in-one console supporting 12 workspace pages:
1. **Dashboard Overview**: Financial statistics, active developer counts, and activity feeds.
2. **Repository Management**: Import repositories from GitHub, sync branches, and audit codebase Health/Risk metrics.
3. **Issue Management**: Dual-pane board displaying open GitHub issues alongside AI-derived reward recommendations and difficulty scores.
4. **Bounty Management**: Full bounty lifecycle tracking (Open, Claimed, In Progress, Review Pending, Completed, Cancelled).
5. **Contributor Management**: Detailed profile audits of developer reputation, success rates, speed, and trust scores.
6. **AI Review Queue**: Side-by-side git diff view panel showing automated PR evaluations (quality, performance, vulnerability scanner, and copy-paste plagiarism audits).
7. **Payment Center**: Stripe-like ledger showing platforms fees and deposit history.
8. **Escrow Ledger**: Lockup smart contract wallet showing locked/released funds.
9. **Organization Workspace**: Invite members and configure reviewer privileges.
10. **Analytics Center**: Interactive SVG-rendered dashboards highlighting completion speed curves and ROI stats.
11. **AI Assistant Copilot**: Interactive terminal to generate summaries, inspect code blocks, and write reports.
12. **Security Center**: Plagiarism logs and Sybil-attack detectors.

### 3. Redesigned Contributor Workspace
- Replicates the maintainer layout with active navigation items (Dashboard, Explore Bounties, Leaderboard, Jobs Marketplace, Career Copilot, Settings).
- Beautiful layout displaying reputation points, claims status, and PR indicators.

### 4. Dotted Surface Animation
- Integrated interactive, real-time 3D particle landscape wave simulated using Three.js WebGL and hardware acceleration.
- Renders as a smooth background in both layouts to elevate the modern SaaS feel.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Database ORM**: Prisma with PostgreSQL
- **Styling**: Tailwind CSS & Radix primitives
- **Auth**: NextAuth with custom REST session hooks
- **Queues & Async Jobs**: BullMQ with Redis
- **3D Graphics**: Three.js WebGL
- **AI Integrations**: OpenAI GPT API models

---

## ⚙️ Getting Started

### 1. Configure Environments
Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgresql://user:pass@host:port/dbname"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secret"
GITHUB_ID="github-id"
GITHUB_SECRET="github-secret"
OPENAI_API_KEY="openai-key"
```

### 2. Run Database Migrations
```bash
npx prisma db push
npx prisma generate
```

### 3. Start Development Servers
Start both the dev server and the background workers:
```bash
# Run web client
npm run dev

# Run background workers
npm run worker
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
