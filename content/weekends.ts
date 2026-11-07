/**
 * Copy for the Weekends block on the home page, the /weekends hub,
 * and the four lanes: hikes, reading, places and Japanese.
 *
 * Hikes and books come from data/hikes.json and data/books.json.
 * Places come from content/places.ts. The Japanese lane is written here.
 */

export type LaneId = "hikes" | "reading" | "places" | "japanese";

export const weekends = {
  kicker: "off the clock",
  title: "Weekends",
  lede: "Mountains, books, cafés and Japanese. What I do when I'm not building.",
  seeAll: "The whole weekend log →",

  lanes: {
    hikes: {
      label: "Hikes",
      mark: "山",
      markReading: "yama, mountain",
      href: "/hikes",
      link: "All the hikes →",
      blurb: "Every trail from the log, on a map, with the metres climbed.",
    },
    reading: {
      label: "Reading",
      mark: "本",
      markReading: "hon, book",
      href: "/books",
      link: "The bookshelf →",
      blurb: "What I read this year, in order, with a page for each book.",
    },
    places: {
      label: "Places",
      mark: "旅",
      markReading: "tabi, travel",
      href: "/places",
      link: "All the places →",
      blurb: "Cafés, matcha, onsen, gardens and trips around Japan, with my own notes.",
    },
    japanese: {
      label: "Japanese",
      mark: "語",
      markReading: "go, language",
      href: "/japanese",
      link: "Where my Japanese is →",
      blurb: "Where my Japanese is, how I study, and words I picked up on the weekends.",
    },
  } satisfies Record<LaneId, { label: string; mark: string; markReading: string; href: string; link: string; blurb: string }>,

  /** The place shown on the home card. Pick any slug from content/places.ts. */
  featuredPlace: "miyano-yu",
  /** The word shown on the home card. Pick any `ja` from japanese.words below. */
  featuredWord: "雲海",
};

export const japanese = {
  kicker: "in the margins",
  title: "Japanese",
  lede: "Japanese runs through every weekend: trail signs, café menus, onsen rules. This is where my study is at.",
  /** JLPT levels, easiest first. `status` is done, next or ahead. */
  levels: [
    { id: "N5", status: "done" },
    { id: "N4", status: "done" },
    { id: "N3", status: "done" },
    { id: "N2", status: "done" },
    { id: "N1", status: "next" },
  ] as { id: string; status: "done" | "next" | "ahead" }[],
  current: "N2",
  currentNote: "passed",
  next: "N1",
  nextNote: "aiming for July 2027",
  status: [
    "N2 is done. I sat N1 in July 2026 as a level check, and it showed me where the work is: reading nuance and listening.",
    "The next real attempt is July 2027.",
  ],
  studyTitle: "How I study now",
  study: [
    { title: "Podcasts", body: "Most of my new words come from Japanese podcasts." },
    { title: "Kanji and reading", body: "Back through N2 kanji and reading before N1 material." },
    { title: "The weekends", body: "Trail signs, café menus and onsen rules are reading practice too." },
  ],
  wordsTitle: "Words from the weekends",
  wordsLede: "Words I keep meeting on trails, in cafés and in bookshops.",
  words: [
    { ja: "雲海", kana: "うんかい", romaji: "unkai", en: "a sea of clouds, seen from above", lane: "places" },
    { ja: "山小屋", kana: "やまごや", romaji: "yamagoya", en: "mountain hut", lane: "hikes" },
    { ja: "登山口", kana: "とざんぐち", romaji: "tozanguchi", en: "trailhead", lane: "hikes" },
    { ja: "頂上", kana: "ちょうじょう", romaji: "chōjō", en: "summit", lane: "hikes" },
    { ja: "百名山", kana: "ひゃくめいざん", romaji: "hyakumeizan", en: "Japan's 100 famous mountains", lane: "hikes" },
    { ja: "抹茶", kana: "まっちゃ", romaji: "matcha", en: "powdered green tea", lane: "places" },
    { ja: "露天風呂", kana: "ろてんぶろ", romaji: "rotenburo", en: "outdoor bath", lane: "places" },
    { ja: "古本屋", kana: "ふるほんや", romaji: "furuhon'ya", en: "second-hand bookshop", lane: "reading" },
    { ja: "読書", kana: "どくしょ", romaji: "dokusho", en: "reading", lane: "reading" },
    { ja: "桜", kana: "さくら", romaji: "sakura", en: "cherry blossom", lane: "places" },
  ] as { ja: string; kana: string; romaji: string; en: string; lane: LaneId }[],
};
