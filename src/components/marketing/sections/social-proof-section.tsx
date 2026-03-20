const labels = ["Teams", "Startups", "Agencies", "Indie", "Enterprise"];

export function SocialProofSection() {
  return (
    <section className="border-y border-border/60 bg-muted/25 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Built for shipping real products
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {labels.map((name) => (
            <div
              key={name}
              className="flex h-14 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-border hover:text-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
