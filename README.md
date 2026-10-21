# Knowvexa AI — Adaptive Personalized Learning Platform

> **Tagline:** Learn smarter. Grow faster.

Knowvexa AI is a production-minded, AI-powered personalized learning platform that dynamically adapts to each student's knowledge, weaknesses, study schedule, and topic mastery. Built specifically for college students preparing for internal assessments, university semester exams, and technical career tracks in programming, databases, mathematics, and data science.

---

## 1. Architectural Highlights

- **Next.js 14 App Router & TypeScript:** Strict type-safety across components, server routes, and data transfer objects.
- **Tailwind CSS Design System:** Custom semantic palette tailored for modern educational SaaS (soft neutral surfaces, deep navy text, indigo/purple accents, accessible contrast).
- **Deterministic Topic Mastery Engine:** 0–100 scale calculation using an adaptive evidence-weighting formula ($\alpha = \max(0.20, \frac{1}{\sqrt{k+1}})$), difficulty multipliers, and temporal decay heuristic.
- **Topological Study Planner:** Schedules daily learning blocks that respect prerequisite relationships, exam countdowns, weak topic prioritization, and daily time constraints without cognitive overload.
- **AI Service Abstraction (`AIProvider`):** Dual-mode provider featuring live Google Gemini API (`GeminiProvider`) and a rule-grounded educational fallback (`MockAIProvider`) for offline demo development.
- **Supabase Architecture & Row Level Security (RLS):** Complete schema migrations, indexes, and strict multi-tenant data ownership policies preventing cross-user data access.
- **Server-Scored Quiz Engine:** Correct answers are stored on the server and omitted from client payloads to eliminate devtools inspection vulnerabilities.
- **Vitest Test Suite:** 22 automated tests covering mastery calculations, scheduler topological ordering, answer security, repository operations, and Zod output validation.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with custom theme extensions |
| **Icons & UI** | Lucide React, semantic badges, cards, progress bars |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) |
| **Authentication** | Supabase Auth with session persistence & demo provider |
| **AI Integration** | Google Gemini 1.5 Flash + deterministic mock fallback |
| **Validation** | Zod input and output schema enforcement |
| **Testing** | Vitest with fast in-memory execution |

---

## 3. Directory Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx               # Sign in + 1-click reviewer demo
│   │   │   ├── register/page.tsx            # Student account creation
│   │   │   └── forgot-password/page.tsx     # Recovery workflow
│   │   ├── onboarding/page.tsx              # 3-step profile configuration
│   │   ├── dashboard/page.tsx               # Analytics, today's tasks & AI advice
│   │   ├── subjects/
│   │   │   ├── page.tsx                     # Subject catalog & overall mastery
│   │   │   └── [id]/page.tsx                # Subject syllabus & module list
│   │   ├── learn/[topicId]/page.tsx         # Objectives, worked examples, pitfalls
│   │   ├── assessment/
│   │   │   ├── [id]/page.tsx                # Secure timed quiz interface
│   │   │   └── results/[attemptId]/page.tsx # Detailed score & mastery delta
│   │   ├── study-plan/page.tsx              # Daily planner with reschedule controls
│   │   ├── progress/page.tsx                # Mastery distribution & weekly trends
│   │   ├── resources/page.tsx               # Verified documentation bookmarks
│   │   ├── settings/page.tsx                # Learning preferences & demo reset
│   │   ├── api/
│   │   │   ├── assessment/submit/route.ts   # Server-side assessment scoring
│   │   │   ├── ai/recommend/route.ts        # AI study recommendations
│   │   │   └── ai/explain/route.ts          # AI incorrect answer explanation
│   │   ├── globals.css                      # Design tokens & glassmorphism
│   │   └── layout.tsx                       # Root layout with responsive navbar
│   ├── components/
│   │   ├── ui/                              # Button, Card, Badge, Input, Progress
│   │   ├── navbar.tsx                       # Top navigation with mobile drawer
│   │   ├── sidebar.tsx                      # Student workspace sidebar
│   │   ├── footer.tsx                       # System status and tech stack badges
│   │   └── demo-badge.tsx                   # Transparency indicator
│   ├── data/
│   │   └── seed-data.ts                     # Pre-seeded curriculum for 4 domains
│   ├── lib/
│   │   ├── mastery/
│   │   │   ├── engine.ts                    # Deterministic mastery calculation
│   │   │   └── __tests__/engine.test.ts     # Mastery unit tests
│   │   ├── planner/
│   │   │   ├── scheduler.ts                 # Topological study plan generator
│   │   │   └── __tests__/scheduler.test.ts  # Scheduler unit tests
│   │   ├── ai/
│   │   │   ├── provider.ts                  # Gemini and Mock AI providers
│   │   │   └── __tests__/provider.test.ts   # AI schema validation tests
│   │   ├── storage/
│   │   │   ├── index.ts                     # Repository layer & browser storage
│   │   │   └── __tests__/repository.test.ts # Quiz workflow tests
│   │   └── __tests__/security.test.ts       # Security and answer leakage tests
│   └── types/
│       └── index.ts                         # Complete TypeScript interfaces
├── supabase/
│   ├── migrations/
│   │   └── 20260101000000_initial_schema.sql # PostgreSQL schema & RLS policies
│   └── seed.sql                             # Database seed script
├── .env.example                             # Environment configuration template
├── vitest.config.ts                         # Test runner configuration
└── tailwind.config.ts                       # UI theme tokens
```

---

## 4. Setup & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### Installation
```bash
# Clone or navigate to the project directory
cd c:\Users\ELCOT\Documents\JS_Corp\PLA

