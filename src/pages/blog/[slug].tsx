import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SEOHead, PageLayout } from "@/components/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getBlogPostBySlug,
  getAllBlogPosts,
  getRelatedBlogPosts,
  type BlogPost,
} from "@/lib/seo/blog-data";

type BlogPostPageProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

const AUTHOR_AVATARS: Record<string, string> = {
  "Sarah Kim": "/testimonials/sarah.jpg",
  "Alex Chen": "/testimonials/marcus.jpg",
  "Jessica Lee": "/testimonials/jessica.jpg",
  "Lisa Park": "/testimonials/jessica.jpg",
  "David Park": "/testimonials/david.jpg",
  "Emma Wilson": "/testimonials/sarah.jpg",
  "Mike Rodriguez": "/testimonials/marcus.jpg",
  "Amanda Torres": "/testimonials/jessica.jpg",
  "Robert Chang": "/testimonials/david.jpg",
  "Tom Wilson": "/testimonials/marcus.jpg",
};

const BlogPostPage = ({ post, relatedPosts }: BlogPostPageProps) => {
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim());

  const authorAvatar = AUTHOR_AVATARS[post.author.name] || "/testimonials/david.jpg";

  return (
    <>
      <SEOHead
        meta={{
          title: `${post.title} | Dropwiz Blog`,
          description: post.excerpt,
          canonical: `${SITE_URL}/blog/${post.slug}`,
          ogType: "article",
          keywords: post.tags,
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          author: post.author.name,
        }}
        schemas={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            url: `${SITE_URL}/blog/${post.slug}`,
            image: `${SITE_URL}/og/blog/${post.slug}.png`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: post.author.name,
          }),
          breadcrumbSchema([
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
          ]),
        ]}
      />
      <PageLayout breadcrumbs={[{ label: "Blog", href: "/blog" }]}>
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex items-center gap-3">
              <Link
                href={`/blog?category=${post.category}`}
                className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium capitalize text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
              >
                {post.category}
              </Link>
              <span className="text-sm text-[color:var(--dw-text-muted)]">
                {post.readTime} read
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[color:var(--dw-text)] md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-secondary)]">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-[color:var(--dw-border)] pt-6">
              <img
                src={authorAvatar}
                alt={post.author.name}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="font-medium text-[color:var(--dw-text)]">{post.author.name}</div>
                <div className="text-sm text-[color:var(--dw-text-muted)]">
                  <span>
                    Published{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {post.updatedAt !== post.publishedAt && (
                    <span className="hidden sm:inline">
                      {" · Updated "}
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {headings.length > 0 && (
            <nav className="not-prose mb-10 rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--dw-text-muted)]">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {headings.map((heading, i) => (
                  <li key={i}>
                    <a
                      href={`#${heading.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`}
                      className="text-sm text-[color:var(--dw-text-secondary)] transition-colors hover:text-[color:var(--dw-accent)]"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-[color:var(--dw-accent)] prose-code:rounded prose-code:bg-[color:var(--dw-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-[color:var(--dw-surface)] prose-table:border-collapse prose-th:border prose-th:border-[color:var(--dw-border)] prose-th:bg-[color:var(--dw-surface)] prose-th:p-2 prose-td:border prose-td:border-[color:var(--dw-border)] prose-td:p-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                  return <h3 id={id}>{children}</h3>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="not-prose mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--dw-border)] px-3 py-1 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
            <div className="not-prose grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
                >
                  <span className="text-xs font-medium capitalize text-[color:var(--dw-accent)]">
                    {relatedPost.category}
                  </span>
                  <h3 className="mt-2 font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-[color:var(--dw-text)] sm:text-2xl">Build Your Store with AI</h3>
          <p className="mt-2 text-sm text-[color:var(--dw-text-muted)] sm:text-base">
            Turn any product into a professional, high-converting store page in seconds.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Start Building Free →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getAllBlogPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
      relatedPosts: getRelatedBlogPosts(slug, 3),
    },
    revalidate: 86400,
  };
};

export default BlogPostPage;
