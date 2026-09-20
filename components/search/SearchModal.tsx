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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

export default function SearchModal({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const hintId = useId();
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  function closeSearch() {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeSearch();
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
    if (!isOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={
          compact
            ? "inline-flex h-11 w-11 items-center justify-center text-cream/50 transition hover:text-cream"
            : "inline-flex min-h-11 items-center gap-2 border border-hairline bg-transparent px-3 py-1.5 font-mono text-[12px] tracking-[0.08em] text-cream/45 transition hover:border-gold/30 hover:text-cream"
        }
        aria-label="Search published titles and summaries"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Search className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
        {compact ? null : <span className="hidden sm:inline">Search</span>}
        {compact ? null : (
          <kbd className="hidden border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-cream/35 sm:inline-block">
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
          <div
            className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={closeSearch}
            aria-hidden="true"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={hintId}
            className="relative z-10 w-full max-w-2xl overflow-hidden border border-hairline bg-field text-cream"
          >
            <h2 id={titleId} className="sr-only">
              Search published titles and summaries
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
                placeholder="Day 2, Git, permissions…"
                className="w-full bg-transparent px-3 text-[15px] text-cream placeholder-cream/35 outline-none"
                autoComplete="off"
                autoCorrect="off"
                aria-describedby={hintId}
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-10 w-10 items-center justify-center text-cream/40 hover:text-cream"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {query.trim().length === 0 ? (
                <p id={hintId} className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  Titles and summaries of published days. Not the full lesson text.
                </p>
              ) : isLoading && results.length === 0 ? (
                <p className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  Searching titles and summaries…
                </p>
              ) : results.length === 0 ? (
                <p className="py-8 text-center font-mono text-[12px] tracking-[0.08em] text-cream/40">
                  No title or summary matches “{query}”.
                </p>
              ) : (
                <ul className="space-y-0">
                  {results.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.url}
                        onClick={closeSearch}
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
                    </li>
                  ))}
                </ul>
              )}
              {query.trim().length > 0 ? (
                <p id={hintId} className="sr-only">
                  Search matches titles, summaries, tags, and outcomes of published days. Not the full lesson text.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
