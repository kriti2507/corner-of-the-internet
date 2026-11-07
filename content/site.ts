/**
 * Edit this file to change copy, links, and placeholders.
 * Hike and book logs live in data/hikes.json and data/books.json.
 * Weekends copy (hikes, reading, places, Japanese) lives in content/weekends.ts,
 * and the places themselves in content/places.ts.
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
   * Home blocks are anchors so the highlight can follow the scroll.
   * About is linked from the Work with me block, not the nav.
   */
  nav: [
    { id: "sakana", label: "Sakana", href: "/#sakana" },
    { id: "writing", label: "AI Noodle", href: "/#writing" },
    { id: "community", label: "Community", href: "/#community" },
    { id: "weekends", label: "Weekends", href: "/#weekends" },
    { id: "small-wins", label: "Small Wins", href: "/#small-wins" },
    { id: "work-with-me", label: "Work with me", href: "/#work-with-me" },
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
        "AI Noodle from Substack, and notes on this site that can point at a café, a book, or a hike.",
    },
    blog: {
      title: "Journal",
      path: "/blog",
      description: "Notes on this site. Some are samples. A file can also point at a Substack letter.",
    },
    books: {
      title: "Reading",
      path: "/books",
      description: "Every book Kriti has read this year, newest first, with a page for each.",
    },
    about: {
      title: "About",
      path: "/about",
      description:
        "Kriti Agarwal builds AI products at Sakana in Tokyo, writes AI Noodle, hosts Women in AI/Tech Tokyo, and is building Small Wins.",
    },
    hikes: {
      title: "Hikes",
      path: "/hikes",
      description:
        "Every hike from Kriti's log on a map of Japan, mostly Hokkaido and the ridges around Tokyo, with metres climbed and time on the trail.",
    },
    smallWins: {
      title: "Small Wins",
      path: "/small-wins",
      description:
        "Small Wins is a little diary for the good things. Log one small win a day, in early access. Sign in with Google — only you can see it.",
    },
    weekends: {
      title: "Weekends",
      path: "/weekends",
      description: "Kriti's weekends: hikes across Japan, the books she reads, cafés, matcha and onsen she has been to, and her Japanese study.",
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
    /**
     * Hidden under the two hero photos. Placeholders only — no real codes.
     * Order matches the photos: mountain, then Mira.
     * Each item is { title, body, cta?: { label, href } }.
     */
    secretFound: "You found a secret",
    secrets: [
      {
        title: "Secret perk #1 — placeholder",
        body: "Add your perk here (e.g. a discount code, a free coffee chat, an early-access invite).",
      },
      {
        title: "Secret perk #2 — placeholder",
        body: "Add your perk here. Leave the link off until you have a real one.",
        cta: { label: "Placeholder — add a link", href: "/about" },
      },
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
    kicker: "Community",
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
    kicker: "Sakana",
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
    kicker: "letters",
    title: "AI Noodle",
    lede: "Growing up alongside AI, from someone who builds it. Out Saturday mornings, Tokyo time.",
    /** Verified publication feed. theainoodle.substack.com redirects to her profile. */
    feedUrl: "https://unplannedwriter.substack.com/feed",
    publicationUrl: "https://unplannedwriter.substack.com",
    profileUrl: "https://substack.com/@theainoodle",
    publicationName: "The AI Noodle",
    allLabel: "All the letters →",
    seeAll: "See all the letters →",
    filters: { all: "All", site: "On this site", noodle: "AI Noodle" },
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
    kicker: "beta",
    title: "Small Wins",
    lede: "A little diary for the good things. Log one small win a day.",
    /**
     * Public app URL, when there is one. Null hides the outbound link
     * so the site never points at a guess.
     */
    url: null as string | null,
    points: [
      "One entry a day — a hike, a page, a fix, a conversation.",
      "Each part of life fills in on its own colour.",
      "Early access. Sign in with Google, and only you can see it.",
    ],
    note: "The hike log and the bookshelf on this site are slices of that same habit.",
    cta: { label: "See Small Wins →", href: "/small-wins" },
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

  /**
   * Product introduction for Small Wins. Not a setup guide.
   * The live app signs in with Google.
   */
  smallWins: {
    kicker: "early access",
    title: "Small Wins",
    pitch: "A little diary for the good things.",
    lede: "Log one small win a day and watch each part of your life fill in. Setup takes about two minutes.",
    privacy: "Sign in with Google. Only you can see what you log.",
    tryLabel: "Try the beta",
    startLabel: "Start logging wins",
    url: "https://small-wins-live.vercel.app/",
    sampleNote: "A sample grid, not a real diary. Darker squares are bigger wins.",
    ranges: ["30d", "90d", "1y", "All"],
    features: [
      {
        kicker: "time capsule",
        title: "Your month at a glance",
        body: "Each coloured square is a win from that day. Darker squares are bigger wins — a longer workout, a further hike. Zoom from thirty days out to a year, or the whole log, and look back at past months.",
        image: "/small-wins/time-capsule.png",
        width: 780,
        height: 1632,
        alt: "Small Wins Time Capsule for a month, with green and purple squares on the days a win was logged.",
      },
      {
        kicker: "aspects",
        title: "The parts of life you track",
        body: "You start with Workout and Journal. Add your own — Hikes, Books, Runs — with a name, a colour, and fields such as Distance (km) or Pages. Number fields can shade higher-is-better or lower-is-better, so the grid knows what a big win is.",
        image: "/small-wins/aspects.png",
        width: 780,
        height: 1340,
        alt: "Workout and Journal tiles, each filled with a grid of coloured squares.",
      },
      {
        kicker: "the entry",
        title: "A photo, and the story if you want it",
        body: "One entry a day is the habit. A twenty-minute walk counts. Add a photo, and write the story when a hike, a trip, or a book is worth more than the number.",
        image: "/small-wins/story.png",
        width: 780,
        height: 1688,
        alt: "A hike entry titled Mt. Tanzawa, with a photo, the distance, and a short story.",
      },
      {
        kicker: "over time",
        title: "The empty grid turns into a picture",
        body: "Every entry fills a square. A couple of weeks in, most of the grid is still quiet. A few months in, it holds a shape. Switch 30d, 90d, 1y, and All to zoom.",
        image: "/small-wins/grow.png",
        width: 1808,
        height: 722,
        alt: "The same Workout grid after two weeks, mostly empty, and after three months, filled in with greens.",
        wide: true,
      },
    ],
    phone: {
      kicker: "on your phone",
      title: "It lives on your home screen",
      body: "Small Wins is a web app. Add it to your home screen on iPhone or Android and it opens full screen from its own icon. No App Store.",
      image: "/small-wins/phone.png",
      width: 500,
      height: 1116,
      alt: "A phone home screen with the Small Wins icon among the other apps.",
    },
    chat: {
      kicker: "from a chat",
      title: "Log a win by talking to Claude or ChatGPT",
      body: "If you already talk to Claude or ChatGPT, you can log from the conversation. In Small Wins, open your account menu and go to Connected apps for the link.",
    },
    faqTitle: "Before you start",
    faq: [
      {
        q: "Is it private?",
        a: "Yes. You sign in with Google, and only you can see your wins.",
      },
      {
        q: "Is it free?",
        a: "It's in beta — early access. This page doesn't list a price.",
      },
      {
        q: "Do I need the App Store?",
        a: "No. Open it in the browser, then add it to your home screen on iPhone or Android.",
      },
    ],
    closingKicker: "two minutes",
    closingTitle: "One small win a day",
    closingLede: "Set it up, log something small, and let the grid fill in.",
  },

  community: {
    kicker: "community",
    title: "Women in AI/Tech Tokyo",
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
    emptyNotes: "No notes point at this book yet.",
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
    title: "Let's talk",
    lede: "I consult for businesses on AI products and agents — a workflow you already run, or a tool-using agent your team can keep. Send a message and I'll write back about a call.",
    aboutCta: { label: "About me", href: "/about" },
  },



  blog: {
    kicker: "journal",
    title: "Notes",
    lede: "Files in this repo. A sample is marked. A file can also point at a Substack letter without pasting it here.",
    empty: "No notes yet.",
    externalLabel: "Read it on Substack →",
    mentions: "Mentioned here",
    noMentions: "This note does not point at a café, a book, or a hike.",
  },

  tags: {
    kicker: "tag",
    title: "Tagged",
    lede: "Notes, places, books, and hikes that carry this tag.",
    notes: "Notes",
    cafes: "Places",
    books: "Books",
    hikes: "Hikes",
    emptyNotes: "No notes with this tag.",
    emptyCafes: "No places with this tag.",
    emptyBooks: "No books with this tag.",
    emptyHikes: "No hikes with this tag.",
  },

  aboutPage: {
    kicker: "a person",
    title: "About",
    lede: "What this site already knows. Anything missing is marked TODO — it is not a guess.",
    timeline: [
      {
        when: "Now",
        title: "AI developer at Sakana AI",
        body: "The agent inside Sakana Chat — tool calling, code sandboxes, and skills — and Sakana Translate.",
        href: "/#work",
        link: "The day job →",
        placeholder: false,
      },
      {
        when: "Now",
        title: "AI Noodle",
        body: "A Substack on growing up alongside AI, from someone who builds it. Saturday mornings, Tokyo time.",
        href: "/writing",
        link: "The letters →",
        placeholder: false,
      },
      {
        when: "Now",
        title: "Women in AI/Tech Tokyo",
        body: "A table for women in AI and tech. A cafe, a question, about twenty of us.",
        href: "/#community",
        link: "Community →",
        placeholder: false,
      },
      {
        when: "Now",
        title: "Small Wins",
        body: "A little diary for the good things. One small win a day, in early access.",
        href: "/small-wins",
        link: "The app →",
        placeholder: false,
      },
      {
        when: "Now",
        title: "Consulting",
        body: "Consulting for businesses on AI products and agents.",
        href: "/#consulting",
        link: "Work with me →",
        placeholder: false,
      },
      {
        when: "Before Sakana",
        title: "Team Lead, Edge AI Development at AWL",
        body: "Hokkaido, Japan. Before the current role at Sakana AI. TODO: dates, and any detail beyond the title — not filled in.",
        href: "",
        link: "",
        placeholder: false,
      },
      {
        when: "Education",
        title: "Chemical Engineering at IIT Bombay",
        body: "TODO: dates and the degree name — not filled in.",
        href: "",
        link: "",
        placeholder: false,
      },
      {
        when: "TODO",
        title: "Talks and awards — add later",
        body: "TODO: talks, publications, and awards. Not filled in.",
        href: "",
        link: "",
        placeholder: true,
      },
    ],
  },

  contact: {
    messageLabel: "Message",
    submit: "Send",
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
