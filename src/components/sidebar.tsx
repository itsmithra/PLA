"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  LineChart,
  Bookmark,
  Sliders,
  Sparkles,
  Flame,
  Award,
} from "lucide-react";
import { DemoBadge } from "./demo-badge";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Curriculum & Topics", href: "/subjects", icon: BookOpen },
  { name: "Daily Study Plan", href: "/study-plan", icon: CalendarDays },
  { name: "Mastery Analytics", href: "/progress", icon: LineChart },
  { name: "Saved Resources", href: "/resources", icon: Bookmark },
  { name: "Preferences & Goal", href: "/settings", icon: Sliders },
];

export function Sidebar({ streakDays = 4 }: { streakDays?: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Active Streak Widget */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-base">{streakDays} Days</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Daily Streak Active</p>
          </div>
        </div>

        {/* Primary Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Student Workspace
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-200/50 dark:border-indigo-800/50 font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-900/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Mode Indication */}
      <div className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
        <DemoBadge compact />
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
          Knowvexa AI v1.0 • Adaptive Spaced Learning
        </p>
      </div>
    </aside>
  );
}
