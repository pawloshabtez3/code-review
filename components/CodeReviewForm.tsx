"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReviewRequestSchema,
  SupportedLanguages,
  type ReviewRequestInput
} from "@/lib/validators/review";
import type { ReviewResponse } from "@/types/review";
import { ReviewResults } from "@/components/ReviewResults";
import { LoadingBadge } from "@/components/LoadingBadge";

export function CodeReviewForm() {
  const [response, setResponse] = useState<ReviewResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ReviewRequestInput>({
    resolver: zodResolver(ReviewRequestSchema),
    defaultValues: {
      language: SupportedLanguages[0],
      code: ""
    }
  });

  const onSubmit = async (data: ReviewRequestInput) => {
    setServerError(null);
    setResponse(null);

    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload) {
      setServerError(
        payload?.error ?? "Something went wrong. Please try again."
      );
      return;
    }

    setResponse(payload);
  };

  return (
    <div className="space-y-6">
      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            Language
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            {...register("language")}
          >
            {SupportedLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {errors.language ? (
            <p className="text-xs text-red-600">{errors.language.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            Paste your code
          </label>
          <textarea
            className="min-h-[220px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs"
            placeholder="Drop code here..."
            {...register("code")}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Reviewing..." : "Review code"}
        </button>
        {isSubmitting ? <LoadingBadge label="AI analysis in progress" /> : null}
      </form>

      {serverError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      {response ? <ReviewResults response={response} /> : null}
    </div>
  );
}
