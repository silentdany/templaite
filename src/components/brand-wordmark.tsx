import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
}

/**
 * Lowercase wordmark: templa + ai (inverted pill) + te. Black and white only.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center gap-0 lowercase tracking-tight text-foreground [font-family:var(--font-marketing-heading,var(--font-sans))]",
        className,
      )}
    >
      <span className="font-semibold">templ</span>
      <span className="mx-0.5 rounded-sm bg-foreground px-[0.25em] py-[0.15em] text-[0.88em] font-semibold leading-none text-background">
        ai
      </span>
      <span className="font-semibold">te</span>
    </span>
  );
}
