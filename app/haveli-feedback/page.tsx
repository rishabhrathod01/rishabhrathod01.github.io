"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HAVELI_FEEDBACK_SUBMISSION_URL,
  type HaveliFeedbackPayload,
} from "@/lib/haveliFeedbackForm";
import { Button } from "@/components/ui/button";

const FOOD_OPTIONS = [
  "Amazing",
  "Really good",
  "Good",
  "Okay",
  "Could be better",
  "Meh",
];

const WALK_OPTIONS = [
  "Loved it",
  "Nice",
  "Good",
  "Okay",
  "Could explore more",
  "Didn’t get to",
];

const PETS_OPTIONS = [
  "Cute overload",
  "Just right",
  "Loved them",
  "A bit much",
  "Too many",
  "No pets around",
];

const MONITOR_OPTIONS = [
  "Perfect setup",
  "Good",
  "Worked fine",
  "Okay",
  "Could be better",
  "Struggled",
];

const ENTERTAINMENT_OPTIONS = [
  "More than enough",
  "Good",
  "Enough",
  "Okay",
  "Could use more",
  "Limited",
];

const KITCHEN_OPTIONS = [
  "Perfect",
  "Great",
  "Good",
  "Okay",
  "Could be better",
  "Limited access",
];

// 8 reliable cute pet photos (Unsplash)
const CUTE_PET_PHOTOS = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583337130415-4b55b931b6eb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=300&fit=crop",
];

// Contextual messages when user gives a low (1–5) rating — different per question, random each time
const HARSH_MESSAGES: Record<string, string[]> = {
  hospitality: [
    "That score is… a bit harsh? Here’s a cute pet. Maybe bump it up a little? Please?",
    "My human tried their best as your roommate! Maybe a few more points?",
    "We promise the roommate will do better next time. Pretty please?",
    "That hurts! Here’s a sad pet. Consider rounding up?",
  ],
  cleanliness: [
    "But I tried so hard to keep it clean! 😿",
    "That score is… a bit harsh? I promise I’ll do better next time!",
    "Okay but the cat tried. Maybe one more point?",
    "I tried! Really! *sad cat noises*",
  ],
  princessTreatment: [
    "Princess treatment deserved more! Here’s a cat who thinks you’re royalty.",
    "That score is… a bit harsh? You deserve the world!",
    "We could’ve spoiled you more? Say it isn’t so!",
    "Not enough princess vibes? We’ll try harder — maybe bump the score?",
  ],
  affection: [
    "We love you! Doesn’t that count for a few more points?",
    "That score is… a bit harsh? Here’s some extra love from a cute pet.",
    "More affection points coming your way! Maybe bump the number too?",
    "But we tried to show we care! *puppy eyes*",
  ],
};

const initialFormState: HaveliFeedbackPayload = {
  hospitality: "",
  food: "",
  walkAroundStay: "",
  pets: "",
  monitor: "",
  entertainment: "",
  cleanliness: "",
  kitchen: "",
  princessTreatment: "",
  affection: "",
};

const inputStyles = {
  borderColor: "hsl(var(--input))",
  backgroundColor: "hsl(var(--background))",
};

function RatingSlider({
  value,
  onChange,
}: {
  value: number | "";
  onChange: (v: number) => void;
}) {
  const num = value === "" ? 5 : Number(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <input
          type="range"
          min={1}
          max={10}
          value={num}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 w-full cursor-pointer"
        />
        <span className="text-lg font-semibold tabular-nums w-8 text-right">
          {num}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10</p>
    </div>
  );
}

