import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  detail: ReactNode;
  icon: ReactNode;
  tone?: "green" | "amber" | "coral" | "blue";
}

export function StatCard({ detail, icon, label, tone = "green", value }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className={`stat-card__icon stat-card__icon--${tone}`} aria-hidden="true">{icon}</span>
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__detail">{detail}</p>
    </article>
  );
}