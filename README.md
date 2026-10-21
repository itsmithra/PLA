# Knowvexa AI — Adaptive Personalized Learning Platform

> **Tagline:** Learn smarter. Grow faster.

Knowvexa AI is a production-minded, AI-powered personalized learning platform that dynamically adapts to each student's knowledge, weaknesses, study schedule, and topic mastery. Built specifically for college students preparing for internal assessments, university semester exams, and technical career tracks in programming, databases, mathematics, and data science.

---

## 1. Architectural Highlights

- **Next.js 14 App Router & TypeScript:** Strict type-safety across components, server routes, middleware, and data transfer objects.
- **Ultra-Fast AI Engine (`GroqProvider` & `GeminiProvider`):** 
  - **Groq LPU Acceleration:** Sub-second inference powered by Groq OpenAI-compatible API (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`), providing real-time quiz generation, pedagogical explanations, and study recommendations.
  - **Google Gemini 1.5 Flash Integration:** Multi-token structured JSON generation with system prompt grounding.
  - **Deterministic Rule Fallback (`MockAIProvider`):** Automatic graceful offline demo mode if API keys are absent or rate-limited.
- **Deterministic Topic Mastery Engine:** 0–100 scale calculation using an adaptive evidence-weighting formula ($\alpha = \max(0.20, \frac{1}{\sqrt{k+1}})$), difficulty multipliers, and temporal decay heuristic.
- **Topological Study Planner:** Schedules daily learning blocks that respect prerequisite relationships, exam countdowns, weak topic prioritization, and daily time constraints without cognitive overload.
- **Supabase Architecture & Row Level Security (RLS):** Complete schema migrations, indexes, and strict multi-tenant data ownership policies (`auth.uid() = user_id`) with `@supabase/ssr` session synchronization middleware.
- **Server-Scored Quiz Engine:** Correct answers are evaluated on the server and omitted from client payloads to eliminate devtools inspection vulnerabilities.
- **Vercel Production Ready:** `vercel.json` configured with Next.js framework, automatic build, region specification, and serverless timeout allowances (`maxDuration: 30`) for AI workloads.
- **Vitest Test Suite:** 23 automated unit and security tests covering mastery calculations, scheduler topological ordering, answer security, AI provider schema enforcement, and repository operations.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components, Route Handlers, Edge Middleware) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with semantic educational palette |
| **Icons & UI** | Lucide React, glassmorphism badges, cards, interactive progress bars |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) & `@supabase/ssr` |
| **AI Acceleration** | Groq LPU (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`) + Google Gemini 1.5 Flash |
| **Validation** | Zod input and output schema enforcement |
| **Deployment** | Vercel (`vercel.json` with Next.js optimization & extended timeouts) |
| **Testing** | Vitest with fast in-memory execution (100% test pass rate) |

---

## 3. AI Capabilities & Endpoints

Knowvexa AI features a modular, pluggable AI provider architecture (`src/lib/ai/provider.ts`):

```
┌────────────────────────────────────────────────────────┐
│                   getAIProvider()                      │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         ▼                 ▼                  ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────┐
│  GroqProvider   │ │ GeminiProvider│ │  MockAIProvider   │
│ (Groq LPU Fast) │ │ (Gemini 1.5)  │ │ (Deterministic)   │
└─────────────────┘ └───────────────┘ └───────────────────┘
```

### 1. Available Endpoints

- **`GET /api/ai/status`**: Returns the active AI provider, model status, and supported capabilities.
- **`POST /api/ai/quiz`**: Dynamically generates tailored diagnostic assessments with multiple-choice questions, distractors, and pedagogical rationales.
  ```json
  { "topicId": "py-control-flow", "count": 3 }
  ```
- **`POST /api/ai/explain`**: Generates context-aware, Socratic explanations for missed questions without simply reciting the answer key.
  ```json
  {
    "questionText": "What is the runtime complexity of hash table lookup in Python?",
    "userAnswer": "O(N)",
    "correctAnswer": "O(1) average",
    "topicTitle": "Python Data Structures"
  }
  ```
- **`GET /api/ai/recommend`**: Synthesizes a student's weak mastery areas, recent quiz attempts, and exam timeline into prioritized study actions.
- **`POST /api/ai/summary`**: Generates quick-revision summaries, core takeaways, and Markdown cheat sheets for any curriculum topic.

---