function OptionGrid({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              ...inputStyles,
              borderWidth: 2,
              borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--input))",
              backgroundColor: selected ? "hsl(var(--primary) / 0.1)" : undefined,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function HarshReaction({ fieldKey }: { fieldKey: string }) {
  const photoIndex = useMemo(
    () => Math.abs(fieldKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % CUTE_PET_PHOTOS.length,
    [fieldKey]
  );
  const photo = CUTE_PET_PHOTOS[photoIndex];

  const messages = HARSH_MESSAGES[fieldKey] ?? HARSH_MESSAGES.hospitality;
  const messageRef = useRef<string | null>(null);
  if (messageRef.current === null) {
    messageRef.current = messages[Math.floor(Math.random() * messages.length)];
  }
  const message = messageRef.current;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 rounded-xl overflow-hidden border"
      style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--muted))" }}
    >
      <div className="relative w-full aspect-[4/3] min-h-[200px] max-h-64 bg-muted/50 rounded-lg overflow-hidden">
        <Image
          src={photo}
          alt="Cute pet"
          fill
          className="object-contain"
          sizes="(max-width: 400px) 100vw, 400px"
        />
      </div>
      <p className="p-3 text-sm text-center font-medium">
        {message}
      </p>
    </motion.div>
  );
}

const PAGES: (keyof HaveliFeedbackPayload)[][] = [
  ["hospitality", "food"],
  ["walkAroundStay", "pets"],
  ["monitor", "entertainment"],
  ["cleanliness", "kitchen"],
  ["princessTreatment", "affection"],
];
const TOTAL_PAGES = PAGES.length;

