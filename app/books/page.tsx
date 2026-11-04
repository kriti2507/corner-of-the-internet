import { BookHub } from "@/components/book-hub";
import { site } from "@/content/site";
import { getBooks } from "@/lib/books";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("books");

export default function BooksPage() {
  return (
    <BookHub
      kicker={site.books.kicker}
      title={site.books.title}
      lede={site.books.hubLede}
      books={getBooks()}
      allLabel={site.coffee.allLabel}
    />
  );
}
