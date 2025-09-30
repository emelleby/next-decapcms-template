import Link from "next/link";
import { TagContent } from "../lib/tags";

type Props = {
  tag: TagContent;
};
export default function TagButton({ tag }: Props) {
  return (
    <Link
      href={`/posts/tags/${tag.slug}`}
      className="inline-block rounded-sm bg-accent/20 text-accent-foreground transition-colors duration-300 hover:bg-accent/40 px-2 py-1"
    >
      {tag.name}
    </Link>
  );
}
