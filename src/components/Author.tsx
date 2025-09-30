import { AuthorContent } from "../lib/authors";

type Props = {
  author: AuthorContent;
};
export default function Author({ author }: Props) {
  return (
    <span className="text-muted-foreground">{author.name}</span>
  );
}
