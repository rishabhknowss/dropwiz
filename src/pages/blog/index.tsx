import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getAllBlogPostsForIndex,
  getBlogCategories,
  type BlogPostSummary,
} from "@/lib/seo/blog-data";

type BlogIndexProps = {
  posts: BlogPostSummary[];
  categories: string[];
};

const BlogIndex = ({ posts, categories }: BlogIndexProps) => {
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      <SEOHead
        meta={{
          title: "Dropshipping Blog - Tips, Strategies & Guides | Dropwiz",
          description:
            "Expert dropshipping tips, strategies, and guides. Learn how to build and grow your e-commerce business with actionable advice from industry experts.",
          canonical: `${SITE_URL}/blog`,
          keywords: [
            "dropshipping blog",
            "ecommerce tips",
            "dropshipping strategies",
            "online business guides",
          ],
        }}
        schemas={[breadcrumbSchema([{ name: "Blog", url: `${SITE_URL}/blog` }])]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Dropshipping Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Expert strategies, tips, and insights to help you build a successful
            dropshipping business.
          </p>
        </header>

        <div className="not-prose mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="rounded-full bg-[color:var(--dw-accent)] px-4 py-2 text-sm font-medium text-[#0A0A0A]"
          >
            All Posts
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className="rounded-full border border-[color:var(--dw-border)] px-4 py-2 text-sm font-medium capitalize transition-colors hover:border-[color:var(--dw-accent)] hover:text-[color:var(--dw-accent)]"
            >
              {category}
            </Link>
          ))}
        </div>

        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="not-prose mb-10 block overflow-hidden rounded-2xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
          >
            <div className="aspect-[21/9] bg-gradient-to-br from-[color:var(--dw-accent)]/20 to-[color:var(--dw-accent)]/5" />
            <div className="p-6 md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-xs font-medium capitalize text-[color:var(--dw-accent)]">
                  {featuredPost.category}
                </span>
                <span className="text-sm text-[color:var(--dw-text-muted)]">
                  {featuredPost.readTime} read
                </span>
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-[color:var(--dw-text-muted)]">
                {featuredPost.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="font-medium">{featuredPost.author.name}</span>
                <span className="text-[color:var(--dw-text-muted)]">
                  {new Date(featuredPost.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="not-prose grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
            >
              <div className="aspect-video bg-gradient-to-br from-[color:var(--dw-accent)]/10 to-transparent" />
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-2 py-0.5 text-xs font-medium capitalize text-[color:var(--dw-accent)]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[color:var(--dw-text-muted)]">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                  {post.excerpt}
                </p>
                <div className="mt-3 text-xs text-[color:var(--dw-text-muted)]">
                  {post.author.name} ·{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-[color:var(--dw-text)] sm:text-2xl">Ready to Build Your Store?</h3>
          <p className="mt-2 text-sm text-[color:var(--dw-text-muted)] sm:text-base">
            Turn any product into a professional store page in seconds with AI.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Start Building →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexProps> = () => {
  return {
    props: {
      posts: getAllBlogPostsForIndex(),
      categories: getBlogCategories(),
    },
    revalidate: 86400,
  };
};

export default BlogIndex;
