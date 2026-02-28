import { NextResponse } from "next/server";
import { ReviewRequestSchema } from "@/lib/validators/review";
import {
  AiReviewResponseSchema,
  type AiReviewResponse
} from "@/lib/validators/aiResponse";
import { generateCodeReviewWithGemini } from "@/lib/ai/gemini";
import { getSupabaseClient } from "@/lib/db/client";

const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const max = Number(process.env.RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const now = Date.now();

  const timestamps = rateLimitStore.get(ip) ?? [];
  const withinWindow = timestamps.filter((timestamp) => now - timestamp < windowMs);
  withinWindow.push(now);
  rateLimitStore.set(ip, withinWindow);

  return withinWindow.length > max;
}

function buildPrompt(code: string, language: string) {
  const system =
    "You are a senior software engineer performing a professional code review. " +
    "Analyze the submitted code for logical bugs, performance issues, security vulnerabilities, " +
    "and clean code violations. Return structured JSON only in this exact format:\n" +
    "{\n" +
    "  summary: string,\n" +
    "  bugs: string[],\n" +
    "  performance: string[],\n" +
    "  security: string[],\n" +
    "  improvements: string[]\n" +
    "}\n" +
    "Do not include explanations outside JSON.";

  const user = `Language: ${language}\n\nCode:\n${code}`;

  return { system, user };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again soon." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = ReviewRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { code, language } = parsed.data;
  const { system, user } = buildPrompt(code, language);

  let content = "";
  try {
    content = await generateCodeReviewWithGemini({ system, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach AI service." },
      { status: 502 }
    );
  }

  let json: AiReviewResponse;
  try {
    json = AiReviewResponseSchema.parse(JSON.parse(content));
  } catch (error) {
    return NextResponse.json(
      { error: "AI response was not in the expected format." },
      { status: 500 }
    );
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("reviews").insert({
      language,
      code,
      ai_response: json
    });
  }

  return NextResponse.json(json, { status: 200 });
}
