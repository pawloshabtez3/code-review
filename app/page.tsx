import { CodeReviewForm } from "@/components/CodeReviewForm";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-14">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          AI Code Review Assistant
        </p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Professional AI reviews for your codebase
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Submit a code snippet and get structured feedback on bugs, performance,
          security, and clean code improvements.
        </p>
      </header>

      <CodeReviewForm />
    </main>
  );
}
