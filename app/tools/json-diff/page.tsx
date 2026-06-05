"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Trash2, X, Link, Check } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterConfig = { name: string; paths: string[] };

type EqualLine = { type: "equal"; line: string; lineA: number; lineB: number };
type RemoveLine = { type: "remove"; line: string; lineA: number };
type AddLine = { type: "add"; line: string; lineB: number };
type DiffLine = EqualLine | RemoveLine | AddLine;

type SideBySideRow =
  | { kind: "equal"; line: string; lineA: number; lineB: number }
  | {
      kind: "change";
      leftLine: string | null;
      leftNum: number | null;
      rightLine: string | null;
      rightNum: number | null;
    };

// ─── localStorage ─────────────────────────────────────────────────────────────

const LS_KEY = "json-diff-filter-configs";

function loadConfigs(): FilterConfig[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as FilterConfig[];
  } catch {
    return [];
  }
}

function saveConfigs(configs: FilterConfig[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(configs));
  } catch {}
}

// ─── Config URL encoding ──────────────────────────────────────────────────────

function encodeConfig(cfg: FilterConfig): string {
  return btoa(JSON.stringify(cfg))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeConfig(raw: string): FilterConfig | null {
  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (padded.length % 4)) % 4;
    return JSON.parse(atob(padded + "=".repeat(padding))) as FilterConfig;
  } catch {
    return null;
  }
}

// ─── JSON utilities ───────────────────────────────────────────────────────────

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJson).sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      if (typeof a === "string" && typeof b === "string")
        return a.localeCompare(b);
      return JSON.stringify(a).localeCompare(JSON.stringify(b));
    });
  }
  if (value !== null && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as object).sort()) {
      sorted[key] = sortJson((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

function applyFilter(value: unknown, parts: string[]): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => applyFilter(v, parts));
  const [head, ...tail] = parts;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === head) {
      if (tail.length === 0) continue; // drop key entirely
      result[k] = applyFilter(v, tail);
    } else {
      result[k] = applyFilter(v, parts); // keep key, recurse full path
    }
  }
  return result;
}

function stripPaths(value: unknown, paths: string[]): unknown {
  return paths
    .filter((p) => p.trim())
    .reduce((acc, p) => applyFilter(acc, p.trim().split(".")), value);
}

function tryFormat(input: string): { value: string; error: string } {
  if (!input.trim()) return { value: input, error: "" };
  try {
    return { value: JSON.stringify(JSON.parse(input), null, 2), error: "" };
  } catch (e) {
    return { value: input, error: (e as Error).message };
  }
}

// ─── Diff algorithm ──────────────────────────────────────────────────────────

function computeDiff(linesA: string[], linesB: string[]): DiffLine[] {
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        linesA[i - 1] === linesB[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({
        type: "equal",
        line: linesA[i - 1],
        lineA: i,
        lineB: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "add", line: linesB[j - 1], lineB: j });
      j--;
    } else {
      result.unshift({ type: "remove", line: linesA[i - 1], lineA: i });
      i--;
    }
  }
  return result;
}

