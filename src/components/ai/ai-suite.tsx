const tools = [
  "AI Career Coach",
  "AI University Advisor",
  "AI Scholarship Advisor",
  "AI CV Reviewer",
  "AI Interview Coach",
  "AI Job Matching Engine",
  "AI Skill Gap Analysis",
  "AI Success Predictor",
  "AI Roadmap Generator",
  "AI Relocation Assistant"
];

export function AISuite() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <article key={tool} className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">{tool}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Conversational assistant with context-aware guidance, confidence scoring, and action plans.</p>
        </article>
      ))}
    </div>
  );
}
