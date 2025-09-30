import { generatePagination } from "../lib/pagination";
import Link from "next/link";

type Props = {
  current: number;
  pages: number;
  link: {
    href: (page: number) => string;
    as: (page: number) => string;
  };
};
export default function Pagination({ current, pages, link }: Props) {
  const pagination = generatePagination(current, pages);
  return (
    <ul className="list-none mt-12 p-0">
      {pagination.map((it, i) => (
        <li key={i} className="inline-block mr-4 text-xl text-muted-foreground">
          {it.excerpt ? (
            "..."
          ) : (
            <Link href={link.href(it.page)} as={link.as(it.page)}>
              <span className={it.page === current ? "font-bold text-foreground" : ""}>{it.page}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
