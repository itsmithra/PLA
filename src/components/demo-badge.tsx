import React from "react";
import { Sparkles, Info } from "lucide-react";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
        <Sparkles className="w-3 h-3 text-indigo-500" />
        Demo Dataset Active
      </span>
    );
  }

  return (
    <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl p-3 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
      <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
      <div>
        <span className="font-semibold">Demonstration Mode Active:</span> Running with seeded curriculum and client-side persistence. Connect your Supabase & Gemini API keys in <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded text-[11px] font-mono">.env.local</code> to activate live cloud PostgreSQL and live generative AI.
      </div>
    </div>
  );
}
