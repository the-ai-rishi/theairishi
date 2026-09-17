"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (Array.isArray(data)) setResults(data);
          setIsLoading(false);
        })
        .catch((err) => {
          if (!cancelled && err.name !== "AbortError") setIsLoading(false);
        });
    }, 160);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 border border-hairline bg-transparent px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-cream/45 transition hover:border-gold/30 hover:text-cream"
        aria-label="Search"
      >
        <Search className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-cream/35 sm:inline-block">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
          <div
            className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-2xl overflow-hidden border border-hairline bg-field text-cream"
          >
            <h2 id={titleId} className="sr-only">
              Search the site
            </h2>
            <div className="flex items-center border-b border-hairline px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  setIsLoading(Boolean(value.trim()));
                  if (!value.trim()) setResults([]);
                }}
                placeholder="Day 1, shell, Git, DNS…"
                className="w-full bg-transparent px-3 text-[15px] text-cream placeholder-cream/35 outline-none"
                autoComplete="off"
                autoCorrect="off"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-cream/40 hover:text-cream"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3" role="listbox" aria-label="Search results">
              {query.trim().length === 0 ? (
                <p className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  Search published days, lessons, and the 120-day journey.
                </p>
              ) : isLoading && results.length === 0 ? (
                <p className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  Searching…
                </p>
              ) : results.length === 0 ? (
                <p className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  No matches for “{query}”.
                </p>
              ) : (
                results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between gap-4 border border-transparent p-3.5 transition hover:border-gold/30 hover:bg-ink/50"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80">
                          {item.type}
                        </span>
                        {item.category ? (
                          <span className="truncate font-mono text-[10px] text-cream/35">
                            {item.category}
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate font-medium text-cream group-hover:text-gold-bright">
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="line-clamp-1 text-[13px] text-cream/40">{item.description}</p>
                      ) : null}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-cream/20 transition group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
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
