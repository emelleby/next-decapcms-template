import { GetStaticProps, GetStaticPaths } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import matter from "gray-matter";
import { fetchPostContent } from "../../lib/posts";
import fs from "fs";
import yaml from "js-yaml";
import { parseISO } from 'date-fns';
import PostLayout from "../../components/PostLayout";
import { YouTubeEmbed } from "@next/third-parties/google";

export type Props = {
  title: string;
  dateString: string;
  slug: string;
  tags: string[];
  author: string;
  description?: string;
  source: MDXRemoteSerializeResult;
};

// Replace old components with Next.js alternatives and placeholders
const components = { 
  YouTubeEmbed,
  // Placeholder components for removed social embeds
  InstagramEmbed: ({ url }: { url: string }) => (
    <div style={{ padding: '20px', border: '1px solid #ccc', textAlign: 'center' }}>
      <p>Instagram embed removed - <a href={url} target="_blank" rel="noopener noreferrer">View on Instagram</a></p>
    </div>
  ),
  TwitterTweetEmbed: ({ tweetId }: { tweetId: string }) => (
    <div style={{ padding: '20px', border: '1px solid #ccc', textAlign: 'center' }}>
      <p>Twitter embed removed - <a href={`https://twitter.com/i/web/status/${tweetId}`} target="_blank" rel="noopener noreferrer">View Tweet</a></p>
    </div>
  ),
  YouTube: ({ videoId }: { videoId: string }) => (
    <YouTubeEmbed videoid={videoId} height={400} />
  )
};

export default function Post({
  title,
  dateString,
  slug,
  tags,
  author,
  description = "",
  source,
}: Props) {
  return (
    <PostLayout
      title={title}
      date={parseISO(dateString)}
      slug={slug}
      tags={tags}
      author={author}
      description={description}
    >
      <MDXRemote {...source} components={components} />
    </PostLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = fetchPostContent().map(it => "/posts/" + it.slug);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.post as string;
  const slugToPostContent = (postContents => {
    let hash = {}
    postContents.forEach(it => hash[it.slug] = it)
    return hash;
  })(fetchPostContent());
  
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
  });
  const mdxSource = await serialize(content, { scope: data });
  
  return {
    props: {
      title: data.title,
      dateString: data.date,
      slug: data.slug,
      description: "",
      tags: data.tags,
      author: data.author,
      source: mdxSource
    },
  };
};

