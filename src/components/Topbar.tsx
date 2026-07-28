'use client';

import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, RefreshCw, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export default function Topbar({ title, subtitle, lastUpdated }: TopbarProps) {
  const [isDark] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? 'U';

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}
    >
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search datasets, forecasts…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="input-field pl-8 w-56 h-9 text-sm"
          />
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw size={12} />
            <span>Updated {lastUpdated}</span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative btn-ghost h-9 w-9 p-0 justify-center">
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--negative)' }}
          />
        </button>

        {/* Theme toggle */}
        <button className="btn-ghost h-9 w-9 p-0 justify-center">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2 h-9 px-2 rounded-lg transition-colors"
            style={{ background: showUserMenu ? 'var(--background)' : 'transparent' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: 'var(--primary)' }}
            >
              {userInitial}
            </div>
            <span className="hidden md:block text-sm font-medium max-w-[120px] truncate" style={{ color: 'var(--foreground)' }}>
              {displayName}
            </span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-lg z-20 overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {displayName}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {user?.email}
                  </p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10"
                    style={{ color: 'var(--negative)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'color-mix(in srgb, var(--negative) 10%, transparent)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}