/**
 * Edit this file to change copy, links, and placeholders.
 * Hike and book logs live in data/hikes.json and data/books.json.
 * Weekends copy (hikes, reading, places, Japanese) lives in content/weekends.ts,
 * and the places themselves in content/places.ts.
 *
 * Email is ping@heykriti.com. GitHub and LinkedIn are Kriti's real profiles.
 * There is no top ticker — she asked for it to be removed.
 */

export type Mark = "pink" | "yellow" | "green" | "blue" | "red" | "lavender";

export type LeadPart = { text: string; mark?: Mark };

export const site = {
  name: "Kriti Agarwal",
  /** The live address. Sitemaps, link previews and structured data use it. */
  url: "https://heykriti.com",
  description:
    "Kriti Agarwal builds AI products at Sakana in Tokyo, writes AI Noodle, hosts Women x Tech in Tokyo, and logs small wins from the mountains.",
  /**
   * The footer, the contact-form fallback, and the contact API (as the
   * default inbox for form notes) all read this value.
   */
  email: "ping@heykriti.com",
  emailIsPlaceholder: false,

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
      description: "Notes written on this site — Tokyo guides, cafés, books and hikes — alongside the AI Noodle letters on Substack.",
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
      { text: "at Sakana", mark: "blue" },
      { text: ", " },
      { text: "write AI Noodle", mark: "red" },
      { text: ", " },
      { text: "host Women x Tech", mark: "yellow" },
      { text: " and " },
      { text: "collect small wins", mark: "lavender" },
      { text: " — on mountains, in notebooks, in code." },
    ] as LeadPart[],
    /**
     * Hidden under the two hero photos. Order matches the photos: mountain, then Mira.
     * Each item is { title, body, cta?: { label, href } }.
     * A `?perk=` link pre-fills the contact form (see contact.perks) so you know
     * which secret someone found.
     */
    secretFound: "You found a secret",
    secrets: [
      {
        title: "A free coffee chat",
        body: "You looked under the photo, so the first coffee is on me. Tell me what you're curious about — AI, Tokyo, mountains, anything.",
        cta: { label: "Claim it →", href: "/?perk=coffee#note" },
      },
      {
        title: "A free build session",
        body: "Bring one small thing you want AI to do for you. We'll build it together in an hour, and you'll leave with something that works.",
        cta: { label: "Claim it →", href: "/?perk=build#note" },
      },
    ],
  },

  /**
   * Drop files in /public and set these paths, e.g. "/photos/mountain.jpg".
   * Null keeps the drawn placeholder.
   */
  photos: {
    mountain: "/photos/daibosatsu.webp" as string | null,
    mountainAlt: "Kriti smiling on Daibosatsu-rei, with Mount Fuji, autumn forests and Lake Daibosatsu behind",
    mira: "/photos/mira.webp" as string | null,
    miraAlt:
      "Illustration of Mira, the AI Noodle character: a woman with long wavy dark hair, round glasses, a red cardigan and cream trousers, holding a coffee in front of Tokyo Tower and cherry blossoms",
  },

  polaroids: {
    mountain: {
      caption: "",
      script: "that's me",
      where: "Daibosatsu, Nov ’26",
    },
    mira: {
      caption: "Mira, from AI Noodle",
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
        title: "The agent inside Sakana App",
        body: "Notes from building it: memory, MCP, and the tools it reaches for.",
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
        title: "Women x Tech, Tokyo",
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
        body: "I help traditional businesses put AI to work, and teach people how to use it well.",
        href: "/#note",
        link: "Book a call →",
      },
    ],
  },

  work: {
    kicker: "Sakana",
    title: "The agent inside Sakana App",
    lede: "I build AI products at Sakana in Tokyo. Right now that's the agent inside Sakana App. I write up what I learn while building it, one topic at a time.",
    /**
     * Each card opens /series/<slug>. A note joins a series with
     * `series: <slug>` in its frontmatter. Add, rename, or reorder here.
     */
    series: [
      {
        slug: "memory",
        title: "Remembering, and Forgetting",
        body: "Memory: what the agent keeps between conversations, how it finds it again, and what it lets go.",
        intro:
          "How the agent in Sakana App remembers. What gets saved, how it's found again, and what should be forgotten.",
      },
      {
        slug: "mcp",
        title: "How Agents Talk to the World",
        body: "MCP: how the agent plugs into other tools and data through the Model Context Protocol.",
        intro:
          "Notes on the Model Context Protocol: how the agent connects to tools and data that live outside it.",
      },
      {
        slug: "tools",
        title: "When the Agent Needs to Do, Not Say",
        body: "Tools: tool calling, code sandboxes, and skills. Something to reach for instead of guessing.",
        intro:
          "Giving the model tools: tool calling, code sandboxes, and skills. The agent reaches for something instead of inventing an answer.",
      },
    ],
    seriesKicker: "Sakana App",
    countOne: "1 note →",
    countMany: "{n} notes →",
    countNone: "First note soon →",
    seriesEmpty: "The first note in this series is on the way.",
    seriesPart: "Part",
    seriesBack: "← All three topics",
    partOf: "Part of the series",
    links: [
      { label: "Sakana", href: "https://sakana.ai" },
      { label: "Sakana App", href: "https://chat.sakana.ai" },
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
    /**
     * Public archive API. Gives every letter (not just the last 20 in the
     * RSS feed) plus likes, comments, restacks and word count.
     */
    archiveUrl: "https://unplannedwriter.substack.com/api/v1/archive",
    /** The "Group by" switch on /writing. The first one is the default. */
    views: [
      { id: "topic", label: "Topic" },
      { id: "top", label: "Top", hint: "Ranked by likes, comments and restacks on Substack" },
      { id: "newest", label: "Newest" },
      { id: "oldest", label: "Oldest" },
    ],
    /**
     * Topic clusters on /writing. A letter goes to the first topic that
     * lists its slug (the part after /p/ in the URL). A new letter that no
     * topic lists is matched on keywords in its title and subtitle, and
     * lands in `otherTopic` if nothing matches.
     * `order` sorts letters inside the cluster: "oldest" reads a series in order.
     */
    topics: [
      {
        id: "building",
        name: "Building with AI",
        blurb: "Vibe Check and friends: shipping real software when AI writes most of the code.",
        tone: "blue",
        order: "oldest",
        slugs: [
          "confessions-of-a-vibe-coder-from",
          "vibe-check-1-finding-your-app-idea",
          "vibe-check-2-choosing-your-tech-stack",
          "start-with-visual-branding",
          "vibe-check-3-product-documentation",
          "everyone-can-start-almost-nobody",
        ],
        keywords: ["vibe", "coding", "coder", "tech stack", "spec", "agentic", "ship", "build"],
      },
      {
        id: "mind",
        name: "AI and the way we think",
        blurb: "Attention, friction and autopilot: what happens to a brain that leans on AI.",
        tone: "pink",
        order: "newest",
        slugs: [
          "is-claude-the-new-instagram",
          "the-friction-you-actually-want",
          "were-raising-a-generation-that-was",
          "we-are-building-a-fragmented-attention",
          "we-are-building-a-fragmented-attention-b83",
          "your-brain-on-autopilot",
          "is-chatgpt-killing-my-creativity",
        ],
        keywords: ["brain", "attention", "think", "friction", "addict", "creativity", "sharp", "stupid"],
      },
      {
        id: "future",
        name: "AI, work and what comes next",
        blurb: "Jobs, trust and a thought experiment about the year 2100.",
        tone: "yellow",
        order: "newest",
        slugs: [
          "the-world-in-2100-what-happens-when",
          "the-psychology-of-why-ai-will-replace",
          "why-humans-trust-ai-more-than-other",
        ],
        keywords: ["future", "2100", "jobs", "career", "trust", "replace"],
      },
      {
        id: "habits",
        name: "Habits and the stories in our heads",
        blurb: "Resolutions, defaults, dopamine, and the excuses we tell ourselves.",
        tone: "green",
        order: "newest",
        slugs: [
          "i-debugged-my-fear-of-betting-on",
          "your-brain-is-lying-to-you-and-youre",
          "building-habits-that-survive-real",
          "why-new-years-resolutions-die-out",
          "the-new-year-new-me-syndrome",
        ],
        keywords: ["habit", "resolution", "new year", "fear", "procrastinat", "dopamine", "discipline"],
      },
    ] as WritingTopic[],
    otherTopic: {
      id: "more",
      name: "More letters",
      blurb: "Everything else from AI Noodle.",
      tone: "peach",
      order: "newest",
      slugs: [],
      keywords: [],
    } as WritingTopic,
    journalTopic: {
      id: "journal",
      name: "On this site",
      blurb: "Notes that live here, and can point at a café, a book or a hike.",
      tone: "paper",
      order: "newest",
      slugs: [],
      keywords: [],
    } as WritingTopic,
    viewCopy: {
      groupBy: "Group by",
      jumpTo: "Jump to",
      topHead: "Most loved",
      topBlurb: "The three letters readers liked, commented on and restacked the most.",
      restHead: "The rest, by popularity",
      restBlurb: "Ranked by likes, comments and restacks on Substack.",
      noStats: "Substack's numbers didn't load, so these are newest first for now.",
      year: "letters from",
    },
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
    kicker: "what I'm building",
    title: "Small Wins",
    badge: "beta",
    lede: "A little diary for the good things. Log one small win a day and watch each part of your life fill in.",
    /**
     * Public app URL, when there is one. Null hides the outbound link
     * so the site never points at a guess.
     */
    url: "https://small-wins-live.vercel.app/" as string | null,
    tryLabel: "Try the beta",
    /** The real first-run flow, from the app's StarterPicker and QuickAdd. */
    steps: [
      {
        title: "Sign in with Google",
        body: "Only you can see what you log.",
      },
      {
        title: "Pick what to track",
        body: "Choose up to three starters, like Workout, Reading or Sleep. Rename them or add your own later.",
      },
      {
        title: "Type today's win",
        body: "One line, like “ran 5k in 27 min”. Small Wins files it under the right aspect and fills in the day.",
      },
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
    flowTitle: "How it starts",
    flow: [
      {
        title: "Sign in with Google",
        body: "No password to make up. Only you can see what you log.",
      },
      {
        title: "Pick up to three things to track",
        body: "Workout, Journal, Reading, Meditation, Sleep, Learning, Gratitude, Cooking or Walk. Each one comes with its own colour and fields.",
      },
      {
        title: "Type today's win",
        body: "One line in the box at the top. Small Wins puts it in the right place and the day fills in.",
      },
    ],
    features: [
      {
        kicker: "quick add",
        title: "Log a win in one line",
        body: "“What's your win today?” Type it the way you'd say it — “ran 5k in 27 min”, “read 30 pages”. Small Wins picks the aspect and fills in the numbers from your words, never guessing a value you didn't write. A clear win saves straight away with an Undo; anything ambiguous opens a draft for you to check.",
        mock: "quick-add" as const,
      },
      {
        kicker: "aspects",
        title: "Make the starters yours",
        body: "Your starters arrive ready to use: Reading counts Pages, Sleep counts Hours, Walk counts Steps. Use ⋯ to rename or delete one, or + Add more to track something of your own — Hikes, Runs, Japanese — with a name, a colour, and fields such as Distance (km). Number fields shade higher-is-better or lower-is-better, so the grid knows what a big win is.",
        image: "/small-wins/aspects.png",
        width: 780,
        height: 1340,
        alt: "Workout and Journal aspect tiles, each filled with a grid of coloured squares.",
      },
      {
        kicker: "time capsule",
        title: "Your month at a glance",
        body: "Every aspect you log shows up on the calendar in its own colour. Darker squares are bigger wins — a longer workout, more pages. Step back through past months to see what each one held.",
        image: "/small-wins/time-capsule.png",
        width: 780,
        height: 1632,
        alt: "Small Wins Time Capsule for October, with green and purple squares on the days a win was logged.",
      },
      {
        kicker: "the entry",
        title: "A photo, and the story if you want it",
        body: "A twenty-minute walk counts. Add a photo, and write the story when a hike, a trip, or a book is worth more than the number.",
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
    title: "Women x Tech",
    lede: "A monthly meetup for women and non-binary people working in tech, or finding their way in. Come for the conversation, leave knowing a few more people in the field.",
    calendarUrl: "https://luma.com/calendar/cal-SGe7q4ZRJ8WRTcv",
    /** Public iCal. Confirmed: returns text/calendar for Women x Tech. */
    icsUrl:
      "https://api.lu.ma/ics/get?entity=calendar&id=cal-SGe7q4ZRJ8WRTcv",
    calendarLabel: "The calendar →",
    saveLabel: "Save a seat →",
    nextLabel: "Next meetup",
    pastTitle: "Past meetups",
    pastLink: "See the page →",
    empty: "The next meetup isn't posted yet. Follow the calendar to hear first.",
    fallbackNote: "The live calendar didn't answer, so this is the last meetup I saved.",
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
    kicker: "work with me",
    title: "Let's talk",
    lede: "Two ways I can help:",
    offers: [
      {
        label: "For businesses",
        body: "I help traditional businesses use the power of AI — finding the slow, manual parts of how you work and building simple tools that take them off your plate.",
      },
      {
        label: "For people",
        body: "I teach people how to use AI well — what it's good at, where it trips up, and how to make it part of your everyday work.",
      },
    ],
    closer: "Tell me a little about what you're working on, and I'll write back.",
    aboutCta: { label: "About me", href: "/about" },
  },



  blog: {
    kicker: "journal",
    title: "Notes",
    lede: "Notes written here, not on Substack: Tokyo guides, cafés, books and hikes.",
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
        body: "The agent inside Sakana App — memory, MCP, and tools: tool calling, code sandboxes, and skills.",
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
    errorFallback: "That didn't send. Email me instead:",
    /** Message pre-filled when someone arrives from a hero secret (?perk=…). */
    perks: {
      coffee: "I found the secret under the mountain photo — I'd love a coffee chat. ",
      build: "I found the secret under Mira — I'd love a build session. ",
    } as Record<string, string>,
  },

  footer: {
    prompt: "write me a note —",
    /** Shown at the very bottom of every page. */
    madeWith: "made with ☕, ❤️ and AI",
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

export type WritingTopic = {
  id: string;
  name: string;
  blurb: string;
  tone: "blue" | "pink" | "yellow" | "green" | "peach" | "paper";
  order: "newest" | "oldest";
  slugs: string[];
  keywords: string[];
};

/** A letter from the Substack archive, with Substack's public numbers. */
export type Letter = Post & {
  slug: string;
  likes: number;
  comments: number;
  restacks: number;
  words: number;
  /** 1 = Substack's top letter. Null when Substack leaves it out of "top". */
  rank: number | null;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string | null;
  location: string;
  url: string;
};
