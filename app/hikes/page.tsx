import { Bookshelf } from "@/components/bookshelf";
import { HikesSection } from "@/components/hikes-section";
import { site } from "@/content/site";
import { getBooks } from "@/lib/books";
import { getHikes } from "@/lib/hikes";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("hikes");

export default function HikesPage() {
  const hikes = getHikes();
  const books = getBooks();

  return (
    <div className="field-band">
      <HikesSection
        hikes={hikes}
        kicker={site.hikes.kicker}
        title={site.hikes.title}
        lede={site.hikes.lede}
        mapLabel={site.hikes.mapLabel}
        approxNote={site.hikes.approxNote}
      />
      <Bookshelf
        books={books}
        kicker={site.books.kicker}
        title={site.books.title}
        lede={site.books.lede}
        readLabel={site.books.readLabel}
      />
    </div>
  );
}
