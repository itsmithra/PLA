import { z } from "zod";
import { UserProfile, TopicMastery, QuizAttemptResult, Topic, Question, AIRecommendation } from "@/types";

export interface TopicSummaryResult {
  summary: string;
  keyTakeaways: string[];
  cheatSheet: string;
}

export interface CognitiveDiagnosis {
  misconception_type: string;
  root_cause_analysis: string;
  mental_model_fix: string;
  memory_anchor: string;
  immediate_challenge: string;
}

export interface SocraticTurnResult {
  reply: string;
  pedagogical_goal: string;
  guiding_question: string;
}

export interface AIProvider {
  name: string;
  isMock: boolean;
  generateDiagnosticQuiz(topic: Topic, count?: number): Promise<Question[]>;
  generateAdaptiveQuiz(topic: Topic, masteryScore: number, count?: number): Promise<Question[]>;
  explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string>;
  diagnoseCognitiveMisconception(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<CognitiveDiagnosis>;
  conductSocraticDialogue(params: {
    topic: Topic;
    userMessage: string;
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
    studentMasteryScore: number;
  }): Promise<SocraticTurnResult>;
  generateStudyRecommendations(params: {
    profile: UserProfile;
    masteryList: TopicMastery[];
    recentAttempts: QuizAttemptResult[];
    topics: Topic[];
  }): Promise<AIRecommendation>;
  generateTopicSummary(topic: Topic): Promise<TopicSummaryResult>;
}

// Zod schemas for AI validation
export const QuizGenerationSchema = z.array(
  z.object({
    id: z.string(),
    topic_id: z.string(),
    question_text: z.string().min(5),
    question_type: z.enum(["mcq", "true_false", "short_answer"]),
    options: z.array(z.string()).optional(),
    correct_answer: z.union([z.string(), z.number()]),
    explanation: z.string().min(10),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    points: z.number().int().positive(),
  })
);

export const RecommendationSchema = z.object({
  summary: z.string().min(10),
  strengths: z.array(z.string()),
  knowledge_gaps: z.array(z.string()),
  recommended_actions: z.array(
    z.object({
      topic_id: z.string(),
      topic_title: z.string(),
      action: z.string(),
      reason: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    })
  ),
  motivational_insight: z.string(),
});

export const CognitiveDiagnosisSchema = z.object({
  misconception_type: z.string().min(3),
  root_cause_analysis: z.string().min(10),
  mental_model_fix: z.string().min(10),
  memory_anchor: z.string().min(5),
  immediate_challenge: z.string().min(5),
});

export const SocraticTurnSchema = z.object({
  reply: z.string().min(10),
  pedagogical_goal: z.string().min(5),
  guiding_question: z.string().min(5),
});

const MASTER_PEDAGOGICAL_SYSTEM_PROMPT = `You are the Knowvexa Cognitive Intelligence Engine — an elite pedagogical mind operating at the apex of cognitive learning theory.
Your mind incorporates:
1. Bloom's Revised Taxonomy (Remember -> Understand -> Apply -> Analyze -> Evaluate -> Create).
2. Vygotsky's Zone of Proximal Development (ZPD): Calibrate responses strictly one step beyond the student's current mastery band.
3. Socratic Inquiry: Guide the learner toward epiphany through targeted questions, concrete counter-examples, and physical/computational intuition rather than spoon-feeding raw answers.
4. Metacognitive Error Analysis: When diagnosing mistakes, isolate the structural flaw in their mental model (e.g., shallow abstraction leakage, off-by-one boundary failure, reference-vs-value aliasing).
5. Output strict, valid JSON when instructed.`;

/**
 * MockAIProvider
 * Deterministic educational responses when cloud AI is not configured.
 * Clearly marks responses with is_mock = true for transparency.
 */
export class MockAIProvider implements AIProvider {
  name = "Knowvexa Cognitive Engine (Demo Mode)";
  isMock = true;

