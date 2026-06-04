import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('microblog');

  const sorted = posts
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
    .map((post) => ({
      id: post.id,
      publishedAt: post.data.publishedAt.toISOString(),
      content: post.data.content,
      mood: post.data.mood ?? null,
      tags: post.data.tags ?? [],
      images: post.data.images ?? [],
    }));

  return new Response(JSON.stringify(sorted), {
    headers: { 'Content-Type': 'application/json' },
  });
}
