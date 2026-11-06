import { BookHub } from "@/components/book-hub";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/content/site";
import { getBooks } from "@/lib/books";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("books");

export default function BooksPage() {
  return (
    <>
    <div className="wrap crumb-wrap">
      <Breadcrumbs items={[{ label: site.weekends.title, href: "/weekends" }, { label: site.books.title }]} />
    </div>
    <BookHub
      kicker={site.books.kicker}
      title={site.books.title}
      lede={site.books.hubLede}
      books={getBooks()}
      allLabel={site.coffee.allLabel}
    />
    </>
  );
}