# Install dependencies
npm install
```

### Local Demonstration Mode (Zero Setup Required)
Knowvexa AI includes a zero-configuration demonstration mode that activates automatically when cloud credentials are not supplied:
```bash
# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- Click **"Sign In"** -> **"One-Click Demo Student Sign In"** to inspect a pre-populated student profile (Alex Rivera) with real quiz attempts, mastery scores, and scheduled tasks.
- Or click **"Start Free Diagnostic"** -> **"Register"** to experience the 3-step onboarding flow.

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env.local` to enable cloud Supabase and live Gemini AI:
```bash
cp .env.example .env.local
```

```ini
# Supabase Configuration (Optional for demo, required for live multi-tenant cloud)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Gemini Generative AI (Optional, falls back to MockAIProvider if absent)
GEMINI_API_KEY=your-gemini-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 6. Supabase Database Migration & RLS Setup

When connecting to a live Supabase instance:
1. Navigate to your Supabase project's **SQL Editor**.
2. Run the migration script in `supabase/migrations/20260101000000_initial_schema.sql`.
   - Creates all 14 domain tables (`profiles`, `subjects`, `topics`, `topic_prerequisites`, `resources`, `assessments`, `questions`, `quiz_attempts`, `quiz_responses`, `topic_mastery`, `study_plans`, `study_tasks`, `study_sessions`, `saved_resources`).
   - Enables Row Level Security on every table.
   - Applies strict `auth.uid() = user_id` ownership policies.
3. Run `supabase/seed.sql` to populate the initial university subjects and topics.

---

## 7. Automated Test Suite

Run unit and security tests using Vitest:
```bash
npm test
```

### Test Coverage Highlights
- `engine.test.ts`: Verifies initial baseline establishment, 4 mastery bands, weighted evidence update rule, advanced question bonus, and temporal forgetting decay.
- `scheduler.test.ts`: Verifies weak topic prioritization, topological prerequisite sequencing, and strict adherence to daily minute limits.
- `provider.test.ts`: Verifies Zod schema validation for AI questions and study recommendations.
- `repository.test.ts`: Verifies client question sanitization, quiz scoring, and mastery score updates.
- `security.test.ts`: Verifies absence of answer leakage, prevention of client score tampering, and deterministic 0–100 score clamping.

---

## 8. Feature Checklist & Implementation Status

| Feature Requirement | Status | Verification |
|---|---|---|
| Responsive Marketing Landing Page | ✅ Implemented | Verified on mobile, tablet, desktop |
| Supabase Auth & Demo Reviewer Login | ✅ Implemented | Tested credential & 1-click demo entry |
| 3-Step Profile Onboarding | ✅ Implemented | Collects track, subjects, exam date, daily mins |
| 4 Curriculum Tracks (Python, SQL, Stats, DS) | ✅ Implemented | Pre-seeded with worked examples & pitfalls |
| Topic Learning Page with Objectives & Examples | ✅ Implemented | Interactive hints, pitfalls & references |
| Server-Scored Quiz Interface & Timer | ✅ Implemented | Answers withheld until server evaluation |
| Detailed Results with Explanations | ✅ Implemented | Question review, explanations & mastery delta |
| Deterministic Mastery Engine (0–100) | ✅ Implemented | Passed 8 unit tests in `engine.test.ts` |
| Topological Study Planner & Rescheduling | ✅ Implemented | Passed 3 unit tests in `scheduler.test.ts` |
| Gemini API AI Guidance + MockAI Fallback | ✅ Implemented | Passed 4 unit tests in `provider.test.ts` |
| Analytics Dashboard with Real Persisted Metrics | ✅ Implemented | Computed from actual database attempts |
| Saved Resources with Bookmarking Filter | ✅ Implemented | Search, category filtering, save persistence |
| Row Level Security & Migration Scripts | ✅ Implemented | `20260101000000_initial_schema.sql` provided |
| TypeScript Strict Compilation | ✅ Implemented | `tsc --noEmit` exits with 0 errors |
| Next.js Production Build | ✅ Implemented | Successful production compilation |

---

## 9. Known Limitations & Production Notes

1. **Live Gemini Quotas:** If using a free-tier Gemini API key, rate limits may apply during rapid quiz generation. The application automatically intercepts rate-limit errors and falls back to deterministic curriculum questions without breaking the user experience.
2. **Browser Local Storage:** In local demo mode, progress is persisted in browser storage and can be reset at any time via `/settings`. In production, set `NEXT_PUBLIC_DEMO_MODE=false` with your Supabase credentials to persist exclusively to PostgreSQL.
