import type { ReactNode } from "react";
export function Widget({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`h-widget ${className}`}>
      <header>
        <h2>{title}</h2>
        {action}
      </header>
      <div className="h-widget-body">{children}</div>
    </section>
  );
}
