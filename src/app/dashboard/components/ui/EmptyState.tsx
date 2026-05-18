import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center shadow-sm">
      {icon ? <div className="mb-4 flex justify-center text-muted/60">{icon}</div> : null}
      <p className="mb-2 text-lg font-semibold text-foreground">{title}</p>
      <p className="mx-auto mb-5 max-w-md text-muted">{description}</p>
      {action}
    </div>
  );
}
