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

const BlogPostPage = ({ post, relatedPosts }: BlogPostPageProps) => {
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim());

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
                className="rounded-full bg-[#0A0A0A] px-3 py-1 text-sm font-medium capitalize text-white transition-colors hover:bg-[#1a1a1a]"
              >
                {post.category}
              </Link>
              <span className="text-sm text-[#666666]">
                {post.readTime} read
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A] md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-[#666666]">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-2 border-t border-[#E5E5E5] pt-6 text-sm text-[#666666]">
              <span className="font-medium text-[#0A0A0A]">{post.author.name}</span>
              <span>·</span>
              <span>
                Published{" "}
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {post.updatedAt !== post.publishedAt && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">
                    Updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </header>

          {headings.length > 0 && (
            <nav className="not-prose mb-10 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#666666]">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {headings.map((heading, i) => (
                  <li key={i}>
                    <a
                      href={`#${heading.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`}
                      className="text-sm text-[#666666] transition-colors hover:text-[#0A0A0A]"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="prose prose-lg max-w-none prose-headings:text-[#0A0A0A] prose-headings:scroll-mt-20 prose-p:text-[#333333] prose-a:text-[#0A0A0A] prose-a:no-underline prose-a:font-medium prose-a:transition-colors hover:prose-a:text-[#666666] prose-strong:text-[#0A0A0A] prose-code:rounded prose-code:bg-[#F5F5F5] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#0A0A0A] prose-pre:bg-[#F5F5F5] prose-table:border-collapse prose-th:border prose-th:border-[#E5E5E5] prose-th:bg-[#FAFAFA] prose-th:p-2 prose-td:border prose-td:border-[#E5E5E5] prose-td:p-2 prose-li:text-[#333333]">
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
                className="rounded-full border border-[#E5E5E5] px-3 py-1 text-sm text-[#666666]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-[#0A0A0A]">Related Articles</h2>
            <div className="not-prose grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-xl border border-[#E5E5E5] bg-white p-5 transition-all hover:border-[#0A0A0A]/30 hover:shadow-lg"
                >
                  <span className="rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs font-medium capitalize text-[#0A0A0A]">
                    {relatedPost.category}
                  </span>
                  <h3 className="mt-3 font-semibold text-[#0A0A0A]">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#666666]">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-[#0A0A0A] sm:text-2xl">Build Your Store with AI</h3>
          <p className="mt-2 text-sm text-[#666666] sm:text-base">
            Turn any product into a professional, high-converting store page in seconds.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-lg bg-[#0A0A0A] px-6 py-3 font-medium text-white transition-all hover:bg-[#1a1a1a]"
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