export default function HaveliFeedbackPage() {
  const [form, setForm] = useState<HaveliFeedbackPayload>(initialFormState);
  const [currentPage, setCurrentPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof HaveliFeedbackPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const isLowRating = (v: string | number) => {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    return !isNaN(n) && n >= 1 && n <= 5;
  };

  const showHarshHospitality = isLowRating(form.hospitality);
  const showHarshCleanliness = isLowRating(form.cleanliness);
  const showHarshPrincess = isLowRating(form.princessTreatment);
  const showHarshAffection = isLowRating(form.affection);

  const isFormComplete =
    form.hospitality !== "" &&
    form.food !== "" &&
    form.walkAroundStay !== "" &&
    form.pets !== "" &&
    form.monitor !== "" &&
    form.entertainment !== "" &&
    form.cleanliness !== "" &&
    form.kitchen !== "" &&
    form.princessTreatment !== "" &&
    form.affection !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || submitting) return;
    doSubmit();
  };

  const doSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const payload = {
      hospitality: form.hospitality === "" ? "" : Number(form.hospitality),
      food: String(form.food ?? ""),
      walkAroundStay: String(form.walkAroundStay ?? ""),
      pets: String(form.pets ?? ""),
      monitor: String(form.monitor ?? ""),
      entertainment: String(form.entertainment ?? ""),
      cleanliness:
        form.cleanliness === ""
          ? ""
          : typeof form.cleanliness === "number"
            ? form.cleanliness
            : Number(form.cleanliness) || form.cleanliness,
      kitchen: String(form.kitchen ?? ""),
      princessTreatment:
        form.princessTreatment === "" ? "" : Number(form.princessTreatment),
      affection: form.affection === "" ? "" : Number(form.affection),
    };

    try {
      await fetch(HAVELI_FEEDBACK_SUBMISSION_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="haveli-feedback-page min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: "hsl(var(--card))" }}
          >
            <h2 className="text-2xl font-bold mb-2">Thanks for your feedback!</h2>
            <p className="text-muted-foreground">
              Your response has been recorded. We hope you had a lovely stay.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const sectionStyle = {
    borderColor: "hsl(var(--border))",
    backgroundColor: "hsl(var(--card))",
  };

  return (
    <div className="haveli-feedback-page min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            How was your stay?
          </h1>
          <p className="text-muted-foreground">
            ~1.5 days at the haveli — we’d love your honest feedback.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <p className="text-center text-sm text-muted-foreground">
            Page {currentPage + 1} of {TOTAL_PAGES}
          </p>

          <AnimatePresence mode="wait">
            {currentPage === 0 && (
              <motion.div
                key="page-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Hospitality by your roommate
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    How was the hospitality? (1 = meh, 10 = best host ever)
                  </p>
                  <RatingSlider
                    value={form.hospitality}
                    onChange={(v) => update("hospitality", v)}
                  />
                  <AnimatePresence>
                    {showHarshHospitality && (
                      <HarshReaction key="hospitality" fieldKey="hospitality" />
                    )}
                  </AnimatePresence>
                </section>
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">Food</label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Taste, variety, timing
                  </p>
                  <OptionGrid
                    value={form.food}
                    options={FOOD_OPTIONS}
                    onChange={(v) => update("food", v)}
                  />
                </section>
              </motion.div>
            )}
            {currentPage === 1 && (
              <motion.div
                key="page-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Walk around the stay
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    How did you like the area?
                  </p>
                  <OptionGrid
                    value={form.walkAroundStay}
                    options={WALK_OPTIONS}
                    onChange={(v) => update("walkAroundStay", v)}
                  />
                </section>
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">Pets</label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Cute overload, too much, or just right?
                  </p>
                  <OptionGrid
                    value={form.pets}
                    options={PETS_OPTIONS}
                    onChange={(v) => update("pets", v)}
                  />
                </section>
              </motion.div>
            )}
            {currentPage === 2 && (
              <motion.div
                key="page-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Working with monitor
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Setup, space, anything that could be better?
                  </p>
                  <OptionGrid
                    value={form.monitor}
                    options={MONITOR_OPTIONS}
                    onChange={(v) => update("monitor", v)}
                  />
                </section>
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Entertainment (e.g. TV)
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Enough to unwind?
                  </p>
                  <OptionGrid
                    value={form.entertainment}
                    options={ENTERTAINMENT_OPTIONS}
                    onChange={(v) => update("entertainment", v)}
                  />
                </section>
              </motion.div>
            )}
            {currentPage === 3 && (
              <motion.div
                key="page-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Cleanliness
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Room, common areas, bathroom (1–10)
                  </p>
                  <RatingSlider
                    value={
                      form.cleanliness === ""
                        ? ""
                        : typeof form.cleanliness === "number"
                          ? form.cleanliness
                          : Number(form.cleanliness) || ""
                    }
                    onChange={(v) => update("cleanliness", v)}
                  />
                  <AnimatePresence>
                    {showHarshCleanliness && (
                      <HarshReaction key="cleanliness" fieldKey="cleanliness" />
                    )}
                  </AnimatePresence>
                </section>
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Kitchen access
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Easy to use? Missing something?
                  </p>
                  <OptionGrid
                    value={form.kitchen}
                    options={KITCHEN_OPTIONS}
                    onChange={(v) => update("kitchen", v)}
                  />
                </section>
              </motion.div>
            )}
            {currentPage === 4 && (
              <motion.div
                key="page-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Princess treatment
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    Rate your princess treatment (1–10)
                  </p>
                  <RatingSlider
                    value={form.princessTreatment}
                    onChange={(v) => update("princessTreatment", v)}
                  />
                  <AnimatePresence>
                    {showHarshPrincess && (
                      <HarshReaction key="princessTreatment" fieldKey="princessTreatment" />
                    )}
                  </AnimatePresence>
                </section>
                <section className="rounded-xl p-6 border" style={sectionStyle}>
                  <label className="block text-sm font-medium mb-2">
                    Affection points
                  </label>
                  <p className="text-muted-foreground text-sm mb-3">
                    How loved did you feel? (1–10)
                  </p>
                  <RatingSlider
                    value={form.affection}
                    onChange={(v) => update("affection", v)}
                  />
                  <AnimatePresence>
                    {showHarshAffection && (
                      <HarshReaction key="affection" fieldKey="affection" />
                    )}
                  </AnimatePresence>
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="w-24">
              {currentPage > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
              ) : null}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {TOTAL_PAGES}
            </span>
            <div className="w-24 flex justify-end">
              {currentPage < TOTAL_PAGES - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting || !isFormComplete}
                >
                  {submitting ? "Submitting…" : "Submit feedback"}
                </Button>
              )}
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
