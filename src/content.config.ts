import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentPattern = ['**/*.md', '!**/_*.md'];
const normalizeOptionalString = (value: unknown) => {
	if (typeof value !== 'string') return value;
	const trimmed = value.trim();
	return trimmed === '' ? undefined : trimmed;
};
const optionalString = z.preprocess(normalizeOptionalString, z.string().optional());
const optionalUrl = z.preprocess(normalizeOptionalString, z.url().optional());

const posts = defineCollection({
	loader: glob({ pattern: contentPattern, base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

const links = defineCollection({
	loader: glob({ pattern: contentPattern, base: './src/content/links' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		url: z.url(),
		viaUrl: optionalUrl,
		viaTitle: optionalString,
		quote: z.string().optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

const quotes = defineCollection({
	loader: glob({ pattern: contentPattern, base: './src/content/quotes' }),
	schema: z.object({
		date: z.coerce.date(),
		quote: z.string(),
		source: z.string(),
		sourceUrl: optionalUrl,
		context: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { posts, links, quotes };
