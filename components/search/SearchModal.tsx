"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  category?: string;
  badge?: string;
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard shortcut Cmd+K or Ctrl+K to toggle modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResults(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [query]);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white cursor-pointer"
        aria-label="Search platform"
      >
        <Search className="h-3.5 w-3.5 text-violet-300/70" />
        <span className="hidden sm:inline">Search platform...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-block rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/40">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#0d0d12] text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Search Input Bar */}
            <div className="flex items-center border-b border-white/10 px-4 py-3.5">
              <Search className="h-5 w-5 text-violet-300 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, lessons, guides, projects..."
                className="w-full bg-transparent px-3 text-sm text-white placeholder-white/40 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 p-1 text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {query.trim().length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  Type a keyword to search across courses, lessons, guides, projects, and media.
                </div>
              ) : isLoading ? (
                <div className="py-8 text-center text-xs text-white/40 animate-pulse">
                  Searching platform content...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  No matching results found for &quot;{query}&quot;.
                </div>
              ) : (
                results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-3.5 text-xs transition hover:border-violet-400/30 hover:bg-white/[0.04]"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-violet-300 font-mono">
                          {item.type}
                        </span>
                        {item.category && (
                          <span className="text-[10px] text-white/30 truncate">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <h4 className="font-medium text-white group-hover:text-violet-200 truncate">
                        {item.title}
                      </h4>

                      <p className="text-white/40 line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
