import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning' | 'hero';
  icon?: React.ReactNode;
  className?: string;
  alert?: string;
}

export default function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  variant = 'default',
  icon,
  className = '',
  alert,
}: MetricCardProps) {
  const getBg = () => {
    switch (variant) {
      case 'positive': return 'var(--positive-bg)';
      case 'negative': return 'var(--negative-bg)';
      case 'warning': return 'var(--warning-bg)';
      case 'hero': return 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(0,212,170,0.06) 100%)';
      default: return 'var(--card)';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'positive': return 'rgba(0, 212, 170, 0.25)';
      case 'negative': return 'rgba(239, 68, 68, 0.25)';
      case 'warning': return 'rgba(245, 158, 11, 0.25)';
      case 'hero': return 'rgba(108, 99, 255, 0.3)';
      default: return 'var(--border)';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'positive': return 'var(--positive)';
      case 'negative': return 'var(--negative)';
      case 'warning': return 'var(--warning)';
      case 'hero': return 'var(--foreground)';
      default: return 'var(--foreground)';
    }
  };

  const TrendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend === undefined ? '' : trend > 0 ? 'var(--positive)' : trend < 0 ? 'var(--negative)' : 'var(--muted-foreground)';

  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 ${className}`}
      style={{
        background: getBg(),
        border: `1px solid ${getBorderColor()}`,
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}>
          {label}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--muted)' }}>
            {icon}
          </div>
        )}
        {alert && (
          <div className="flex items-center gap-1" style={{ color: 'var(--warning)' }}>
            <AlertTriangle size={14} />
          </div>
        )}
      </div>

      <div>
        <p
          className="text-3xl font-bold tabular-nums leading-none font-mono"
          style={{ color: getValueColor() }}
        >
          {value}
        </p>
        {subValue && (
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{subValue}</p>
        )}
      </div>

      {(TrendIcon || trendLabel) && (
        <div className="flex items-center gap-1.5">
          {TrendIcon && (
            <TrendIcon size={14} style={{ color: trendColor }} />
          )}
          {trend !== undefined && (
            <span className="text-xs font-semibold tabular-nums font-mono" style={{ color: trendColor }}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {trendLabel && (
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{trendLabel}</span>
          )}
        </div>
      )}

      {alert && (
        <p className="text-xs" style={{ color: 'var(--warning)' }}>{alert}</p>
      )}
    </div>
  );
}