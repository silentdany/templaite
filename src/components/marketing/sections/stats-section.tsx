const stats = [
  { label: "Integration points", value: "12+" },
  { label: "Auth strategies", value: "Email + OAuth" },
  { label: "Deploy targets", value: "Vercel-ready" },
  { label: "AI providers", value: "Gateway / OpenAI" },
] as const;

export function StatsSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/70 bg-linear-to-br from-card/90 via-card/50 to-muted/30 p-10 shadow-lg shadow-foreground/5 sm:p-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <p
                className="text-3xl font-semibold tracking-tight tabular-nums [font-family:var(--font-marketing-heading)] sm:text-4xl"
              >
                {value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
