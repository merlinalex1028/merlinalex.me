/**
 * JSON-LD schema generators for structured data.
 * Produces schema.org objects consumed by JsonLd.astro component.
 */

interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName: string;
  authorUrl?: string;
}

interface PersonInput {
  name: string;
  url: string;
  image?: string;
  sameAs?: string[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Generate an Article schema. */
export function articleSchema(input: ArticleInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: input.authorName,
      url: input.authorUrl,
    },
    image: input.image,
  };
}

/** Generate a Person schema. */
export function personSchema(input: PersonInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    url: input.url,
    image: input.image,
    sameAs: input.sameAs,
  };
}

/** Generate a BreadcrumbList schema. */
export function breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
