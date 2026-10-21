"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  ExternalLink,
  BookOpen,
  Sparkles,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { LearningResource } from "@/types";

export default function ResourcesPage() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadResources = async () => {
    setIsLoading(true);
    const res = await repository.getResources();
    setResources(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleToggleSave = async (resourceId: string) => {
    const newState = await repository.toggleSaveResource(resourceId);
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, saved: newState } : r))
    );
  };

  const filtered = resources.filter((r) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "saved" && r.saved) ||
      r.resource_type === filterType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Curated Learning Resources
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified documentation, interactive visualizers, and canonical specifications.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["all", "saved", "documentation", "article", "interactive"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  filterType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {type === "saved" ? "★ Saved" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 text-xs text-slate-500">
              No resources match your filter criteria.
            </div>
          ) : (
            filtered.map((res) => (
              <Card key={res.id} hoverEffect className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" size="sm">
                      {res.resource_type.toUpperCase()}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleToggleSave(res.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        res.saved
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                      }`}
                      title={res.saved ? "Remove Bookmark" : "Save Resource"}
                    >
                      <Bookmark className={`w-4 h-4 ${res.saved ? "fill-indigo-600" : ""}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Source: {res.author}
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Open Resource <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
