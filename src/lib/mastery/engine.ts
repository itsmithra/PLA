import { MasteryBand, DifficultyLevel, TopicMastery } from "@/types";

export interface MasteryUpdateInput {
  currentMastery?: {
    mastery_score: number;
    evidence_count: number;
    last_assessed_at: string;
  } | null;
  attemptPercentage: number; // 0 - 100
  questionDifficulties?: DifficultyLevel[];
  timestamp?: string;
}

export interface MasteryCalculationResult {
  previousScore: number;
  newScore: number;
  evidenceCount: number;
  band: MasteryBand;
  recommendation: string;
  explanation: string;
}

/**
 * Determine mastery band based on 0-100 score:
 * - 0–39: Relearn fundamentals.
 * - 40–59: Review concepts and solve guided exercises.
 * - 60–79: Practice with additional questions.
 * - 80–100: Attempt advanced questions or spaced revision.
 */
export function getMasteryBand(score: number): MasteryBand {
  if (score < 40) return "relearn";
  if (score < 60) return "review";
  if (score < 80) return "practice";
  return "mastered";
}

export function getBandRecommendation(band: MasteryBand): string {
  switch (band) {
    case "relearn":
      return "Relearn fundamentals: Review core concepts and worked examples before re-attempting.";
    case "review":
      return "Review concepts and solve guided exercises with step-by-step hints.";
    case "practice":
      return "Practice with additional questions to strengthen speed and recall.";
    case "mastered":
      return "Attempt advanced challenges or schedule spaced revision in 7 days.";
    default:
      return "Begin diagnostic assessment to establish baseline.";
  }
}

/**
 * Deterministic, testable mastery calculation.
 *
 * Mathematical Model:
 * 1. Base Score S in [0, 100].
 * 2. Difficulty weight W:
 *    - beginner: 1.0
 *    - intermediate: 1.15
 *    - advanced: 1.30
 * 3. Evidence-based dynamic weight alpha:
 *    alpha = max(0.20, 1 / sqrt(k + 1))
 *    Ensures early quizzes adapt rapidly to establish baseline,
 *    while subsequent attempts require consistent evidence to shift mastery.
 * 4. Temporal Decay (Ebbinghaus forgetting heuristic):
 *    If > 14 days since last assessment, decay prior mastery slightly toward 50.
 * 5. Update Rule:
 *    M_new = round(clamp((1 - alpha) * M_prior + alpha * S_adjusted, 0, 100))
 */
export function calculateMasteryUpdate(input: MasteryUpdateInput): MasteryCalculationResult {
  const now = input.timestamp ? new Date(input.timestamp) : new Date();
  const current = input.currentMastery;

  // If no prior evidence exists, baseline is established directly by the first attempt
  if (!current || current.evidence_count === 0) {
    const rawScore = Math.max(0, Math.min(100, Math.round(input.attemptPercentage)));
    const band = getMasteryBand(rawScore);
    return {
      previousScore: 0,
      newScore: rawScore,
      evidenceCount: 1,
      band,
      recommendation: getBandRecommendation(band),
      explanation: `Initial baseline assessment established from quiz score of ${rawScore}%.`,
    };
  }

  const prevScore = current.mastery_score;
  const k = current.evidence_count;

  // Step 1: Calculate temporal decay if days have elapsed
  let effectivePrior = prevScore;
  if (current.last_assessed_at) {
    const lastDate = new Date(current.last_assessed_at);
    const daysSince = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 14) {
      // Gentle decay of up to 5 points toward neutral 50 over prolonged inactivity
      const decayRate = Math.min(0.1, (daysSince - 14) * 0.005);
      effectivePrior = Math.round(prevScore * (1 - decayRate) + 50 * decayRate);
    }
  }

  // Step 2: Difficulty adjustment
  let difficultyMultiplier = 1.0;
  if (input.questionDifficulties && input.questionDifficulties.length > 0) {
    const sum = input.questionDifficulties.reduce((acc, d) => {
      if (d === "advanced") return acc + 1.25;
      if (d === "intermediate") return acc + 1.1;
      return acc + 1.0;
    }, 0);
    difficultyMultiplier = sum / input.questionDifficulties.length;
  }

  // If student scored high on hard questions, reward slightly;
  // If student failed beginner questions, slight penalty
  let adjustedScore = input.attemptPercentage;
  if (input.attemptPercentage >= 70 && difficultyMultiplier > 1.0) {
    adjustedScore = Math.min(100, input.attemptPercentage * (1 + (difficultyMultiplier - 1.0) * 0.4));
  } else if (input.attemptPercentage < 50 && difficultyMultiplier === 1.0) {
    adjustedScore = Math.max(0, input.attemptPercentage * 0.95);
  }

  // Step 3: Adaptive learning rate alpha
  // At k=1: alpha = 1 / sqrt(2) ≈ 0.707
  // At k=3: alpha = 1 / sqrt(4) = 0.50
  // At k=8: alpha = 1 / sqrt(9) = 0.333
  // Min alpha is capped at 0.20
  const alpha = Math.max(0.20, 1.0 / Math.sqrt(k + 1));

  // Step 4: Weighted calculation
  const weighted = (1 - alpha) * effectivePrior + alpha * adjustedScore;
  const newScore = Math.max(0, Math.min(100, Math.round(weighted)));
  const newCount = k + 1;
  const band = getMasteryBand(newScore);

  let explanation = "";
  if (newScore > prevScore) {
    explanation = `Mastery increased by +${newScore - prevScore} (from ${prevScore} to ${newScore}) based on ${Math.round(input.attemptPercentage)}% quiz score with evidence sample #${newCount}.`;
  } else if (newScore < prevScore) {
    explanation = `Mastery updated from ${prevScore} to ${newScore} reflecting knowledge retention and quiz performance.`;
  } else {
    explanation = `Mastery confirmed at ${newScore}% with consistent evidence.`;
  }

  return {
    previousScore: prevScore,
    newScore,
    evidenceCount: newCount,
    band,
    recommendation: getBandRecommendation(band),
    explanation,
  };
}
