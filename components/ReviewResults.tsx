import type { ReviewResponse } from "@/types/review";

const sections: Array<{
  key: keyof ReviewResponse;
  title: string;
}> = [
  { key: "summary", title: "Summary" },
  { key: "bugs", title: "Bugs" },
  { key: "performance", title: "Performance" },
  { key: "security", title: "Security" },
  { key: "improvements", title: "Improvements" }
];

type Props = {
  response: ReviewResponse;
};

export function ReviewResults({ response }: Props) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {sections.map((section) => {
        const value = response[section.key];
        if (section.key === "summary" && typeof value === "string") {
          return (
            <div key={section.key}>
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-slate-700">{value}</p>
            </div>
          );
        }

        if (Array.isArray(value)) {
          return (
            <div key={section.key}>
              <h2 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h2>
              {value.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  No issues found.
                </p>
              ) : (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {value.map((item, index) => (
                    <li key={`${section.key}-${index}`}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
