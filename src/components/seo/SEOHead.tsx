import Head from "next/head";
import { type PageMetadata, generateMetaTags } from "@/lib/seo/metadata";

type SEOHeadProps = {
  meta: PageMetadata;
  schemas?: Record<string, unknown>[];
};

export const SEOHead = ({ meta, schemas = [] }: SEOHeadProps) => {
  const tags = generateMetaTags(meta);

  return (
    <Head>
      <title>{tags.title}</title>
      <meta name="description" content={tags.description} />
      <link rel="canonical" href={tags.canonical} />

      <meta property="og:title" content={tags.openGraph.title} />
      <meta property="og:description" content={tags.openGraph.description} />
      <meta property="og:url" content={tags.openGraph.url} />
      <meta property="og:site_name" content={tags.openGraph.siteName} />
      <meta property="og:type" content={tags.openGraph.type} />
      <meta property="og:image" content={tags.openGraph.images[0].url} />
      <meta
        property="og:image:width"
        content={String(tags.openGraph.images[0].width)}
      />
      <meta
        property="og:image:height"
        content={String(tags.openGraph.images[0].height)}
      />
      <meta property="og:image:alt" content={tags.openGraph.images[0].alt} />
      {tags.openGraph.publishedTime && (
        <meta
          property="article:published_time"
          content={tags.openGraph.publishedTime}
        />
      )}
      {tags.openGraph.modifiedTime && (
        <meta
          property="article:modified_time"
          content={tags.openGraph.modifiedTime}
        />
      )}

      <meta name="twitter:card" content={tags.twitter.card} />
      <meta name="twitter:site" content={tags.twitter.site} />
      <meta name="twitter:title" content={tags.twitter.title} />
      <meta name="twitter:description" content={tags.twitter.description} />
      <meta name="twitter:image" content={tags.twitter.images[0]} />

      {tags.keywords && <meta name="keywords" content={tags.keywords} />}

      {!tags.robots.index && <meta name="robots" content="noindex,nofollow" />}

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
};
