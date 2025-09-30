# Decap CMS Pages Implementation Guide

This document describes the implementation of content management for pages using Decap CMS (formerly Netlify CMS) with MDX support.

## Overview

The implementation allows content editors to manage static pages (like About, Contact, etc.) through the Decap CMS interface instead of requiring direct file editing. Pages are stored as MDX files with frontmatter and can include React components.

## Architecture

### Directory Structure

```
content/
├── pages/           # CMS-managed page content
│   ├── about.mdx
│   ├── contact.mdx
│   └── ...
└── posts/           # Existing blog posts
    └── ...

src/
├── components/
│   └── PageLayout.tsx    # Layout component for pages
├── lib/
│   └── pages.ts         # Page content processing utilities
└── pages/
    ├── about.tsx        # Dynamic About page
    ├── contact.tsx      # Dynamic Contact page
    └── ...

public/admin/
├── config.yml           # Updated CMS configuration
└── index.html          # Updated preview templates
```

## Implementation Details

### 1. CMS Configuration (`public/admin/config.yml`)

Added a new `pages` collection with the following configuration:

```yaml
- name: "pages"
  label: "Pages"
  folder: "content/pages/"
  extension: "mdx"
  format: "frontmatter"
  create: true
  slug: "{{slug}}"
  identifier_field: slug
  summary: "{{title}}"
  fields:
    - label: "Slug"
      name: "slug"
      widget: "string"
      hint: "URL-friendly identifier for the page"
    - label: "Title"
      name: "title"
      widget: "string"
      hint: "Page title for browser tab and main heading"
    - label: "Description"
      name: "description"
      widget: "text"
      required: false
      hint: "Meta description for SEO (150-160 characters)"
    - label: "Keywords"
      name: "keywords"
      widget: "list"
      required: false
    - label: "Last Updated"
      name: "updated"
      widget: "datetime"
      format: "YYYY-MM-DD"
      required: false
    - label: "Body"
      name: "body"
      widget: "markdown"
      hint: "Page content in Markdown format with MDX support"
```

### 2. Page Content Processing (`src/lib/pages.ts`)

Created utility functions for handling page content:

- `fetchPageContent()`: Loads all page files from `content/pages/`
- `getPageBySlug(slug)`: Retrieves a specific page by slug
- `getAllPageSlugs()`: Returns all available page slugs
- `pageExists(slug)`: Checks if a page exists

### 3. Page Layout Component (`src/components/PageLayout.tsx`)

A reusable layout component for rendering CMS-managed pages with:

- SEO meta tags (title, description, keywords)
- Open Graph and Twitter Card support
- Responsive design with proper typography
- MDX content rendering support

### 4. Dynamic Page Components

Updated page components (e.g., `src/pages/about.tsx`) to:

- Use `getStaticProps` for static generation
- Load content from CMS-managed files
- Process MDX content with `next-mdx-remote`
- Render using the `PageLayout` component

### 5. CMS Preview Templates (`public/admin/index.html`)

Added `PagePreview` component for live content editing:

```javascript
var PagePreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var description = entry.getIn(["data", "description"]);
    return h(
      "div",
      { className: "content" },
      h("h1", {}, entry.getIn(["data", "title"])),
      description && h("p", { className: "description" }, description),
      h("div", {}, this.props.widgetFor("body"))
    );
  },
});

CMS.registerPreviewTemplate("pages", PagePreview);
```

## Usage

### For Content Editors

1. Access the CMS at `/admin`
2. Navigate to the "Pages" collection
3. Create new pages or edit existing ones
4. Use the live preview to see changes in real-time
5. Publish changes to update the live site

### For Developers

#### Adding a New CMS-Managed Page

1. Create the page content file in `content/pages/`:
   ```mdx
   ---
   slug: new-page
   title: New Page
   description: Description for the new page
   ---
   
   # New Page Content
   
   Your content here...
   ```

2. Create the Next.js page component:
   ```tsx
   // src/pages/new-page.tsx
   import { GetStaticProps } from "next";
   import { serialize } from "next-mdx-remote/serialize";
   import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
   import matter from "gray-matter";
   import fs from "fs";
   import yaml from "js-yaml";
   import { getPageBySlug } from "../lib/pages";
   import PageLayout from "../components/PageLayout";

   export type Props = {
     title: string;
     slug: string;
     description?: string;
     keywords?: string[];
     source: MDXRemoteSerializeResult;
   };

   const components = {
     // Add custom MDX components here
   };

   export default function NewPage({ title, slug, description, keywords, source }: Props) {
     return (
       <PageLayout title={title} slug={slug} description={description} keywords={keywords}>
         <MDXRemote {...source} components={components} />
       </PageLayout>
     );
   }

   export const getStaticProps: GetStaticProps = async () => {
     const pageData = getPageBySlug("new-page");
     
     if (!pageData) {
       return { notFound: true };
     }

     const source = fs.readFileSync(pageData.fullPath, "utf8");
     const { content, data } = matter(source, {
       engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object }
     });
     const mdxSource = await serialize(content, { scope: data });

     return {
       props: {
         title: data.title,
         slug: data.slug,
         description: data.description || "",
         keywords: data.keywords || [],
         source: mdxSource
       },
     };
   };
   ```

#### Adding Custom MDX Components

To add custom components that can be used in page content:

1. Create the component in `src/components/`
2. Import and add it to the `components` object in your page files:
   ```tsx
   import CustomComponent from "../components/CustomComponent";

   const components = {
     CustomComponent,
   };
   ```

3. Use it in your MDX content:
   ```mdx
   <CustomComponent prop="value">
     Content here
   </CustomComponent>
   ```

## Benefits

1. **Content Editor Friendly**: Non-technical users can manage page content
2. **Live Preview**: Real-time preview of changes in the CMS
3. **Version Control**: All changes are tracked in Git
4. **SEO Optimized**: Proper meta tags and structured data
5. **Performance**: Static generation for fast loading
6. **Flexible**: Support for MDX components and rich content
7. **Type Safe**: Full TypeScript support

## Testing

The implementation has been tested with:

- ✅ Page creation and editing through CMS
- ✅ Live preview functionality
- ✅ Static site generation
- ✅ SEO meta tags
- ✅ Responsive design
- ✅ MDX content rendering

## Content Editor Quick Reference

### Creating a New Page

1. Go to `/admin` and log in
2. Click "Pages" in the sidebar
3. Click "New Pages" button
4. Fill in the required fields:
   - **Slug**: URL identifier (e.g., "about" for `/about`)
   - **Title**: Page title shown in browser and as heading
   - **Description**: Brief description for search engines
   - **Keywords**: SEO keywords (optional)
   - **Body**: Main page content in Markdown

### Editing Existing Pages

1. Go to `/admin` and log in
2. Click "Pages" in the sidebar
3. Click on the page you want to edit
4. Make your changes in the editor
5. Use the preview pane to see your changes
6. Click "Save" when finished

### Markdown Tips

- Use `#` for main headings, `##` for subheadings
- Use `**bold**` for bold text, `*italic*` for italic
- Create lists with `-` or `1.`
- Add links with `[text](URL)`
- Add images with `![alt text](image-url)`

### Publishing Changes

- Changes are automatically saved as drafts
- Click "Publish" to make changes live
- All changes are tracked in version control

## Next Steps

Consider implementing:

1. **Dynamic routing**: For pages created entirely through CMS
2. **Image optimization**: Better handling of images in page content
3. **Internationalization**: Multi-language page support
4. **Advanced components**: More complex MDX components for rich content
5. **Workflow**: Editorial workflow for page approvals