function toSideBySide(diff: DiffLine[]): SideBySideRow[] {
  const rows: SideBySideRow[] = [];
  let k = 0;
  while (k < diff.length) {
    const line = diff[k];
    if (line.type === "equal") {
      rows.push({
        kind: "equal",
        line: line.line,
        lineA: line.lineA,
        lineB: line.lineB,
      });
      k++;
    } else {
      const removes: RemoveLine[] = [];
      const adds: AddLine[] = [];
      while (k < diff.length && diff[k].type === "remove") {
        removes.push(diff[k] as RemoveLine);
        k++;
      }
      while (k < diff.length && diff[k].type === "add") {
        adds.push(diff[k] as AddLine);
        k++;
      }
      const len = Math.max(removes.length, adds.length);
      for (let r = 0; r < len; r++) {
        const rem = removes[r] ?? null;
        const add = adds[r] ?? null;
        rows.push({
          kind: "change",
          leftLine: rem ? rem.line : null,
          leftNum: rem ? rem.lineA : null,
          rightLine: add ? add.line : null,
          rightNum: add ? add.lineB : null,
        });
      }
    }
  }
  return rows;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JsonDiffPage() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");
  const [stats, setStats] = useState({ added: 0, removed: 0, equal: 0 });
  const [viewMode, setViewMode] = useState<"unified" | "split">("split");

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [draftPath, setDraftPath] = useState("");
  const [savedConfigs, setSavedConfigs] = useState<FilterConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [configName, setConfigName] = useState("");
  const [shareToast, setShareToast] = useState<"idle" | "copied">("idle");
  const [inboundBanner, setInboundBanner] = useState<string | null>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = loadConfigs();
    setSavedConfigs(existing);

    const params = new URLSearchParams(window.location.search);
    const raw = params.get("filter");
    if (!raw) return;

    const cfg = decodeConfig(raw);
    if (!cfg || !cfg.name || !Array.isArray(cfg.paths)) return;

    const merged = [...existing.filter((c) => c.name !== cfg.name), cfg];
    setSavedConfigs(merged);
    saveConfigs(merged);

    setActivePaths(cfg.paths);
    setConfigName(cfg.name);
    setSelectedConfig(cfg.name);
    setShowFilter(true);
    setInboundBanner(cfg.name);

    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const formatA = useCallback(() => {
    const { value, error } = tryFormat(inputA);
    setInputA(value);
    setErrorA(error ? `Invalid JSON: ${error}` : "");
  }, [inputA]);

  const formatB = useCallback(() => {
    const { value, error } = tryFormat(inputB);
    setInputB(value);
    setErrorB(error ? `Invalid JSON: ${error}` : "");
  }, [inputB]);

  const compare = useCallback(() => {
    setErrorA("");
    setErrorB("");
    if (!inputA.trim()) {
      setErrorA("Input is empty");
      return;
    }
    if (!inputB.trim()) {
      setErrorB("Input is empty");
      return;
    }
    let parsedA: unknown, parsedB: unknown;
    try {
      parsedA = JSON.parse(inputA);
    } catch (e) {
      setErrorA(`Invalid JSON: ${(e as Error).message}`);
      return;
    }
    try {
      parsedB = JSON.parse(inputB);
    } catch (e) {
      setErrorB(`Invalid JSON: ${(e as Error).message}`);
      return;
    }

    const linesA = JSON.stringify(
      sortJson(stripPaths(parsedA, activePaths)),
      null,
      2
    ).split("\n");
    const linesB = JSON.stringify(
      sortJson(stripPaths(parsedB, activePaths)),
      null,
      2
    ).split("\n");
    const diff = computeDiff(linesA, linesB);
    setDiffResult(diff);
    setStats({
      added: diff.filter((d) => d.type === "add").length,
      removed: diff.filter((d) => d.type === "remove").length,
      equal: diff.filter((d) => d.type === "equal").length,
    });
  }, [inputA, inputB, activePaths]);

  const clear = useCallback(() => {
    setInputA("");
    setInputB("");
    setDiffResult(null);
    setErrorA("");
    setErrorB("");
    setStats({ added: 0, removed: 0, equal: 0 });
  }, []);

  // Filter helpers
  const addDraftPath = useCallback(() => {
    const p = draftPath.trim();
    if (!p || activePaths.includes(p)) {
      setDraftPath("");
      return;
    }
    setActivePaths((prev) => [...prev, p]);
    setDraftPath("");
    setSelectedConfig("");
  }, [draftPath, activePaths]);

  const removePath = useCallback((path: string) => {
    setActivePaths((prev) => prev.filter((p) => p !== path));
    setSelectedConfig("");
  }, []);

  const loadConfig = useCallback(
    (name: string) => {
      const cfg = savedConfigs.find((c) => c.name === name);
      if (cfg) {
        setActivePaths([...cfg.paths]);
        setConfigName(cfg.name);
      }
      setSelectedConfig(name);
    },
    [savedConfigs]
  );

  const saveConfig = useCallback(() => {
    const name = configName.trim();
    if (!name) return;
    const updated = [
      ...savedConfigs.filter((c) => c.name !== name),
      { name, paths: [...activePaths] },
    ];
    setSavedConfigs(updated);
    saveConfigs(updated);
    setSelectedConfig(name);
  }, [configName, activePaths, savedConfigs]);

  const copyShareUrl = useCallback(() => {
    const name = configName.trim() || "Shared config";
    const url =
      window.location.origin +
      window.location.pathname +
      "?filter=" +
      encodeConfig({ name, paths: activePaths });

    const finish = () => {
      setShareToast("copied");
      setTimeout(() => setShareToast("idle"), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(finish);
    } else {
      // Fallback for non-secure contexts (HTTP on LAN)
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      finish();
    }
  }, [configName, activePaths]);

  const deleteConfig = useCallback(() => {
    if (!selectedConfig) return;
    const updated = savedConfigs.filter((c) => c.name !== selectedConfig);
    setSavedConfigs(updated);
    saveConfigs(updated);
    setSelectedConfig("");
    setConfigName("");
  }, [selectedConfig, savedConfigs]);

  const noDiff =
    diffResult !== null && stats.added === 0 && stats.removed === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON Diff</h1>
        <p className="text-muted-foreground text-sm">
          Keys are sorted A→Z and array elements 0→9 / A→Z recursively before
          comparison, so structural differences aren&apos;t masked by ordering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Panel A */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JSON A — Original</label>
            <button
              onClick={formatA}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Format
            </button>
          </div>
          <textarea
            className={cn(
              "h-64 w-full rounded-md border bg-background p-3 font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-ring",
              errorA && "border-destructive"
            )}
            placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'}
            value={inputA}
            onChange={(e) => {
              setInputA(e.target.value);
              setErrorA("");
            }}
            spellCheck={false}
          />
          {errorA && <p className="text-xs text-destructive">{errorA}</p>}
        </div>

        {/* Panel B */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JSON B — Modified</label>
            <button
              onClick={formatB}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Format
            </button>
          </div>
          <textarea
            className={cn(
              "h-64 w-full rounded-md border bg-background p-3 font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-ring",
              errorB && "border-destructive"
            )}
            placeholder={'{\n  "name": "Alice",\n  "age": 31\n}'}
            value={inputB}
            onChange={(e) => {
              setInputB(e.target.value);
              setErrorB("");
            }}
            spellCheck={false}
          />
          {errorB && <p className="text-xs text-destructive">{errorB}</p>}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 mb-4">
        <Button onClick={compare}>Compare</Button>
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilter((v) => !v)}
          className={cn(
            "relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
            showFilter
              ? "border-foreground bg-foreground text-background"
              : "hover:bg-muted"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activePaths.length > 0 && (
            <span
              className={cn(
                "ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold leading-none",
                showFilter
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              )}
            >
              {activePaths.length}
            </span>
          )}
        </button>
      </div>

      {/* Inbound share banner */}
      {inboundBanner && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-2.5 text-sm text-green-800 dark:text-green-300">
          <span>
            Filter config <strong>&ldquo;{inboundBanner}&rdquo;</strong> loaded
            from share link and saved to your configs.
          </span>
          <button
            onClick={() => setInboundBanner(null)}
            className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showFilter && (
        <div className="mb-6 rounded-lg border bg-muted/20 p-4 space-y-5">
          {/* Active paths */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Keys to exclude
            </p>
            <p className="text-xs text-muted-foreground">
              Dot-notation paths applied recursively to both JSONs before
              comparison. e.g.{" "}
              <code className="rounded bg-muted px-1 py-px font-mono">
                metadata.x
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-px font-mono">
                properties.columnsSelector
              </code>
            </p>

            {/* Path chips */}
            {activePaths.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activePaths.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-0.5 font-mono text-xs"
                  >
                    {p}
                    <button
                      onClick={() => removePath(p)}
                      className="ml-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Remove ${p}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add path input */}
            <div className="flex gap-2">
              <input
                ref={draftInputRef}
                type="text"
                value={draftPath}
                onChange={(e) => setDraftPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDraftPath();
                  }
                }}
                placeholder="e.g. metadata.x"
                className="h-8 flex-1 rounded-md border bg-background px-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addDraftPath}
                disabled={!draftPath.trim()}
              >
                Add path
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Saved configs */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Saved configurations
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Load dropdown */}
              <select
                value={selectedConfig}
                onChange={(e) => loadConfig(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— Load a saved config —</option>
                {savedConfigs.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.paths.length} path
                    {c.paths.length !== 1 ? "s" : ""})
                  </option>
                ))}
              </select>

              {/* Delete */}
              <button
                onClick={deleteConfig}
                disabled={!selectedConfig}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2.5 h-8 text-xs transition-colors",
                  selectedConfig
                    ? "border-destructive text-destructive hover:bg-destructive/10"
                    : "text-muted-foreground cursor-not-allowed opacity-40"
                )}
                aria-label="Delete selected config"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>

            {/* Save current paths as named config */}
            <div className="flex gap-2">
              <input
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveConfig();
                  }
                }}
                placeholder="Config name…"
                className="h-8 flex-1 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                onClick={saveConfig}
                disabled={!configName.trim() || activePaths.length === 0}
              >
                Save config
              </Button>
            </div>
            {activePaths.length === 0 && configName.trim() && (
              <p className="text-xs text-muted-foreground">
                Add at least one path before saving.
              </p>
            )}

            {/* Share */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={copyShareUrl}
                disabled={activePaths.length === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-3 h-8 text-xs transition-colors",
                  activePaths.length > 0
                    ? "hover:bg-muted"
                    : "opacity-40 cursor-not-allowed"
                )}
              >
                {shareToast === "copied" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link className="h-3.5 w-3.5" />
                    Copy share link
                  </>
                )}
              </button>
              <span className="text-xs text-muted-foreground">
                Anyone who opens this link will get the config saved
                automatically.
              </span>
            </div>
          </div>
        </div>
      )}

      {diffResult !== null && (
        <div className="border rounded-lg overflow-hidden">
          {/* Stats bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40 text-sm">
            <div className="flex items-center gap-5">
              {noDiff ? (
                <span className="font-medium text-muted-foreground">
                  Identical after sorting — no differences
                </span>
              ) : (
                <>
                  <span className="font-medium">Diff result</span>
                  <span className="font-mono text-green-600 dark:text-green-400">
                    +{stats.added}
                  </span>
                  <span className="font-mono text-red-600 dark:text-red-400">
                    −{stats.removed}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {stats.equal} unchanged
                  </span>
                  {activePaths.length > 0 && (
                    <span className="font-mono text-muted-foreground/60 text-xs">
                      · {activePaths.length} path
                      {activePaths.length !== 1 ? "s" : ""} excluded
                    </span>
                  )}
                </>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center rounded-md border overflow-hidden text-xs">
              <button
                onClick={() => setViewMode("split")}
                className={cn(
                  "px-3 py-1.5 transition-colors",
                  viewMode === "split"
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                )}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("unified")}
                className={cn(
                  "px-3 py-1.5 transition-colors border-l",
                  viewMode === "unified"
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                )}
              >
                Unified
              </button>
            </div>
          </div>

          {viewMode === "unified" ? (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs border-collapse">
                <tbody>
                  {diffResult.map((line, idx) => {
                    const isAdd = line.type === "add";
                    const isRemove = line.type === "remove";
                    return (
                      <tr
                        key={idx}
                        className={cn(
                          isAdd && "bg-green-50 dark:bg-green-950/20",
                          isRemove && "bg-red-50 dark:bg-red-950/20"
                        )}
                      >
                        <td className="select-none w-10 text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50">
                          {"lineA" in line ? line.lineA : ""}
                        </td>
                        <td className="select-none w-10 text-right pr-2 pl-2 py-px text-muted-foreground/60 border-r border-border/50">
                          {"lineB" in line ? line.lineB : ""}
                        </td>
                        <td
                          className={cn(
                            "select-none w-5 text-center py-px border-r border-border/50",
                            isAdd &&
                              "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/40",
                            isRemove &&
                              "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40"
                          )}
                        >
                          {isAdd ? "+" : isRemove ? "−" : " "}
                        </td>
                        <td
                          className={cn(
                            "py-px pl-3 pr-4 whitespace-pre",
                            isAdd && "text-green-800 dark:text-green-300",
                            isRemove && "text-red-700 dark:text-red-300"
                          )}
                        >
                          {line.line}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs border-collapse table-fixed">
                <colgroup>
                  <col className="w-10" />
                  <col />
                  <col className="w-10" />
                  <col />
                </colgroup>
                <tbody>
                  {toSideBySide(diffResult).map((row, idx) => {
                    if (row.kind === "equal") {
                      return (
                        <tr key={idx}>
                          <td className="select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50">
                            {row.lineA}
                          </td>
                          <td className="py-px pl-3 pr-2 whitespace-pre border-r border-border">
                            {row.line}
                          </td>
                          <td className="select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50">
                            {row.lineB}
                          </td>
                          <td className="py-px pl-3 pr-4 whitespace-pre">
                            {row.line}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={idx}>
                        <td
                          className={cn(
                            "select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50",
                            row.leftLine !== null &&
                              "bg-red-100 dark:bg-red-950/40"
                          )}
                        >
                          {row.leftNum ?? ""}
                        </td>
                        <td
                          className={cn(
                            "py-px pl-3 pr-2 whitespace-pre border-r border-border",
                            row.leftLine !== null
                              ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                              : "bg-muted/30"
                          )}
                        >
                          {row.leftLine ?? ""}
                        </td>
                        <td
                          className={cn(
                            "select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50",
                            row.rightLine !== null &&
                              "bg-green-100 dark:bg-green-950/40"
                          )}
                        >
                          {row.rightNum ?? ""}
                        </td>
                        <td
                          className={cn(
                            "py-px pl-3 pr-4 whitespace-pre",
                            row.rightLine !== null
                              ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300"
                              : "bg-muted/30"
                          )}
                        >
                          {row.rightLine ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
