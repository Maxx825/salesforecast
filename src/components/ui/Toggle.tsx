'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, label, disabled = false, size = 'md' }: ToggleProps) {
  const trackClass = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6';
  const thumbClass = size === 'sm'
    ? `w-3 h-3 top-0.5 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`
    : `w-5 h-5 top-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`;

  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`${trackClass} rounded-full transition-colors duration-200`}
          style={{ background: checked ? 'var(--primary)' : 'var(--muted)' }}
        />
        <div
          className={`absolute ${thumbClass} rounded-full bg-white shadow transition-transform duration-200`}
        />
      </div>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
}