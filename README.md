# Kriti Agarwal

Personal site for Kriti Agarwal — product engineer at Sakana in Tokyo. Next.js App Router. It deploys on Vercel with no extra config and no required secrets.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit the site

All copy, links, photo paths, and placeholders live in [`content/site.ts`](content/site.ts).

The home page carries the whole picture. Deeper pages:

- `/` — hero, day job, latest letters, community, hike preview, Small Wins, a short consulting note, coffee teaser, and the contact form
- `/writing` — AI Noodle from Substack, plus notes on this site. Filter chips switch between them.
- `/blog` — notes in `content/posts`
- `/weekends` — hub for hikes, coffee, books, and later categories such as matcha
- `/hikes` and `/hikes/[slug]` — map, stats, season tags, and a page per trail
- `/coffee` and `/coffee/[slug]` — placeholder cafés, filtered by tag and neighbourhood
- `/books` and `/books/[slug]` — the book log
- `/tags/[tag]` — notes, cafés, books, and hikes that share a tag
- `/about` — a timeline of what the site already knows
- `/small-wins` — product introduction for the Small Wins app

`/work`, `/projects`, `/community`, and `/consulting` redirect to the matching section on the home page.

- Hikes: [`data/hikes.json`](data/hikes.json). Map pins are in `site.hikePins`.
- Books: [`data/books.json`](data/books.json).
- Mountain photo and the Mira illustration: put files in `public/` and set `site.photos.mountain` and `site.photos.mira`. `null` keeps the drawn placeholders.
- Email is still `hello@yourdomain.com` on purpose. Change `site.email` when there is a real address.

## Hero secrets

The two draggable photos hide a card each. Edit `site.hero.secrets` in [`content/site.ts`](content/site.ts). The first item sits under the mountain photo, the second under Mira. Each has a `title`, a `body`, and an optional `cta` (`label` and `href`). These start as placeholders — do not put a real code or offer in until you mean to share it. Drag a photo, or focus it and use the arrow keys, to reveal the card. “Put the photos back” covers them again. The label is `site.hero.secretFound`.

`lib/hikes.ts` and `lib/books.ts` are the swap point for a live Small Wins API. They return the same shapes the page already renders.

## How to write a post and tag cafés, books, and hikes

Add a Markdown file in [`content/posts`](content/posts). The filename is the URL slug (`content/posts/ridge-note.md` → `/blog/ridge-note`).

```markdown
---
title: A morning in the notebook
date: 2026-11-04
summary: One sentence for the index.
tags: [tokyo]
cafes: [example-counter]
books: [the-hobbit]
hikes: [jinbasan]
sample: false
draft: false
---

The body can link to [/coffee/example-counter](/coffee/example-counter).
```

- `cafes`, `books`, and `hikes` are slug lists. Slugs live in [`content/cafes.ts`](content/cafes.ts), and are generated from hike and book titles.
- The café, book, or hike page lists every published note that names it. The note lists the things it names.
- `tags` is shared. `/tags/tokyo` lists anything carrying that tag: notes, cafés, books, or hikes.
- Hike tags are the region plus the season of the logged date. Book tags are only a series name when it is written in the title, like Clifton Chronicles. Do not invent a genre.
- Café cards in the repo are placeholders. Replace the name, neighbourhood, note, and tags, and set `placeholder: false`, before treating one as real. Example tags to use then: `pour-over`, `roaster`, `work-friendly`, `dessert`.
- Set `draft: true` to hide a note. Set `sample: true` to show it with a Sample mark.
- To tag a Substack letter without copying it, set `external` to the letter URL and leave the body as a sentence about the link. `/writing` still loads the AI Noodle feed, and skips a feed item when a note already uses that URL.
- `npm run build` picks up new files. No database.

## Email

The contact form works without secrets. It logs the note on the server and shows a success message.

To deliver mail with [Resend](https://resend.com), set:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (a sender Resend has verified)

See [`.env.example`](.env.example).

## Deploy

Import the repo in Vercel and leave the framework preset on Next.js. No `vercel.json` and no environment variables are required for the site to build. Add the mail variables only when you want delivery.

Writing (The AI Noodle RSS) and the community calendar (Luma iCal) revalidate about once an hour.
