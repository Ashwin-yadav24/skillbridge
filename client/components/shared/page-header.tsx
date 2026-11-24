interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ badge, title, highlight, description, actions }: PageHeaderProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--sb-navy)] bg-white px-4 py-1.5 text-xs font-semibold shadow-navy-sm mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--sb-green)] animate-pulse" />
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--sb-navy)] mb-3">
            {highlight && parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-[var(--sb-blue)]">{highlight}</span>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </h1>
          {description && (
            <p className="max-w-2xl text-base text-[var(--sb-secondary-text)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

