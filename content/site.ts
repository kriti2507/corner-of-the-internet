/**
 * Edit this file to change copy, links, and placeholders.
 * Hike and book logs live in data/hikes.json and data/books.json.
 *
 * Email is still a placeholder. GitHub and LinkedIn are Kriti's real profiles.
 * There is no top ticker — she asked for it to be removed.
 */

export type Mark = "pink" | "yellow" | "green" | "blue";

export type LeadPart = { text: string; mark?: Mark };

export const site = {
  name: "Kriti Agarwal",
  description:
    "Kriti Agarwal builds AI products at Sakana in Tokyo, writes AI Noodle, hosts Women in AI Tokyo, and logs small wins from the mountains.",
  /**
   * PLACEHOLDER — replace with Kriti's real address when she has one.
   * The footer and the contact fallback both read this value.
   */
  email: "hello@yourdomain.com",
  emailIsPlaceholder: true,

  /**
   * Work, meetups, and projects jump to home sections.
   * Writing, hikes, and coffee are the only deeper pages.
   */
  nav: [
    { id: "work", label: "Work", href: "/#work" },
    { id: "writing", label: "Writing", href: "/writing" },
    { id: "community", label: "Meetups", href: "/#community" },
    { id: "hikes", label: "Hikes", href: "/hikes" },
    { id: "projects", label: "Projects", href: "/#projects" },
    { id: "coffee", label: "Coffee", href: "/coffee" },
    { id: "note", label: "Say hi", href: "/#note" },
  ],

  /**
   * Titles and descriptions for each shareable page.
   * The document title template in the root layout adds " · Kriti Agarwal".
   */
  pages: {
    writing: {
      title: "Writing",
      path: "/writing",
      description:
        "AI Noodle: growing up alongside AI, from someone who builds it. Letters out Saturday mornings, Tokyo time.",
    },
    hikes: {
      title: "Hikes",
      path: "/hikes",
      description:
        "Trails from the hike log, mostly Hokkaido and the ridges around Tokyo, and the books on the shelf.",
    },
    coffee: {
      title: "Coffee",
      path: "/coffee",
      description:
        "Placeholder cafés Kriti will fill in, plus Japanese study, notebooks, Tokyo, and the mountains.",
    },
  },

  hero: {
    greeting: "hello from Tokyo ↓",
    monogram: "Kriti",
    lead: [
      { text: "I build AI products " },
      { text: "at Sakana", mark: "pink" },
      { text: ", " },
      { text: "write AI Noodle", mark: "yellow" },
      { text: ", " },
      { text: "host Women in AI Tokyo", mark: "green" },
      { text: " and " },
      { text: "collect small wins", mark: "blue" },
      { text: " — on mountains, in notebooks, in code." },
    ] as LeadPart[],
    actions: [
      { label: "Say hello", href: "/#note", variant: "ink" as const },
      { label: "Next meetup →", href: "/#community", variant: "ghost" as const },
      { label: "Work with me", href: "/#note", variant: "yellow" as const },
    ],
  },

  /**
   * Drop files in /public and set these paths, e.g. "/photos/mountain.jpg".
   * Null keeps the drawn placeholder.
   */
  photos: {
    mountain: null as string | null,
    mountainAlt: "Kriti on a mountain",
    mira: null as string | null,
    miraAlt: "Mira, the illustration from AI Noodle",
  },

  polaroids: {
    mountain: {
      caption: "[you, on a mountain]",
      script: "that's me",
      where: "[where + when]",
    },
    mira: {
      caption: "[Mira illustration from AI Noodle]",
    },
    dragHint: "drag the photos",
  },

  /**
   * The public Luma feed does not include capacity.
   * "~20 seats" is Kriti's note, not a number scraped from the calendar.
   */
  meetup: {
    kicker: "Next meetup",
    seatsLabel: "~20 seats",
    fallbackMonth: "Nov",
    fallbackYear: "’26",
  },

  upTo: {
    title: "What I'm up to",
    aside: "(lately)",
    cards: [
      {
        index: "01",
        kicker: "Day job",
        tone: "blue" as const,
        tilt: "1",
        title: "The agent inside Sakana Chat",
        body: "Tool calling, code sandboxes, skills — plus Sakana Translate.",
        href: "/#work",
        link: "More on work →",
      },
      {
        index: "02",
        kicker: "Weekends",
        tone: "pink" as const,
        tilt: "2",
        title: "AI Noodle",
        body: "Growing up alongside AI, from someone who builds it. Out Saturday mornings, Tokyo time.",
        href: "/writing",
        link: "Read the latest →",
      },
      {
        index: "03",
        kicker: "Shipping",
        tone: "yellow" as const,
        tilt: "3",
        title: "Small Wins",
        body: "Log one small win a day. Free in November, with a 30-day challenge.",
        href: "/#projects",
        link: "Join the challenge →",
      },
      {
        index: "04",
        kicker: "Monthly",
        tone: "green" as const,
        tilt: "4",
        title: "Women in AI, Tokyo",
        body: "A cafe, a question, about twenty of us. First table: late November.",
        href: "/#community",
        link: "Save a seat →",
      },
      {
        index: "05",
        kicker: "Consulting",
        tone: "peach" as const,
        tilt: "5",
        title: "Work with me",
        body: "I consult for businesses on AI products and agents — a workflow you already run, or a tool-using agent your team can keep.",
        href: "/#note",
        link: "Book a call →",
      },
    ],
  },

  work: {
    kicker: "day job",
    title: "The agent inside Sakana Chat",
    lede: "I build AI products at Sakana in Tokyo. The day job is the agent in Sakana Chat, and Sakana Translate beside it.",
    points: [
      {
        title: "Tool calling",
        body: "The agent can reach for a tool instead of inventing an answer it does not have.",
      },
      {
        title: "Code sandboxes",
        body: "When the answer has to be computed, it can run code in a sandbox.",
      },
      {
        title: "Skills",
        body: "Repeatable skills for the kinds of jobs people actually bring to the chat.",
      },
      {
        title: "Sakana Translate",
        body: "Translate, proofread, and ask — across Japanese, English, and Chinese.",
      },
    ],
    links: [
      { label: "Sakana", href: "https://sakana.ai" },
      { label: "Sakana Chat", href: "https://chat.sakana.ai" },
      { label: "Sakana Translate", href: "https://translate.sakana.ai" },
    ],
  },

  writing: {
    kicker: "weekends",
    title: "AI Noodle",
    lede: "Growing up alongside AI, from someone who builds it. Out Saturday mornings, Tokyo time.",
    /** Verified publication feed. theainoodle.substack.com redirects to her profile. */
    feedUrl: "https://unplannedwriter.substack.com/feed",
    publicationUrl: "https://unplannedwriter.substack.com",
    profileUrl: "https://substack.com/@theainoodle",
    publicationName: "The AI Noodle",
    allLabel: "All the letters →",
    seeAll: "See all the letters →",
    fallbackNote:
      "The live feed didn't answer, so these are saved copies of recent letters.",
    fallbackPosts: [
      {
        title: "i debugged my fear of betting on myself.",
        url: "https://unplannedwriter.substack.com/p/i-debugged-my-fear-of-betting-on",
        date: "2026-10-31T21:24:41.000Z",
        excerpt:
          "“i'm still learning,” “i'm too busy right now,” and every other story my brain tells me.",
      },
      {
        title: "is claude the new instagram?",
        url: "https://unplannedwriter.substack.com/p/is-claude-the-new-instagram",
        date: "2026-10-17T00:00:00.000Z",
        excerpt: "",
      },
      {
        title: "between vibe coding and agentic engineering...",
        url: "https://unplannedwriter.substack.com/p/everyone-can-start-almost-nobody",
        date: "2026-09-12T00:00:00.000Z",
        excerpt: "",
      },
      {
        title:
          "Vibe Check #3: Your App Doesn't Need a 50-Page Spec. It Needs This.",
        url: "https://unplannedwriter.substack.com/p/vibe-check-3-product-documentation",
        date: "2026-05-12T00:00:00.000Z",
        excerpt: "",
      },
    ],
  },

  projects: {
    kicker: "shipping",
    title: "Small Wins",
    lede: "Log one small win a day. Free in November, with a 30-day challenge.",
    /**
     * Public app URL, when there is one. Null hides the outbound link
     * so the site never points at a guess.
     */
    url: null as string | null,
    points: [
      "One entry a day — a hike, a page, a fix, a table you hosted.",
      "Free through November.",
      "A 30-day challenge if you want the streak more than the speech.",
    ],
    note: "The hike log and the bookshelf are the same habit, on their own page.",
    cta: { label: "Count me in →", href: "/#note" },
    others: [
      {
        kicker: "Field notes",
        tone: "blue" as const,
        tilt: "1",
        title: "Mountains and the shelf",
        body: "The hike log and the books. The same small-wins habit, with a map and a shelf of their own.",
        href: "/hikes",
        link: "See the trails →",
      },
    ],
  },

  community: {
    kicker: "monthly",
    title: "Women in AI, Tokyo",
    lede: "A cafe, a question, about twenty of us. The next table is whatever the public calendar says.",
    calendarUrl: "https://luma.com/calendar/cal-SGe7q4ZRJ8WRTcv",
    /** Public iCal. Confirmed: returns text/calendar for Women x Tech. */
    icsUrl:
      "https://api.lu.ma/ics/get?entity=calendar&id=cal-SGe7q4ZRJ8WRTcv",
    calendarLabel: "The calendar →",
    saveLabel: "Save a seat →",
    pastTitle: "Earlier tables",
    pastLink: "See the page →",
    empty: "The next table isn't posted yet. The calendar is the place to watch.",
    fallbackNote: "The live calendar didn't answer, so this is the last table I saved.",
    fallbackEvents: [
      {
        id: "evt-fallback-nov29",
        title: "Women x Tech · Tokyo · Connections over Matcha",
        start: "2026-11-29T04:00:00.000Z",
        end: "2026-11-29T05:30:00.000Z",
        location: "Chotto Matcha - Asakusa, Taito City, Tokyo",
        url: "https://luma.com/o8hbo3l8",
      },
    ],
  },

  hikes: {
    kicker: "field notes",
    title: "On the mountains",
    lede: "Trails from the hike log — mostly Hokkaido, and the ridges around Tokyo. Tap a peak or a bar.",
    previewLede: "Mostly Hokkaido, and the ridges around Tokyo. Tap a pin.",
    moreLabel: "See the map and the shelf →",
    mapLabel: "Japan, north up. Pins are placed by hand.",
    approxNote: "This pin is approximate.",
  },

  /**
   * Coordinates are not in the log. Keyed by hike title so a future API
   * can replace the JSON without losing the map.
   */
  hikePins: {
    Maruyama: { lat: 43.054, lng: 141.318 },
    Shiripayama: { lat: 43.24, lng: 140.79 },
    Takaosan: { lat: 35.625, lng: 139.243 },
    Tsukubasan: { lat: 36.226, lng: 140.107 },
    Akabokko: { lat: 35.776, lng: 139.259 },
    Kinpusan: { lat: 35.872, lng: 138.625 },
    Iwanaidake: { lat: 42.956, lng: 140.548 },
    "Mt Oyama": { lat: 35.441, lng: 139.231 },
    Mitake: { lat: 35.783, lng: 139.152 },
    "Shioya Maruyama": { lat: 43.21, lng: 140.94 },
    Ashibetsu: { lat: 43.236, lng: 142.284 },
    Nokogiriyama: { lat: 35.16, lng: 139.826 },
    Nekodake: { lat: 36.104, lng: 138.271 },
    Yoteizan: { lat: 42.827, lng: 140.811 },
    Asahidake: { lat: 43.664, lng: 142.854 },
    Eniwadake: { lat: 42.793, lng: 141.285 },
    Takimidai: { lat: 42.97, lng: 141.15, approximate: true },
    Hakkenzan: { lat: 42.96, lng: 141.225 },
    "Mt Chausu": { lat: 37.123, lng: 139.963 },
    Tonodake: { lat: 35.487, lng: 139.147 },
    Jinbasan: { lat: 35.701, lng: 139.155 },
  } as Record<string, { lat: number; lng: number; approximate?: boolean }>,

  books: {
    kicker: "notebook",
    title: "The shelf",
    lede: "Books from the log. Pull one out.",
    readLabel: "Logged",
  },

  cafes: {
    kicker: "placeholder",
    title: "Cafés",
    lede: "A corner for counters and coffee. These cards are placeholders — the names are not real yet.",
    places: [
      {
        name: "[café name]",
        area: "[neighborhood, Tokyo]",
        note: "Placeholder. Not a real café yet.",
      },
      {
        name: "[café name]",
        area: "[neighborhood, Tokyo]",
        note: "Placeholder. A real order and a real note will land here.",
      },
      {
        name: "[café name]",
        area: "[on the way to a trail]",
        note: "Placeholder. Nothing here is a recommendation yet.",
      },
    ],
  },

  about: {
    kicker: "a person",
    title: "Not a résumé",
    paragraphs: [
      "I live in Tokyo and build AI products at Sakana. On Saturday mornings I publish AI Noodle — growing up alongside AI, from someone who builds it.",
      "Once a month I host a table for women in AI. Between the product and the table, I am on a mountain, in a notebook, or writing down one small win so the day does not disappear.",
      "Japanese study sits in the margins. JLPT N1 is in progress.",
    ],
    facts: ["Tokyo", "Sakana AI", "AI Noodle", "Women in AI"],
  },

  consulting: {
    kicker: "consulting",
    title: "Work with me",
    lede: "I consult for businesses on AI products and agents — a workflow you already run, or a tool-using agent your team can keep. Send a note and I'll write back about a call.",
    cta: { label: "Work with me", href: "/#note" },
  },

  coffee: {
    kicker: "a corner",
    title: "Coffee and the rest",
    lede: "Counters, a language in the margins, and the other things that don't fit on a résumé. These café cards are placeholders — the names are not real yet.",
    teaserTitle: "Coffee and other interests",
    teaserLede: "The café names are still placeholders. The rest is Japanese study, notebooks, and the city between the trails.",
    seeAll: "See the corner →",
    ticketKicker: "on the ticket",
    interestsKicker: "besides",
    interestsTitle: "Other interests",
    interestsLede:
      "Japanese study sits in the margins. Between the product and the table, I am on a mountain, in a notebook, or writing down one small win.",
    interests: [
      {
        kicker: "Language",
        tone: "yellow" as const,
        tilt: "2",
        title: "Japanese",
        body: "JLPT N1 is in progress. Study sits in the margins.",
      },
      {
        kicker: "Notebook",
        tone: "pink" as const,
        tilt: "3",
        title: "One small win",
        body: "Written down so the day does not disappear.",
      },
      {
        kicker: "City",
        tone: "blue" as const,
        tilt: "1",
        title: "Tokyo",
        body: "Tables, trails, and the walk between them.",
      },
      {
        kicker: "Ridges",
        tone: "green" as const,
        tilt: "4",
        title: "Mountains",
        body: "Mostly Hokkaido, and the hills around the city.",
        href: "/hikes",
        link: "See the trails →",
      },
    ],
  },

  contact: {
    kicker: "a note",
    title: "Write me a note",
    lede: "Tell me what you are trying to ship, or just say hello.",
    services: [
      {
        title: "AI products",
        body: "A workflow your team already runs, shaped into something people open on a Tuesday.",
      },
      {
        title: "Agents",
        body: "Tools, sandboxes, and skills — and a clear edge for what the agent should not do.",
      },
      {
        title: "A working session",
        body: "With the people who will keep it after the call, not a deck that leaves with me.",
      },
    ],
    topics: [
      { value: "product", label: "An AI product" },
      { value: "agent", label: "An agent for my team" },
      { value: "workshop", label: "A working session" },
      { value: "hello", label: "Just saying hello" },
    ],
    submit: "Send the note",
    sending: "Sending…",
    successTitle: "Got it.",
    successBody: "I'll write back soon.",
    errorFallback: "That didn't send. Email me and I'll pick it up there.",
  },

  footer: {
    prompt: "write me a note —",
    links: [
      { label: "Substack", href: "https://unplannedwriter.substack.com" },
      { label: "GitHub", href: "https://github.com/kriti2507" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/kriti-agarwal2507/",
      },
      {
        label: "Luma",
        href: "https://luma.com/calendar/cal-SGe7q4ZRJ8WRTcv",
      },
    ],
  },
} as const;

export type Post = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string | null;
  location: string;
  url: string;
};