  async generateDiagnosticQuiz(topic: Topic, count: number = 3): Promise<Question[]> {
    return [
      {
        id: `mock_q_${topic.id}_1`,
        topic_id: topic.id,
        question_text: `In ${topic.title}, what is the primary consideration when evaluating: ${topic.learning_objectives[0] || "core principles"}?`,
        question_type: "mcq" as const,
        options: [
          "Understanding foundational rules and edge cases",
          "Ignoring runtime complexity",
          "Applying random heuristics without validation",
          "Bypassing architectural isolation"
        ],
        correct_answer: "Understanding foundational rules and edge cases",
        explanation: `Educational explanation: Mastering ${topic.title} requires grounded knowledge of edge cases and foundational principles.`,
        difficulty: topic.difficulty,
        points: 10,
      },
      {
        id: `mock_q_${topic.id}_2`,
        topic_id: topic.id,
        question_text: `Regarding ${topic.title}: Is the statement "${topic.common_mistakes[0] || "Best practices apply uniformly"}" considered a recommended approach?`,
        question_type: "true_false" as const,
        options: ["True", "False"],
        correct_answer: "False",
        explanation: `This is a known pitfall in ${topic.title}: ${topic.common_mistakes[0] || "Careful verification is required."}`,
        difficulty: "intermediate" as const,
        points: 15,
      },
    ].slice(0, count);
  }

  async generateAdaptiveQuiz(topic: Topic, masteryScore: number, count: number = 3): Promise<Question[]> {
    const diff = masteryScore < 45 ? "beginner" : masteryScore < 75 ? "intermediate" : "advanced";
    const questions = await this.generateDiagnosticQuiz(topic, count);
    return questions.map((q) => ({ ...q, difficulty: diff }));
  }

  async explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string> {
    return `[Cognitive Tutor] For the question "${params.questionText}", you selected "${params.userAnswer}", but the correct concept is "${params.correctAnswer}". In ${params.topicTitle}, this distinction matters because foundational rules dictate precise behavior. Review the worked example on ${params.topicTitle} to reinforce this concept.`;
  }

