"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
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
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          className="command-layer"
        >
          <button type="button" className="command-close" onClick={closeSearch}>
            Close
          </button>
          <h2 id={titleId} className="sr-only">
            Search published titles and summaries
          </h2>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              setCursor(0);
              setIsLoading(Boolean(value.trim()));
              if (!value.trim()) setResults([]);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((current) => Math.min(results.length - 1, current + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((current) => Math.max(0, current - 1));
              } else if (event.key === "Enter" && results[cursor]) {
                event.preventDefault();
                const url = results[cursor].url;
                closeSearch();
                router.push(url);
              }
            }}
            placeholder="Search days, phases, guides, labs"
            autoComplete="off"
            autoCorrect="off"
            aria-describedby={hintId}
          />
          <div className="command-groups">
            {query.trim().length === 0 ? (
              <p id={hintId}>Days, phases, guides, and projects. Not the full lesson text.</p>
            ) : isLoading && results.length === 0 ? (
              <p>Searching titles and summaries…</p>
            ) : results.length === 0 ? (
              <p>No title or summary matches “{query}”.</p>
            ) : (
              Array.from(
                results.reduce((map, item, index) => {
                  const list = map.get(item.type) || [];
                  list.push({ item, index });
                  map.set(item.type, list);
                  return map;
                }, new Map<string, { item: SearchResultItem; index: number }[]>()),
              ).map(([type, items]) => (
                <section key={type}>
                  <h3>{type}</h3>
                  {items.map(({ item, index }) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className={index === cursor ? "is-active" : ""}
                      onClick={closeSearch}
                      onMouseEnter={() => setCursor(index)}
                    >
                      <span>
                        <strong className="block font-serif text-2xl">{item.title}</strong>
                        {item.description ? <span className="mt-1 block text-sm opacity-70">{item.description}</span> : null}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-60">{item.category || item.type}</span>
                    </Link>
                  ))}
                </section>
              ))
            )}
            {query.trim().length > 0 ? (
              <p id={hintId} className="sr-only">
                Search matches titles, summaries, tags, and outcomes. Not the full lesson text.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
