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
          <h1 className="text-4xl font-bold tracking-tight text-[#0A0A0A] md:text-5xl">
            Dropshipping Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#666666]">
            Expert strategies, tips, and insights to help you build a successful
            dropshipping business.
          </p>
        </header>

        <div className="not-prose mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="rounded-full bg-[#0A0A0A] px-4 py-2 text-sm font-medium text-white"
          >
            All Posts
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className="rounded-full border border-[#E5E5E5] px-4 py-2 text-sm font-medium capitalize text-[#666666] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
            >
              {category}
            </Link>
          ))}
        </div>

        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="not-prose mb-10 block overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white no-underline transition-all hover:border-[#0A0A0A]/30 hover:shadow-lg [&_*]:no-underline"
          >
            <div className="flex aspect-[21/9] items-center justify-center bg-[#0A0A0A]">
              <img src="/logo.png" alt="Dropwiz" className="h-16 w-auto brightness-0 invert opacity-20" />
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-[#0A0A0A] px-3 py-1 text-xs font-medium capitalize text-white">
                  {featuredPost.category}
                </span>
                <span className="text-sm text-[#666666]">
                  {featuredPost.readTime} read
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#0A0A0A] md:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-[#666666]">
                {featuredPost.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#666666]">
                <span className="font-medium text-[#0A0A0A]">{featuredPost.author.name}</span>
                <span>·</span>
                <span>
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
              className="group rounded-xl border border-[#E5E5E5] bg-white no-underline transition-all hover:border-[#0A0A0A]/30 hover:shadow-lg"
            >
              <div className="flex aspect-video items-center justify-center bg-[#0A0A0A]">
                <img src="/logo.png" alt="Dropwiz" className="h-10 w-auto brightness-0 invert opacity-20" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs font-medium capitalize text-[#0A0A0A]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[#999999]">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0A0A0A] transition-colors group-hover:text-[#0A0A0A]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#666666]">
                  {post.excerpt}
                </p>
                <div className="mt-3 text-xs text-[#999999]">
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

        <div className="not-prose mt-12 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-[#0A0A0A] sm:text-2xl">Ready to Build Your Store?</h3>
          <p className="mt-2 text-sm text-[#666666] sm:text-base">
            Turn any product into a professional store page in seconds with AI.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-lg bg-[#0A0A0A] px-6 py-3 font-medium text-white transition-all hover:bg-[#1a1a1a]"
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
