import { PostContent } from "../lib/posts";
import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";

type Props = {
  post: PostContent;
};
export default function PostItem({ post }: Props) {
  return (
    <Link href={"/posts/" + post.slug} className="inline-block text-foreground">
      <Date date={parseISO(post.date)} />
      <h2 className="m-0 font-medium">{post.title}</h2>
    </Link>
  );
}
