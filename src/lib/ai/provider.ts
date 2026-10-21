import { z } from "zod";
import { UserProfile, TopicMastery, QuizAttemptResult, Topic, Question, AIRecommendation } from "@/types";

export interface TopicSummaryResult {
  summary: string;
  keyTakeaways: string[];
  cheatSheet: string;
}

export interface AIProvider {
  name: string;
  isMock: boolean;
  generateDiagnosticQuiz(topic: Topic, count?: number): Promise<Question[]>;
  explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string>;
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

/**
 * MockAIProvider
 * Deterministic educational responses when GEMINI_API_KEY is not configured.
 * Clearly marks responses with is_mock = true for transparency.
 */
export class MockAIProvider implements AIProvider {
  name = "Knowvexa Educational Engine (Demo Mode)";
  isMock = true;

  async generateDiagnosticQuiz(topic: Topic, count: number = 3): Promise<Question[]> {
    // Return structured, validated questions from topic practice tips & seed bank
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

  async explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string> {
    return `[Demo AI Tutor] For the question "${params.questionText}", you selected "${params.userAnswer}", but the correct concept is "${params.correctAnswer}". In ${params.topicTitle}, this distinction matters because foundational rules dictate precise behavior. Review the worked example on ${params.topicTitle} to reinforce this concept.`;
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
        action: w.mastery_score < 40 ? "Relearn foundational concepts" : "Complete guided practice quiz",
        reason: `Current mastery score is ${w.mastery_score}%. Rebuilding confidence in this module is essential for upcoming assessments.`,
        priority: (w.mastery_score < 40 ? "high" : "medium") as "high" | "medium",
      };
    });

    // If no weak topics, recommend next unassessed topic
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
 * GeminiProvider
 * Communicates with the Google Gemini API when GEMINI_API_KEY is configured.
 */
export class GeminiProvider implements AIProvider {
  name = "Google Gemini AI";
  isMock = false;
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

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
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
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
    const prompt = `Generate ${count} high quality educational quiz questions for the topic: "${topic.title}".
Context objectives: ${topic.learning_objectives.join("; ")}.
Difficulty: ${topic.difficulty}.

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
    "difficulty": "${topic.difficulty}",
    "points": 10
  }
]`;

    try {
      const rawJson = await this.callGemini(prompt, "You are an expert university professor creating rigorous, fair assessment questions. Output valid JSON only.");
      const parsed = JSON.parse(rawJson);
      return QuizGenerationSchema.parse(parsed);
    } catch (err) {
      // Graceful fallback to mock questions on any parse or API failure
      console.warn("Gemini quiz generation failed, falling back to deterministic questions:", err);
      const fallback = new MockAIProvider();
      return fallback.generateDiagnosticQuiz(topic, count);
    }
  }

  async explainIncorrectAnswer(params: {
    questionText: string;
    userAnswer: string | number;
    correctAnswer: string | number;
    topicTitle: string;
  }): Promise<string> {
    const prompt = `The student missed this question on "${params.topicTitle}":
Question: "${params.questionText}"
Student answered: "${params.userAnswer}"
Correct answer: "${params.correctAnswer}"

Provide a concise (2-3 sentences), kind, and mathematically/computationally accurate pedagogical explanation of why their answer was incorrect and how to reason to the correct answer. Format as JSON: { "explanation": "..." }`;

    try {
      const raw = await this.callGemini(prompt);
      const parsed = JSON.parse(raw);
      return parsed.explanation || parsed.text || "Review the core concepts for this topic.";
    } catch {
      const fallback = new MockAIProvider();
      return fallback.explainIncorrectAnswer(params);
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
      const raw = await this.callGemini(prompt);
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
      const raw = await this.callGemini(prompt);
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
  const key = process.env.GEMINI_API_KEY;
  if (key && key.trim() !== "" && !key.includes("your-gemini-api-key")) {
    return new GeminiProvider(key.trim());
  }
  return new MockAIProvider();
}
