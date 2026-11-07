/**
 * The Small Wins first screen, mirrored for the marketing page.
 *
 * Copied from the app (github.com/kriti2507/small-wins):
 *   frontend/src/lib/starterTopics.ts  — STARTER_TOPICS, MAX_STARTERS, previewShades
 *   frontend/src/lib/palette.ts        — PALETTES (5 shades, light → dark)
 * Keep these in step with the app when the starters change.
 */

export const PALETTES = {
  green: ["#e0eed6", "#b5d9a0", "#8cc46c", "#5fa03e", "#417328"],
  blue: ["#dbe7f2", "#a9c8e3", "#7aa9cf", "#5386b3", "#3a6389"],
  orange: ["#f6e3d1", "#eec09a", "#e09a63", "#c97a40", "#9e5c2c"],
  purple: ["#e9e0f2", "#cbb5e3", "#a984cf", "#835bab", "#5f3f80"],
  teal: ["#d6ece8", "#a3d4cb", "#6fb8ab", "#479488", "#2f6e64"],
  rose: ["#f5dde4", "#e5afc0", "#d1839c", "#b35d7a", "#8a4159"],
  amber: ["#f6ead0", "#e9cf97", "#d9b160", "#b98f39", "#8d6b27"],
  indigo: ["#dfe1f0", "#b3b8dd", "#8890c6", "#6570ab", "#474f85"],
  lime: ["#e9f0d2", "#cfdf9e", "#b0c968", "#8fa843", "#6a7d2f"],
} as const;

export type PaletteId = keyof typeof PALETTES;

export type Starter = {
  name: string;
  color: PaletteId;
  icon: string;
  hint: string;
  /** The number field the starter comes with, if any. Every starter also has a Title. */
  measure: string | null;
};

export const MAX_STARTERS = 3;

export const STARTERS: Starter[] = [
  { name: "Workout", color: "green", icon: "🏃", hint: "e.g. a 30 min run", measure: "Duration (min)" },
  { name: "Journal", color: "purple", icon: "📓", hint: "a few lines a day", measure: null },
  { name: "Reading", color: "blue", icon: "📚", hint: "pages you read", measure: "Pages" },
  { name: "Meditation", color: "teal", icon: "🧘", hint: "minutes of calm", measure: "Minutes" },
  { name: "Sleep", color: "indigo", icon: "🌙", hint: "hours you slept", measure: "Hours" },
  { name: "Learning", color: "amber", icon: "💡", hint: "time spent learning", measure: "Minutes" },
  { name: "Gratitude", color: "rose", icon: "🌷", hint: "one good thing", measure: null },
  { name: "Cooking", color: "orange", icon: "🍳", hint: "meals you made", measure: null },
  { name: "Walk", color: "lime", icon: "👣", hint: "steps outside", measure: "Steps" },
];

/** Days in the sample capsule (two rows of a fortnight), as in the app. */
export const PREVIEW_DAYS = 28;

/** The app's made-up but stable shades: -1 for an empty day, else 0–4. */
export function previewShades(name: string): number[] {
  let seed = 0;
  for (const ch of name) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({ length: PREVIEW_DAYS }, () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const r = seed / 2 ** 32;
    return r < 0.3 ? -1 : Math.min(4, Math.floor(((r - 0.3) / 0.7) * 5));
  });
}
