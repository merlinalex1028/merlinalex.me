import { describe, it, expect } from 'vitest';
import { articleSchema, personSchema, breadcrumbSchema } from '../json-ld';

describe('articleSchema', () => {
  it('generates valid Article schema with required fields', () => {
    const schema = articleSchema({
      headline: 'Test Article',
      description: 'A test article description',
      url: 'https://merlinalex.me/articles/test',
      datePublished: '2026-01-01',
      authorName: 'merlinalex',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Test Article');
    expect(schema.description).toBe('A test article description');
    expect(schema.url).toBe('https://merlinalex.me/articles/test');
    expect(schema.datePublished).toBe('2026-01-01');
  });

  it('defaults dateModified to datePublished when omitted', () => {
    const schema = articleSchema({
      headline: 'Test',
      description: 'Desc',
      url: 'https://example.com',
      datePublished: '2026-01-01',
      authorName: 'author',
    });

    expect(schema.dateModified).toBe('2026-01-01');
  });

  it('uses provided dateModified when given', () => {
    const schema = articleSchema({
      headline: 'Test',
      description: 'Desc',
      url: 'https://example.com',
      datePublished: '2026-01-01',
      dateModified: '2026-06-01',
      authorName: 'author',
    });

    expect(schema.dateModified).toBe('2026-06-01');
  });

  it('includes author as Person object', () => {
    const schema = articleSchema({
      headline: 'Test',
      description: 'Desc',
      url: 'https://example.com',
      datePublished: '2026-01-01',
      authorName: 'merlinalex',
      authorUrl: 'https://github.com/merlinalex',
    });

    const author = schema.author as Record<string, unknown>;
    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('merlinalex');
    expect(author.url).toBe('https://github.com/merlinalex');
  });

  it('includes image when provided', () => {
    const schema = articleSchema({
      headline: 'Test',
      description: 'Desc',
      url: 'https://example.com',
      datePublished: '2026-01-01',
      authorName: 'author',
      image: 'https://example.com/og.png',
    });

    expect(schema.image).toBe('https://example.com/og.png');
  });
});

describe('personSchema', () => {
  it('generates valid Person schema', () => {
    const schema = personSchema({
      name: 'merlinalex',
      url: 'https://merlinalex.me',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('merlinalex');
    expect(schema.url).toBe('https://merlinalex.me');
  });

  it('includes sameAs links when provided', () => {
    const schema = personSchema({
      name: 'merlinalex',
      url: 'https://merlinalex.me',
      sameAs: ['https://github.com/merlinalex', 'https://twitter.com/merlinalex'],
    });

    expect(schema.sameAs).toEqual([
      'https://github.com/merlinalex',
      'https://twitter.com/merlinalex',
    ]);
  });

  it('includes image when provided', () => {
    const schema = personSchema({
      name: 'merlinalex',
      url: 'https://merlinalex.me',
      image: 'https://merlinalex.me/avatar.png',
    });

    expect(schema.image).toBe('https://merlinalex.me/avatar.png');
  });
});

describe('breadcrumbSchema', () => {
  it('generates valid BreadcrumbList schema', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', url: 'https://merlinalex.me' },
      { name: 'Articles', url: 'https://merlinalex.me/articles' },
      { name: 'My Post', url: 'https://merlinalex.me/articles/my-post' },
    ]);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');

    const items = schema.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items[0]['@type']).toBe('ListItem');
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe('Home');
    expect(items[1].position).toBe(2);
    expect(items[2].position).toBe(3);
  });

  it('handles single item breadcrumb', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', url: 'https://merlinalex.me' },
    ]);

    const items = schema.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(1);
    expect(items[0].position).toBe(1);
  });
});
