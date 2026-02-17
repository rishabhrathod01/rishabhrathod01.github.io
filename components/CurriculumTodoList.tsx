"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Square } from "lucide-react";
import {
  SYSTEM_DESIGN_12WEEK,
  CURRICULUM_STORAGE_KEY,
  type CurriculumWeek,
} from "@/lib/curriculum-system-design-12week";

function loadStored(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveStored(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function CurriculumTodoList() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked(loadStored());
  }, []);

  const set = useCallback((id: string, value: boolean) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: value };
      saveStored(next);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (id: string) => set(id, !checked[id]),
    [checked, set]
  );

  const toggleWeek = useCallback(
    (week: CurriculumWeek) => {
      const allItemIds = week.items.map((_, i) => `${week.id}-${i}`);
      setChecked((prev) => {
        const weekChecked = prev[week.id];
        const allItemsChecked = allItemIds.every((id) => prev[id]);
        const isFullyDone = weekChecked || allItemsChecked;
        const next = { ...prev };
        if (isFullyDone) {
          next[week.id] = false;
          allItemIds.forEach((id) => (next[id] = false));
        } else {
          next[week.id] = true;
          allItemIds.forEach((id) => (next[id] = true));
        }
        saveStored(next);
        return next;
      });
    },
    []
  );


  return (
    <div className="space-y-10">
      <p className="text-muted-foreground mb-2">
        This 12-week intensive completes both <strong>System Design Interview</strong> (Alex Xu) and <strong>Designing Data-Intensive Applications</strong> (DDIA, Kleppmann). Each week includes content to learn, a project, and blog topics.
      </p>
      <p className="text-muted-foreground mb-6">
        Feel free to track your progress on this site itself.
      </p>

      {SYSTEM_DESIGN_12WEEK.map((week) => {
        const weekChecked = checked[week.id];
        const itemIds = week.items.map((_, i) => `${week.id}-${i}`);
        const allItemsChecked = itemIds.every((id) => checked[id]);
        const weekFullyDone = weekChecked || allItemsChecked;

        return (
          <section
            key={week.id}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <button
                type="button"
                onClick={() => toggleWeek(week)}
                className="mt-0.5 flex-shrink-0 rounded border border-input p-1 transition-colors hover:bg-muted"
                aria-label={weekChecked ? "Mark week incomplete" : "Mark week complete"}
              >
                {weekFullyDone ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <h2 className="text-2xl font-bold mt-0 pt-0">
                {week.title}
              </h2>
            </div>
            <ul className="list-none space-y-2 pl-8">
              {week.items.map((item, i) => {
                const id = `${week.id}-${i}`;
                const isChecked = checked[id];
                return (
                  <li key={id} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      className="mt-0.5 flex-shrink-0 rounded border border-input p-1 transition-colors hover:bg-muted"
                      aria-label={isChecked ? "Uncheck" : "Check"}
                    >
                      {isChecked ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={
                        isChecked
                          ? "text-muted-foreground line-through"
                          : undefined
                      }
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            {week.description ? (
              <p className="mt-4 pl-8 text-sm text-muted-foreground leading-relaxed">
                {week.description}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