  async diagnoseCognitiveMisconception(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<CognitiveDiagnosis> {
    return {
      misconception_type: "Surface-Level Pattern Matching",
      root_cause_analysis: `You selected "${params.userAnswer}" because it superficially resembles a valid outcome in related problems, overlooking the strict semantic constraint that dictates "${params.correctAnswer}".`,
      mental_model_fix: `Anchor your reasoning in first principles: In ${params.topicTitle}, evaluate step-by-step state transformation before guessing final returns.`,
      memory_anchor: `Rule of Thumb: "${params.correctAnswer}" guarantees state invariants under edge boundary transitions.`,
      immediate_challenge: `If inputs are inverted or scaled by zero, what invariant holds true in ${params.topicTitle}?`,
    };
  }

  async conductSocraticDialogue(params: {
    topic: Topic;
    userMessage: string;
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
    studentMasteryScore: number;
  }): Promise<SocraticTurnResult> {
    return {
      reply: `Let's investigate this from first principles. When considering "${params.userMessage}" in the context of ${params.topic.title}, notice how state transitions depend directly on ${params.topic.learning_objectives[0] || "core invariants"}.`,
      pedagogical_goal: "Activate metacognitive self-explanation of boundary conditions",
      guiding_question: `What would happen to your system state if the boundary condition in ${params.topic.title} were triggered at runtime?`,
    };
  }

  async generateStudyRecommendations(params: {
    profile: UserProfile;
    masteryList: TopicMastery[];
    recentAttempts: QuizAttemptResult[];
    topics: Topic[];
  }): Promise<AIRecommendation> {
    const weakMastery = params.masteryList.filter((m) => m.mastery_score < 60);
    const strongMastery = params.masteryList.filter((m) => m.mastery_score >= 80);

    const weakTopicNames = weakMastery.map((w) => {
      const t = params.topics.find((top) => top.id === w.topic_id);
      return t ? t.title : w.topic_id;
    });

    const strongTopicNames = strongMastery.map((s) => {
      const t = params.topics.find((top) => top.id === s.topic_id);
      return t ? t.title : s.topic_id;
    });

    const actions = weakMastery.slice(0, 3).map((w) => {
      const t = params.topics.find((top) => top.id === w.topic_id);
      return {
        topic_id: w.topic_id,
        topic_title: t ? t.title : w.topic_id,
        action: w.mastery_score < 40 ? "Rebuild foundational mental model" : "Targeted diagnostic gap-closure quiz",
        reason: `Current mastery score is ${w.mastery_score}%. Rebuilding confidence in this module is essential for upcoming assessments.`,
        priority: (w.mastery_score < 40 ? "high" : "medium") as "high" | "medium",
      };
    });

    if (actions.length === 0 && params.topics.length > 0) {
      const firstTopic = params.topics[0];
      actions.push({
        topic_id: firstTopic.id,
        topic_title: firstTopic.title,
        action: "Take diagnostic assessment",
        reason: "Establish your baseline knowledge for this subject.",
        priority: "medium",
      });
    }

    return {
      summary: `Based on your recent learning data in ${params.profile.course_track || "your curriculum"}, you are making steady progress towards your goal: "${params.profile.target_goal}".`,
      strengths: strongTopicNames.length > 0 ? strongTopicNames : ["Active engagement and disciplined study cadence"],
      knowledge_gaps: weakTopicNames.length > 0 ? weakTopicNames : ["Take diagnostic quizzes to pinpoint specific gaps."],
      recommended_actions: actions,
      motivational_insight: `Consistent daily study of ${params.profile.daily_minutes} minutes yields 3.2x greater retention than weekend cramming. Keep up the momentum!`,
      is_mock: true,
      generated_at: new Date().toISOString(),
    };
  }

  async generateTopicSummary(topic: Topic): Promise<TopicSummaryResult> {
    return {
      summary: `${topic.title} is a critical component of ${topic.subject_id}. It covers ${topic.learning_objectives.join(", ")}.`,
      keyTakeaways: [
        `Core concept: ${topic.learning_objectives[0] || "Fundamental understanding"}`,
        `Avoid common error: ${topic.common_mistakes[0] || "Careless assumptions"}`,
        `Practical application: Test with worked examples regularly`,
      ],
      cheatSheet: `# ${topic.title} Cheatsheet\n\n- **Difficulty**: ${topic.difficulty}\n- **Objectives**:\n${topic.learning_objectives.map((o) => `  * ${o}`).join("\n")}\n\n## Key Rule\n${topic.concept_explanation.substring(0, 200)}...`,
    };
  }
}

/**
 * GroqProvider
 * High-speed cognitive inference via Groq LPU (Qwen 27B / GPT-OSS 120B).
 */
export class GroqProvider implements AIProvider {
  name = "Knowvexa Cognitive Engine (Groq LPU Acceleration)";
  isMock = false;
  private apiKey: string;
  private model: string;
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey: string, model: string = "qwen/qwen3.8-27b") {
    this.apiKey = apiKey.replace(/^["']|["']$/g, "").trim();
    this.model = process.env.GROQ_MODEL || model;
  }

  private async callGroq(
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    jsonMode = true
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.2,
          max_tokens: 1500,
          response_format: jsonMode ? { type: "json_object" } : undefined,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Groq API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from Groq API");
      return content;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async generateDiagnosticQuiz(topic: Topic, count: number = 3): Promise<Question[]> {
    return this.generateAdaptiveQuiz(topic, 50, count);
  }

  async generateAdaptiveQuiz(topic: Topic, masteryScore: number, count: number = 3): Promise<Question[]> {
    const bloomLevel = masteryScore < 45 ? "Understand & Apply" : masteryScore < 75 ? "Analyze & Relate" : "Evaluate & Synthesize Edge Cases";
    const prompt = `Generate ${count} university-level assessment questions for topic "${topic.title}".
Mastery Context: Student is at ${masteryScore}% mastery. Target Bloom Level: ${bloomLevel}.
Objectives: ${topic.learning_objectives.join("; ")}.
Common Misconceptions to exploit in distractors: ${topic.common_mistakes.join("; ")}.

Each question MUST have 4 plausible, educational options. The distractors must reflect genuine cognitive misconceptions.

Return JSON:
{
  "questions": [
    {
      "id": "groq_q_1",
      "topic_id": "${topic.id}",
      "question_text": "Precise scenario or computational problem",
      "question_type": "mcq",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Exact matching string from options",
      "explanation": "Pedagogical explanation dissecting both the correct choice and why distractors fail",
      "difficulty": "${masteryScore < 45 ? "beginner" : masteryScore < 75 ? "intermediate" : "advanced"}",
      "points": 10
    }
  ]
}`;

    try {
      const rawJson = await this.callGroq([
        { role: "system", content: MASTER_PEDAGOGICAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);
      const parsed = JSON.parse(rawJson);
      const list = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
      return QuizGenerationSchema.parse(list);
    } catch (err) {
      console.warn("Groq quiz generation failed, falling back to deterministic questions:", err);
      const fallback = new MockAIProvider();
      return fallback.generateAdaptiveQuiz(topic, masteryScore, count);
    }
  }

  async explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string> {
    const diagnosis = await this.diagnoseCognitiveMisconception(params);
    return `${diagnosis.root_cause_analysis} ${diagnosis.mental_model_fix} Remember: ${diagnosis.memory_anchor}`;
  }

  async diagnoseCognitiveMisconception(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<CognitiveDiagnosis> {
    const prompt = `Student made an error in ${params.topicTitle}:
Question: "${params.questionText}"
Student answered: "${params.userAnswer}"
Correct answer: "${params.correctAnswer}"

Diagnose the cognitive breakdown in their mental model.
Return JSON matching:
{
  "misconception_type": "Brief classification (e.g. Boundary Off-by-One, Reference vs Value Aliasing)",
  "root_cause_analysis": "Deep explanation of the cognitive slip",
  "mental_model_fix": "Concrete, first-principles logic to correct their mental model",
  "memory_anchor": "Short, vivid mnemonic or conceptual anchor to prevent future recurrence",
  "immediate_challenge": "A 1-sentence micro-question to test immediate understanding"
}`;

    try {
      const raw = await this.callGroq([
        { role: "system", content: MASTER_PEDAGOGICAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);
      const parsed = JSON.parse(raw);
      return CognitiveDiagnosisSchema.parse(parsed);
    } catch (err) {
      const fallback = new MockAIProvider();
      return fallback.diagnoseCognitiveMisconception(params);
    }
  }

  async conductSocraticDialogue(params: {
    topic: Topic;
    userMessage: string;
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
    studentMasteryScore: number;
  }): Promise<SocraticTurnResult> {
    const historyFormatted = params.conversationHistory
      .slice(-6)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = `The student is studying "${params.topic.title}" (Current Mastery: ${params.studentMasteryScore}%).
Conversation History:
${historyFormatted}

Student just asked/said: "${params.userMessage}"

Apply the Socratic Method:
1. Do NOT immediately hand over the final answer.
2. Acknowledge their perspective kindly.
3. Offer an intuitive mental model or a provocative counter-example.
4. Conclude with a targeted guiding question that pulls them toward the insight.

Return JSON:
{
  "reply": "Empathetic Socratic response (2-3 paragraphs max)",
  "pedagogical_goal": "Cognitive objective of this exchange",
  "guiding_question": "The specific inquiry guiding their next reasoning step"
}`;

    try {
      const raw = await this.callGroq([
        { role: "system", content: MASTER_PEDAGOGICAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);
      const parsed = JSON.parse(raw);
      return SocraticTurnSchema.parse(parsed);
    } catch (err) {
      const fallback = new MockAIProvider();
      return fallback.conductSocraticDialogue(params);
    }
  }

  async generateStudyRecommendations(params: {
    profile: UserProfile;
    masteryList: TopicMastery[];
    recentAttempts: QuizAttemptResult[];
    topics: Topic[];
  }): Promise<AIRecommendation> {
    const prompt = `Analyze student learning progress:
Goal: ${params.profile.target_goal}
Track: ${params.profile.course_track}
Available daily study minutes: ${params.profile.daily_minutes}
Mastery records: ${JSON.stringify(
      params.masteryList.map((m) => ({
        topic: m.topic_id,
        score: m.mastery_score,
        band: m.band,
      }))
    )}

Return JSON matching:
{
  "summary": "High level strategic summary grounded in cognitive mastery",
  "strengths": ["Strong domain skills"],
  "knowledge_gaps": ["Critical prerequisite weaknesses"],
  "recommended_actions": [
    {
      "topic_id": "topic-id",
      "topic_title": "Topic Title",
      "action": "Specific pedagogical activity",
      "reason": "Why this closes an essential cognitive gap",
      "priority": "high"
    }
  ],
  "motivational_insight": "Science-backed study cadence reinforcement"
}`;

    try {
      const raw = await this.callGroq([
        { role: "system", content: MASTER_PEDAGOGICAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);
      const parsed = JSON.parse(raw);
      const validated = RecommendationSchema.parse(parsed);
      return {
        ...validated,
        is_mock: false,
        generated_at: new Date().toISOString(),
      };
    } catch {
      const fallback = new MockAIProvider();
      return fallback.generateStudyRecommendations(params);
    }
  }

  async generateTopicSummary(topic: Topic): Promise<TopicSummaryResult> {
    const prompt = `Create an executive revision summary for topic "${topic.title}".
Objectives: ${topic.learning_objectives.join(", ")}.

Return JSON:
{
  "summary": "Dense, intuitive executive overview (2-3 sentences)",
  "keyTakeaways": ["3 distinct conceptual pillars"],
  "cheatSheet": "# Markdown cheatsheet with syntax or formula"
}`;

    try {
      const raw = await this.callGroq([
        { role: "system", content: MASTER_PEDAGOGICAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ]);
      const parsed = JSON.parse(raw);
      return {
        summary: parsed.summary,
        keyTakeaways: parsed.keyTakeaways || [],
        cheatSheet: parsed.cheatSheet || "",
      };
    } catch {
      const fallback = new MockAIProvider();
      return fallback.generateTopicSummary(topic);
    }
  }
}

/**
 * GeminiProvider
 * Communicates with the Google Gemini API when GEMINI_API_KEY is configured.
 */
export class GeminiProvider implements AIProvider {
  name = "Knowvexa Cognitive Engine (Gemini 1.5 Flash)";
  isMock = false;
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 14000);

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: { parts: [{ text: systemInstruction || MASTER_PEDAGOGICAL_SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
            responseMimeType: "application/json",
          },
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Gemini API error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from Gemini API");
      return text;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async generateDiagnosticQuiz(topic: Topic, count: number = 3): Promise<Question[]> {
    return this.generateAdaptiveQuiz(topic, 50, count);
  }

  async generateAdaptiveQuiz(topic: Topic, masteryScore: number, count: number = 3): Promise<Question[]> {
    const prompt = `Generate ${count} high quality educational quiz questions for the topic: "${topic.title}".
Context objectives: ${topic.learning_objectives.join("; ")}.
Difficulty: ${masteryScore < 45 ? "beginner" : masteryScore < 75 ? "intermediate" : "advanced"}.

Format as JSON array with schema:
[
  {
    "id": "gemini_q_1",
    "topic_id": "${topic.id}",
    "question_text": "...",
    "question_type": "mcq",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "Exact matching string from options",
    "explanation": "...",
    "difficulty": "${masteryScore < 45 ? "beginner" : masteryScore < 75 ? "intermediate" : "advanced"}",
    "points": 10
  }
]`;

    try {
      const rawJson = await this.callGemini(prompt, MASTER_PEDAGOGICAL_SYSTEM_PROMPT);
      const parsed = JSON.parse(rawJson);
      return QuizGenerationSchema.parse(parsed);
    } catch (err) {
      console.warn("Gemini quiz generation failed, falling back to deterministic questions:", err);
      const fallback = new MockAIProvider();
      return fallback.generateAdaptiveQuiz(topic, masteryScore, count);
    }
  }

  async explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string> {
    const diagnosis = await this.diagnoseCognitiveMisconception(params);
    return `${diagnosis.root_cause_analysis} ${diagnosis.mental_model_fix} Remember: ${diagnosis.memory_anchor}`;
  }

  async diagnoseCognitiveMisconception(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<CognitiveDiagnosis> {
    const prompt = `Student missed question on "${params.topicTitle}":
Question: "${params.questionText}"
User Answer: "${params.userAnswer}"
Correct Answer: "${params.correctAnswer}"

Diagnose the cognitive breakdown in their mental model. Return JSON:
{
  "misconception_type": "...",
  "root_cause_analysis": "...",
  "mental_model_fix": "...",
  "memory_anchor": "...",
  "immediate_challenge": "..."
}`;

    try {
      const raw = await this.callGemini(prompt, MASTER_PEDAGOGICAL_SYSTEM_PROMPT);
      const parsed = JSON.parse(raw);
      return CognitiveDiagnosisSchema.parse(parsed);
    } catch {
      const fallback = new MockAIProvider();
      return fallback.diagnoseCognitiveMisconception(params);
    }
  }

  async conductSocraticDialogue(params: {
    topic: Topic;
    userMessage: string;
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
    studentMasteryScore: number;
  }): Promise<SocraticTurnResult> {
    const prompt = `Topic: "${params.topic.title}" (Mastery: ${params.studentMasteryScore}%).
Student inquiry: "${params.userMessage}"

Engage with Socratic method. Return JSON:
{
  "reply": "Empathetic Socratic response",
  "pedagogical_goal": "Cognitive objective",
  "guiding_question": "Next guided question"
}`;

    try {
      const raw = await this.callGemini(prompt, MASTER_PEDAGOGICAL_SYSTEM_PROMPT);
      const parsed = JSON.parse(raw);
      return SocraticTurnSchema.parse(parsed);
    } catch {
      const fallback = new MockAIProvider();
      return fallback.conductSocraticDialogue(params);
    }
  }

  async generateStudyRecommendations(params: {
    profile: UserProfile;
    masteryList: TopicMastery[];
    recentAttempts: QuizAttemptResult[];
    topics: Topic[];
  }): Promise<AIRecommendation> {
    const prompt = `Analyze student learning progress:
Goal: ${params.profile.target_goal}
Track: ${params.profile.course_track}
Available daily study minutes: ${params.profile.daily_minutes}
Mastery records: ${JSON.stringify(
      params.masteryList.map((m) => ({
        topic: m.topic_id,
        score: m.mastery_score,
        band: m.band,
      }))
    )}

Return JSON matching:
{
  "summary": "...",
  "strengths": ["..."],
  "knowledge_gaps": ["..."],
  "recommended_actions": [
    {
      "topic_id": "...",
      "topic_title": "...",
      "action": "...",
      "reason": "...",
      "priority": "high"
    }
  ],
  "motivational_insight": "..."
}`;

    try {
      const raw = await this.callGemini(prompt, MASTER_PEDAGOGICAL_SYSTEM_PROMPT);
      const parsed = JSON.parse(raw);
      const validated = RecommendationSchema.parse(parsed);
      return {
        ...validated,
        is_mock: false,
        generated_at: new Date().toISOString(),
      };
    } catch {
      const fallback = new MockAIProvider();
      return fallback.generateStudyRecommendations(params);
    }
  }

  async generateTopicSummary(topic: Topic): Promise<TopicSummaryResult> {
    const prompt = `Create an executive revision summary for topic "${topic.title}".
Objectives: ${topic.learning_objectives.join(", ")}.

Return JSON:
{
  "summary": "...",
  "keyTakeaways": ["point 1", "point 2", "point 3"],
  "cheatSheet": "# Markdown cheatsheet with syntax or formula"
}`;

    try {
      const raw = await this.callGemini(prompt, MASTER_PEDAGOGICAL_SYSTEM_PROMPT);
      const parsed = JSON.parse(raw);
      return {
        summary: parsed.summary,
        keyTakeaways: parsed.keyTakeaways || [],
        cheatSheet: parsed.cheatSheet || "",
      };
    } catch {
      const fallback = new MockAIProvider();
      return fallback.generateTopicSummary(topic);
    }
  }
}

/**
 * Factory function to retrieve the active AI provider
 */
export function getAIProvider(): AIProvider {
  const groqKey = process.env.GROQ_API || process.env.GROQ_API_KEY;
  if (groqKey && groqKey.trim() !== "" && !groqKey.includes("your-groq-api-key")) {
    return new GroqProvider(groqKey.trim());
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== "" && !geminiKey.includes("your-gemini-api-key")) {
    return new GeminiProvider(geminiKey.trim());
  }

  return new MockAIProvider();
}