## 4. Directory Structure

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
│   │   ├── supabase-test/page.tsx           # Live Supabase connection test page
│   │   ├── api/
│   │   │   ├── assessment/submit/route.ts   # Server-side assessment scoring
│   │   │   ├── ai/status/route.ts           # Active AI engine & provider status
│   │   │   ├── ai/quiz/route.ts             # Dynamic AI quiz question generator
│   │   │   ├── ai/recommend/route.ts        # AI study recommendations
│   │   │   ├── ai/explain/route.ts          # AI incorrect answer explanation
│   │   │   └── ai/summary/route.ts          # Topic cheat sheet & summary
│   │   ├── globals.css                      # Design tokens & glassmorphism
│   │   └── layout.tsx                       # Root layout with responsive navbar
│   ├── components/                          # UI primitives, navbar, sidebar, footer
│   ├── data/seed-data.ts                    # Pre-seeded curriculum for 4 domains
│   ├── lib/
│   │   ├── mastery/engine.ts                # Deterministic mastery calculation
│   │   ├── planner/scheduler.ts             # Topological study plan generator
│   │   ├── ai/provider.ts                   # Groq, Gemini and Mock AI providers
│   │   └── storage/index.ts                 # Dual Supabase & browser repository
│   ├── utils/supabase/                      # SSR, Client, and Middleware helpers
│   ├── middleware.ts                        # Edge auth session refreshing
│   └── types/index.ts                       # Complete TypeScript interfaces
├── supabase/
│   ├── migrations/20260101000000_initial_schema.sql # PostgreSQL schema & RLS policies
│   └── seed.sql                             # Database seed script
├── .env.example                             # Environment configuration template
├── vercel.json                              # Vercel deployment configuration
├── vitest.config.ts                         # Test runner configuration
└── tailwind.config.ts                       # UI theme tokens
```

---

## 5. Setup & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### Installation
```bash
# Clone the repository
git clone https://github.com/itsmithra/PLA.git
cd PLA

# Install dependencies
npm install
```

### Demonstration Mode (Zero Cloud Configuration)
Knowvexa AI operates out of the box with zero external configuration:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Click **"Sign In"** -> **"One-Click Demo Student Sign In"** to inspect pre-populated student analytics (Alex Rivera) with real quiz attempts, mastery scores, and scheduled tasks.
- Or click **"Start Free Diagnostic"** -> **"Register"** to experience the 3-step onboarding flow.

---

## 6. Environment Variables Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

```ini
# -------------------------------------------------------------
# Supabase Configuration
# -------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# -------------------------------------------------------------
# AI Providers (Groq LPU or Google Gemini)
# -------------------------------------------------------------
GROQ_API=your-groq-api-key-here
# Optional model override (defaults to qwen/qwen3.8-27b or openai/gpt-oss-120b)
GROQ_MODEL=qwen/qwen3.8-27b

# Google Gemini API (Alternative AI Provider)
GEMINI_API_KEY=your-gemini-api-key-here

# -------------------------------------------------------------
# Application Configuration
# -------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=false
```

---

## 7. Supabase Database Migration & RLS Setup

When connecting to a live Supabase instance:
1. Navigate to your Supabase project's **SQL Editor**.
2. Run the migration script in `supabase/migrations/20260101000000_initial_schema.sql`.
   - Creates all 14 domain tables (`profiles`, `subjects`, `topics`, `topic_prerequisites`, `resources`, `assessments`, `questions`, `quiz_attempts`, `quiz_responses`, `topic_mastery`, `study_plans`, `study_tasks`, `study_sessions`, `saved_resources`).
   - Enables Row Level Security on every table.
   - Applies strict `auth.uid() = user_id` ownership policies.
3. Run `supabase/seed.sql` to populate the initial university subjects and topics.

---

## 8. Vercel Deployment

This project is fully configured for zero-friction deployment to Vercel:

1. Import repository `https://github.com/itsmithra/PLA` into your Vercel Dashboard.
2. Select Framework Preset: **Next.js**.
3. In **Project Settings -> Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `GROQ_API` (or `GROQ_API_KEY` / `GEMINI_API_KEY`)
4. Click **Deploy**. Vercel will automatically run `npm run build` using the rules defined in `vercel.json`.

---

## 9. Automated Test Suite

Run unit and security tests using Vitest:
```bash
npm test
```

### Test Coverage Highlights (23 Tests Passing)
- `engine.test.ts` (8 tests): Baseline establishment, mastery bands, weighted evidence update rule, advanced question bonus, and temporal forgetting decay.
- `scheduler.test.ts` (3 tests): Weak topic prioritization, topological prerequisite sequencing, and daily minute constraints.
- `provider.test.ts` (5 tests): Zod schema validation for AI questions and study recommendations, plus automatic GroqProvider selection.
- `repository.test.ts` (4 tests): Client question sanitization, quiz scoring, and mastery score updates.
- `security.test.ts` (3 tests): Absence of answer leakage, prevention of client score tampering, and deterministic 0–100 score clamping.
