# SkillBridge AI

> AI-powered career guidance and skill gap analysis platform.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

---

## Overview

SkillBridge AI helps students:

1. **Upload resumes** — PDF or DOCX.
2. **AI-extract skills** — powered by Google Gemini.
3. **Identify skill gaps** — against desired occupations.
4. **Discover training** — verified PMKVY courses and training centres.
5. **Generate career roadmaps** — personalised, actionable plans.

---

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Frontend     | Next.js · React · TypeScript · Tailwind · Shadcn  |
| Backend      | Express.js · TypeScript · Mongoose                |
| Database     | MongoDB Atlas                                     |
| AI           | Google Gemini API · RAG · Embeddings              |
| Auth         | Clerk                                             |
| DevOps       | Vercel · Render · GitHub Actions                  |

---

## Repository Structure

```
skillbridge-ai/
├── client/                 # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   │   ├── ui/             # Shadcn UI primitives
│   │   ├── layout/         # Layout components (navbar, footer, hero)
│   │   └── shared/         # Shared components (api-status, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (cn, etc.)
│   ├── services/           # API client
│   ├── types/              # TypeScript type definitions
│   └── public/             # Static assets
│
├── server/                 # Express.js backend
│   └── src/
│       ├── config/         # DB & environment configuration
│       ├── controllers/    # Route controllers
│       ├── middleware/      # Error handling, auth, rate limiting
│       ├── models/         # Mongoose models
│       ├── routes/         # API routes
│       ├── services/       # Business logic & AI services
│       ├── utils/          # Helper utilities
│       ├── validators/     # Zod validation schemas
│       ├── types/          # TypeScript type definitions
│       ├── app.ts          # Express app setup
│       └── server.ts       # Server entry point
│
├── docs/                   # Documentation
├── dataset/                # Data files
├── .github/workflows/      # CI/CD pipelines
├── .gitignore
├── package.json            # Root workspace scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **MongoDB Atlas** account (optional for Phase 1)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd skillbridge-ai

# 2. Install root dependencies
npm install

# 3. Install frontend dependencies
cd client && npm install && cd ..

# 4. Install backend dependencies
cd server && npm install && cd ..
```

### Environment Configuration

Create the following environment files:

**`server/.env`** (copy from `server/.env.example`):

```env
MONGODB_URI=
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**`client/.env.local`** (copy from `client/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

> **Note:** Leave `MONGODB_URI` empty to run in database-disconnected mode.

### Development Commands

```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only
npm run dev:client

# Run backend only
npm run dev:server

# Build frontend
npm run build:client

# Build backend
npm run build:server

# Lint frontend
npm run lint
```

### Verification

After running `npm run dev`:

| Check                    | Expected Result                           |
| ------------------------ | ----------------------------------------- |
| Frontend                 | http://localhost:3000 — landing page loads |
| Backend health           | http://localhost:5001/api/health — JSON    |
| Frontend ↔ Backend       | Status card shows "connected"             |
| TypeScript               | No compilation errors                     |

---

## Development Phases

| Phase | Description                                | Status     |
| ----- | ------------------------------------------ | ---------- |
| 1     | Project foundation & architecture          | ✅ Complete |
| 2     | UI/UX & frontend development               | ⬜ Pending  |
| 3     | Authentication & user management           | ⬜ Pending  |
| 4     | Resume upload & AI parsing                 | ⬜ Pending  |
| 5     | Occupation & skills database               | ⬜ Pending  |
| 6     | Skill gap analysis engine                  | ⬜ Pending  |
| 7     | PMKVY course & training-centre integration | ⬜ Pending  |
| 8     | AI recommendation engine & career roadmap  | ⬜ Pending  |
| 9     | Semantic search & RAG career assistant     | ⬜ Pending  |
| 10    | Progress tracking & advanced features      | ⬜ Pending  |
| 11    | Admin panel, testing & security            | ⬜ Pending  |
| 12    | Deployment, CI/CD & documentation          | ⬜ Pending  |

---

## License

ISC
