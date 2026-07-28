import React from 'react';

type BadgeVariant = 'active' | 'processing' | 'warning' | 'error' | 'neutral' | 'complete' | 'stale' | 'queued';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  active:     { bg: 'var(--positive-bg)',  color: 'var(--positive)' },
  complete:   { bg: 'var(--positive-bg)',  color: 'var(--positive)' },
  processing: { bg: 'var(--info-bg)',      color: 'var(--primary)' },
  queued:     { bg: 'var(--info-bg)',      color: 'var(--primary)' },
  warning:    { bg: 'var(--warning-bg)',   color: 'var(--warning)' },
  error:      { bg: 'var(--negative-bg)',  color: 'var(--negative)' },
  neutral:    { bg: 'var(--muted)',        color: 'var(--muted-foreground)' },
  stale:      { bg: 'var(--muted)',        color: 'var(--muted-foreground)' },
};

export default function Badge({ variant, children, dot = false }: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: styles.bg, color: styles.color }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: styles.color }}
        />
      )}
      {children}
    </span>
  );
}