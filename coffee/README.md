# The Coffee Notebook (珈琲帳)

Every coffee Kriti buys in Japan, with photos, maps, ratings, guides and comments.

It is its own Next.js app and its own Vercel project (`kriti-coffee`), and it lives under `/coffee`. The main site rewrites `heykriti.com/coffee/*` to it, so the same pages show at:

- https://heykriti.com/coffee (the address to share)
- https://kriti-coffee.vercel.app/coffee (the app on its own)

The home page and `/weekends` on heykriti.com show a Coffee Notebook strip that reads this app's feed (`/coffee/api/feed`).

## Run locally

```bash
cd coffee
npm install
npm run dev   # http://localhost:3001/coffee
```

## Add a coffee

Make a file in `content/coffees/`. The filename is the URL: `content/coffees/mild-kaldi-drip.md` → `/coffee/mild-kaldi-drip`.

```markdown
---
name: "Mild Kaldi"
nameJa: "マイルドカルディ"        # optional
brand: "KALDI Coffee Farm"
kind: drip-bag                  # drip-bag, beans, ground, cafe-drink, canned, instant, konbini
boughtAt: kaldi-coffee-farm     # slug of a file in content/places
price: 468                      # yen
priceNote: "10 bags × 10 g"
date: 2026-11-20
rating: 4                       # out of 5, halves are fine
origin: [Brazil, Colombia]
roast: medium                   # light, medium-light, medium, medium-dark, dark
notes: [milk chocolate, roasted nuts]
taste: { acidity: 2, body: 3, sweetness: 4, bitterness: 2, aroma: 3 }   # 1–5, draws the chart
brew: { method: "Drip bag", dose: "10 g", water: "150 ml", time: "Three pours" }
again: yes                      # yes, maybe or no: the stamp on the photo
summary: "One line that shows under the name."
tags: [everyday]
photos:
  - src: mild-kaldi-1.jpg       # file in coffee/public/photos/
    alt: "The red drip bag on my desk"
    caption: "Optional handwritten caption"
sample: false
draft: false
---

The write-up, in Markdown. Use ## for small headings.
```

Everything except `name` is optional; the page only shows what you fill in. Without photos, the page draws a packet (or cup or can) in colours picked from the slug.

## Add a café, matcha bar or shop

Same idea in `content/places/`. `kind` is `cafe`, `matcha`, `shop` or `roaster`. Paste the Google Maps link into `mapUrl`; `lat` and `lng` centre the map on the page. `note` is the short quote under the name (`myNote: true` shows it as your own words). Any coffee whose `boughtAt` is this slug shows up on the place page under "What I ordered".

## Make a guide

`content/guides/<slug>.md` → `/coffee/guides/<slug>`. List the picks in order, as coffees or places:

```markdown
---
title: "The best drip bags to buy at Kaldi"
summary: "One sentence for the card."
date: 2026-11-22
place: kaldi-coffee-farm   # optional, shows "All from KALDI Coffee Farm"
cover: kraft               # kraft, green, blue or red letter-board
items:
  - coffee: kaldi-mocha-blend-drip
    note: "Why it's here, in your handwriting font."
  - place: hanaju
---
```

Every pick links to its own page, and each coffee or place page lists the guides it's in. Nothing is hard-coded.

## Samples and drafts

- `sample: true` shows a yellow "Sample" note and keeps the page out of search. The Kaldi coffees, the Kaldi shop text and the Kaldi guide start as samples: swap in your own notes, then remove the line.
- `draft: true` hides a page in production but shows it in `npm run dev`.

## Comments

Every coffee, place and guide page has a "café notebook" at the bottom. Visitors leave a name and a note, no account needed. Notes are stored in Vercel Blob (`BLOB_READ_WRITE_TOKEN`, set by Vercel when the store is connected) as one small file each. No emails or IP addresses are kept.

Spam guards: a hidden field bots fill in, a minimum time on the page, a two-link limit, five notes per visitor per ten minutes, and the name "Kriti" is reserved.

Moderate at `/coffee/admin` with the `ADMIN_TOKEN` password from the project's environment variables in Vercel. You can delete notes and reply as Kriti (replies get a red Kriti badge).

To get an email for each new note, add `RESEND_API_KEY` and `COMMENTS_NOTIFY_EMAIL` to the project. See `.env.example`.
