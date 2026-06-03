import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import type { APIContext } from 'astro';

const parser = new MarkdownIt();

function toAbsoluteUrls(html: string, site: URL): string {
  return html.replace(
    /((?:src|href)=["'])([^"']+)(["'])/g,
    (match, prefix, url, suffix) => {
      if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('mailto:') ||
        url.startsWith('#')
      ) {
        return match;
      }
      const absolute = new URL(url, site).toString();
      return `${prefix}${absolute}${suffix}`;
    }
  );
}

export async function GET(context: APIContext) {
  if (!context.site) {
    return new Response('Missing site config', { status: 500 });
  }

  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft
  );

  const sorted = [...articles].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'merlinalex.me',
    description: '二次元可爱风个人站 (完整内容)',
    site: context.site,
    items: sorted.map(article => {
      const rawHtml = parser.render(article.body ?? '');
      const sanitized = sanitizeHtml(rawHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      const content = toAbsoluteUrls(sanitized, context.site);

      return {
        title: article.data.title,
        pubDate: article.data.publishedAt,
        description: article.data.description || '',
        link: `/articles/${article.id}/`,
        author: 'merlinalex',
        categories: article.data.category ? [article.data.category] : [],
        content,
      };
    }),
    customData: '<language>zh-CN</language>',
  });
}
