interface SectionHeadingProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({ title, highlight, subtitle, centered = true }: SectionHeadingProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--sb-navy)]">
        {highlight && parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="underline-accent">{highlight}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base text-[var(--sb-secondary-text)] leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

