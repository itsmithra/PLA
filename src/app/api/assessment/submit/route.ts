import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { repository } from "@/lib/storage";

const SubmissionSchema = z.object({
  attempt_id: z.string().optional(),
  assessment_id: z.string(),
  topic_id: z.string(),
  answers: z.record(z.union([z.string(), z.number()])),
  time_spent_seconds: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SubmissionSchema.parse(body);

    const result = await repository.submitQuizAttempt(validated);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid submission schema", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Failed to process quiz submission" }, { status: 500 });
  }
}
