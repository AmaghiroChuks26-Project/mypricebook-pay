import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <span className="empty-state__icon" aria-hidden="true">{icon}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="state-message" role="alert">
      <strong>We couldn’t load this view.</strong>
      <span>Check your connection and try again.</span>
      {onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}
    </div>
  );
}