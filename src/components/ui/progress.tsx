import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorVariant?: "indigo" | "emerald" | "amber" | "purple";
  size?: "sm" | "md" | "lg";
}

export function Progress({
  className,
  value,
  colorVariant = "indigo",
  size = "md",
  ...props
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value || 0)));

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colors = {
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
    amber: "bg-gradient-to-r from-amber-500 to-orange-500",
    purple: "bg-gradient-to-r from-purple-500 to-indigo-500",
  };

  return (
    <div
      className={twMerge(
        clsx("w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", heights[size], className)
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className={twMerge(clsx("h-full transition-all duration-500 ease-out rounded-full", colors[colorVariant]))}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
