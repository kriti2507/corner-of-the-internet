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

The home page carries the whole picture. Three pages go deeper:

- `/` — hero, day job, latest letters, next meetup, hike preview, Small Wins, a short consulting note, coffee teaser, and the contact form
- `/writing` — every AI Noodle letter, from the Substack feed
- `/hikes` — hike map, stats, and the bookshelf
- `/coffee` — placeholder cafés and other interests

`/work`, `/projects`, `/community`, and `/consulting` redirect to the matching section on the home page.

- Hikes: [`data/hikes.json`](data/hikes.json). Map pins are in `site.hikePins`.
- Books: [`data/books.json`](data/books.json).
- Mountain photo and the Mira illustration: put files in `public/` and set `site.photos.mountain` and `site.photos.mira`. `null` keeps the drawn placeholders.
- Email is still `hello@yourdomain.com` on purpose. Change `site.email` when there is a real address.

`lib/hikes.ts` and `lib/books.ts` are the swap point for a live Small Wins API. They return the same shapes the page already renders.

## Email

The contact form works without secrets. It logs the note on the server and shows a success message.

To deliver mail with [Resend](https://resend.com), set:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (a sender Resend has verified)

See [`.env.example`](.env.example).

## Deploy

Import the repo in Vercel and leave the framework preset on Next.js. No `vercel.json` and no environment variables are required for the site to build. Add the mail variables only when you want delivery.

Writing (The AI Noodle RSS) and the meetup calendar (Luma iCal) revalidate about once an hour.
