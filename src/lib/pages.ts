import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const pagesDirectory = path.join(process.cwd(), "content/pages");

export type PageContent = {
  readonly title: string;
  readonly slug: string;
  readonly description?: string;
  readonly keywords?: string[];
  readonly updated?: string;
  readonly fullPath: string;
};

let pageCache: PageContent[];

export function fetchPageContent(): PageContent[] {
  if (pageCache) {
    return pageCache;
  }
  
  // Check if pages directory exists
  if (!fs.existsSync(pagesDirectory)) {
    pageCache = [];
    return pageCache;
  }
  
  // Get file names under /pages
  const fileNames = fs.readdirSync(pagesDirectory);
  const allPagesData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(pagesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the page metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        title: string;
        slug: string;
        description?: string;
        keywords?: string[];
        updated?: string;
        fullPath: string;
      };
      matterData.fullPath = fullPath;

      const slug = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.slug !== slug) {
        throw new Error(
          `slug field not match with the path of its content source: ${fileName}`
        );
      }

      return matterData;
    });
  
  // Sort pages by title for consistent ordering
  pageCache = allPagesData.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  
  return pageCache;
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return fetchPageContent().find((page) => page.slug === slug);
}

export function getAllPageSlugs(): string[] {
  return fetchPageContent().map((page) => page.slug);
}

export function pageExists(slug: string): boolean {
  return fetchPageContent().some((page) => page.slug === slug);
}
