import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft
  );

  const sorted = articles.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'merlinalex.me',
    description: '二次元可爱风个人站',
    site: context.site!,
    items: sorted.map(article => ({
      title: article.data.title,
      pubDate: article.data.publishedAt,
      description: article.data.description || '',
      link: `/articles/${article.id}/`,
      author: 'merlinalex',
      categories: article.data.category ? [article.data.category] : [],
    })),
    customData: '<language>zh-CN</language>',
  });
}
