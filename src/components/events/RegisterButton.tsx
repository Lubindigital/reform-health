import Link from "next/link";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface RegisterButtonProps {
  /** Destination. Internal paths (start with "/") navigate in the same tab. */
  href?: string | null;
  /** True when href points to an in-app registration page. */
  internal?: boolean;
  title: string;
  /** "solid" = navy on light backgrounds, "onDark" = white on the navy hero */
  variant?: "solid" | "onDark";
  className?: string;
}

export function RegisterButton({
  href,
  internal = false,
  title,
  variant = "solid",
  className = "",
}: RegisterButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  if (!href) {
    // No destination yet — a calm, non-clickable placeholder rather than a dead button.
    const pending =
      variant === "onDark"
        ? "bg-white/[0.06] text-white/45 ring-1 ring-inset ring-white/10"
        : "bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200";
    return (
      <span className={`${base} ${pending} cursor-default ${className}`} aria-disabled="true">
        Registration Opening Soon
      </span>
    );
  }

  const solid =
    variant === "onDark"
      ? "bg-white text-[#0a193c] hover:bg-[#cdddff] focus-visible:ring-white focus-visible:ring-offset-[#0a193c]"
      : "bg-navy text-white hover:bg-navy-deep focus-visible:ring-navy focus-visible:ring-offset-white";

  const classes = `${base} ${solid} ${className}`;

  if (internal) {
    return (
      <Link href={href} aria-label={`Register for ${title}`} className={classes}>
        Register to Join
        <ArrowIcon />
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Register for ${title}`}
      className={classes}
    >
      Register to Join
      <ArrowIcon />
    </a>
  );
}
