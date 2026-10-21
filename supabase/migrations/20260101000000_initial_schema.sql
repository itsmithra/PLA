-- ============================================================================
-- KNOWVEXA AI — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    education_level TEXT DEFAULT 'Undergraduate',
    course_track TEXT DEFAULT 'Computer Science & AI',
    selected_subjects JSONB DEFAULT '[]'::jsonb,
    target_exam_date DATE,
    target_goal TEXT DEFAULT 'Master Core Foundations',
    daily_minutes INTEGER DEFAULT 45 CHECK (daily_minutes >= 10 AND daily_minutes <= 480),
    preferred_format TEXT DEFAULT 'interactive',
    confidence_levels JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_hours INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    order_index INTEGER NOT NULL DEFAULT 1,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    concept_explanation TEXT NOT NULL,
    worked_example JSONB DEFAULT '{}'::jsonb,
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    practice_questions JSONB DEFAULT '[]'::jsonb,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (subject_id, slug)
);

-- 4. TOPIC PREREQUISITES GRAPH
CREATE TABLE IF NOT EXISTS public.topic_prerequisites (
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    prerequisite_topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, prerequisite_topic_id)
);

-- 5. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'documentation', 'cheatsheet', 'interactive')),
    author TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time_limit_minutes INTEGER NOT NULL DEFAULT 15,
    passing_score INTEGER NOT NULL DEFAULT 70,
    is_diagnostic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUESTIONS TABLE
-- Security Note: correct_answer is stored here and only accessed on server evaluation.
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    assessment_id TEXT REFERENCES public.assessments(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short_answer')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZ RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    explanation TEXT NOT NULL
);

-- 10. TOPIC MASTERY TABLE
CREATE TABLE IF NOT EXISTS public.topic_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    mastery_score INTEGER NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
    evidence_count INTEGER NOT NULL DEFAULT 0,
    band TEXT NOT NULL CHECK (band IN ('unseen', 'relearn', 'review', 'practice', 'mastered')),
    recommendation TEXT NOT NULL,
    last_assessed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, topic_id)
);

-- 11. STUDY PLANS TABLE
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_minutes_limit INTEGER NOT NULL DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id TEXT PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('learn', 'quiz', 'revision', 'practice')),
    estimated_minutes INTEGER NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'postponed')),
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SAVED RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, resource_id)
);

-- ============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_topics_subject ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON public.questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_topic ON public.quiz_attempts(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_user ON public.topic_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_topic ON public.topic_mastery(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_plan ON public.study_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON public.study_sessions(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

-- 1. Shared Catalog Read Policies (Subjects, Topics, Prerequisites, Resources, Assessments)
CREATE POLICY "Public read for subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read for topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public read for prerequisites" ON public.topic_prerequisites FOR SELECT USING (true);
CREATE POLICY "Public read for resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public read for assessments" ON public.assessments FOR SELECT USING (true);

-- 2. Questions Security: Read question text and options only (Server handles scoring with service role or secured function)
CREATE POLICY "Authenticated read questions" ON public.questions FOR SELECT TO authenticated USING (true);

-- 3. Profiles Policies: User owns their profile record
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Quiz Attempts & Responses Policies: Strict owner access
CREATE POLICY "Users view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own quiz responses" ON public.quiz_responses FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()));
CREATE POLICY "Users insert own quiz responses" ON public.quiz_responses FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()));

-- 5. Topic Mastery Policies
CREATE POLICY "Users view own topic mastery" ON public.topic_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert/update own topic mastery" ON public.topic_mastery FOR ALL USING (auth.uid() = user_id);

-- 6. Study Plans & Tasks Policies
CREATE POLICY "Users view own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own study plans" ON public.study_plans FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own study tasks" ON public.study_tasks FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.study_plans p WHERE p.id = plan_id AND p.user_id = auth.uid()));
CREATE POLICY "Users manage own study tasks" ON public.study_tasks FOR ALL
    USING (EXISTS (SELECT 1 FROM public.study_plans p WHERE p.id = plan_id AND p.user_id = auth.uid()));

-- 7. Study Sessions & Saved Resources
CREATE POLICY "Users manage own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved resources" ON public.saved_resources FOR ALL USING (auth.uid() = user_id);
