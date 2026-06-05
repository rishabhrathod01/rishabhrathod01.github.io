"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      result.unshift({ type: "equal", line: linesA[i - 1], lineA: i, lineB: j });
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
      rows.push({ kind: "equal", line: line.line, lineA: line.lineA, lineB: line.lineB });
      k++;
    } else {
      // Collect contiguous block of removes then adds
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

function tryFormat(input: string): { value: string; error: string } {
  if (!input.trim()) return { value: input, error: "" };
  try {
    return { value: JSON.stringify(JSON.parse(input), null, 2), error: "" };
  } catch (e) {
    return { value: input, error: (e as Error).message };
  }
}

export default function JsonDiffPage() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");
  const [stats, setStats] = useState({ added: 0, removed: 0, equal: 0 });
  const [viewMode, setViewMode] = useState<"unified" | "split">("split");

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

    if (!inputA.trim()) { setErrorA("Input is empty"); return; }
    if (!inputB.trim()) { setErrorB("Input is empty"); return; }

    let parsedA: unknown, parsedB: unknown;
    try { parsedA = JSON.parse(inputA); } catch (e) {
      setErrorA(`Invalid JSON: ${(e as Error).message}`); return;
    }
    try { parsedB = JSON.parse(inputB); } catch (e) {
      setErrorB(`Invalid JSON: ${(e as Error).message}`); return;
    }

    const linesA = JSON.stringify(sortJson(parsedA), null, 2).split("\n");
    const linesB = JSON.stringify(sortJson(parsedB), null, 2).split("\n");
    const diff = computeDiff(linesA, linesB);

    setDiffResult(diff);
    setStats({
      added: diff.filter((d) => d.type === "add").length,
      removed: diff.filter((d) => d.type === "remove").length,
      equal: diff.filter((d) => d.type === "equal").length,
    });
  }, [inputA, inputB]);

  const clear = useCallback(() => {
    setInputA("");
    setInputB("");
    setDiffResult(null);
    setErrorA("");
    setErrorB("");
    setStats({ added: 0, removed: 0, equal: 0 });
  }, []);

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
            onChange={(e) => { setInputA(e.target.value); setErrorA(""); }}
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
            onChange={(e) => { setInputB(e.target.value); setErrorB(""); }}
            spellCheck={false}
          />
          {errorB && <p className="text-xs text-destructive">{errorB}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Button onClick={compare}>Compare</Button>
        <Button variant="outline" onClick={clear}>Clear</Button>
      </div>

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
            /* Unified diff table */
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
                            isAdd && "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/40",
                            isRemove && "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40"
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
            /* Split diff table */
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
                          {/* Left line number */}
                          <td className="select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50">
                            {row.lineA}
                          </td>
                          {/* Left content */}
                          <td className="py-px pl-3 pr-2 whitespace-pre border-r border-border">
                            {row.line}
                          </td>
                          {/* Right line number */}
                          <td className="select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50">
                            {row.lineB}
                          </td>
                          {/* Right content */}
                          <td className="py-px pl-3 pr-4 whitespace-pre">
                            {row.line}
                          </td>
                        </tr>
                      );
                    }
                    // change row
                    return (
                      <tr key={idx}>
                        {/* Left line number */}
                        <td
                          className={cn(
                            "select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50",
                            row.leftLine !== null && "bg-red-100 dark:bg-red-950/40"
                          )}
                        >
                          {row.leftNum ?? ""}
                        </td>
                        {/* Left content */}
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
                        {/* Right line number */}
                        <td
                          className={cn(
                            "select-none text-right pr-2 pl-3 py-px text-muted-foreground/60 border-r border-border/50",
                            row.rightLine !== null && "bg-green-100 dark:bg-green-950/40"
                          )}
                        >
                          {row.rightNum ?? ""}
                        </td>
                        {/* Right content */}
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
