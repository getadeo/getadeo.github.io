import rss from '@astrojs/rss';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { APIContext } from 'astro';
import { getLinks, getPosts, getQuotes } from '../utils/allEntries';
import { getViaLabel } from '../utils/entries';

function excerpt(text: string, max = 72) {
	return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};

		return entities[character];
	});
}

function htmlLink(href: string, label: string) {
	return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function joinContent(parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join('\n\n');
}

async function renderMarkdown(
	processor: Awaited<ReturnType<typeof createMarkdownProcessor>>,
	body?: string
) {
	if (!body?.trim()) return '';
	return (await processor.render(body)).code;
}

export async function GET(context: APIContext) {
	const markdown = await createMarkdownProcessor({
		shikiConfig: {
			themes: {
				light: 'catppuccin-latte',
				dark: 'catppuccin-mocha',
			},
		},
	});
	const site = context.site!;
	const siteUrl = (path: string) => new URL(path, site).href;
	const [posts, links, quotes] = await Promise.all([
		getPosts(),
		getLinks(),
		getQuotes(),
	]);

	const postItems = await Promise.all(posts.map(async (post) => ({
		title: post.data.title,
		pubDate: post.data.date,
		description: post.data.description ?? excerpt(post.body?.replace(/\s+/g, ' ') ?? '', 160),
		content: await renderMarkdown(markdown, post.body),
		link: siteUrl(`/posts/${post.id}/`),
		categories: post.data.tags,
	})));

	const linkItems = await Promise.all(links.map(async (link) => {
		const viaLabel = getViaLabel(link.data.viaUrl, link.data.viaTitle);
		const content = joinContent([
			`<p>${htmlLink(link.data.url, link.data.title)}</p>`,
			viaLabel && link.data.viaUrl && `<p>Via ${htmlLink(link.data.viaUrl, viaLabel)}</p>`,
			link.data.quote && `<blockquote>${escapeHtml(link.data.quote)}</blockquote>`,
			link.data.description && `<p>${escapeHtml(link.data.description)}</p>`,
			await renderMarkdown(markdown, link.body),
			`<p>${htmlLink(link.data.url, 'Visit original')}</p>`,
		]);

		return {
			title: link.data.title,
			pubDate: link.data.date,
			description: link.data.description ?? link.data.quote ?? `Saved link to ${link.data.url}.`,
			content,
			link: siteUrl(`/links/${link.id}/`),
			categories: link.data.tags,
		};
	}));

	const quoteItems = await Promise.all(quotes.map(async (quote) => {
		const citation = quote.data.sourceUrl
			? htmlLink(quote.data.sourceUrl, quote.data.source)
			: escapeHtml(quote.data.source);
		const content = joinContent([
			`<blockquote>${escapeHtml(quote.data.quote)}</blockquote>`,
			`<p>— ${citation}${quote.data.context ? `, ${escapeHtml(quote.data.context)}` : ''}</p>`,
			await renderMarkdown(markdown, quote.body),
		]);

		return {
			title: `Quote: “${excerpt(quote.data.quote)}”`,
			pubDate: quote.data.date,
			description: `${quote.data.quote}\n\n— ${quote.data.source}${quote.data.context ? `, ${quote.data.context}` : ''}`,
			content,
			link: siteUrl(`/quotes/#${quote.id}`),
			categories: quote.data.tags,
		};
	}));

	const items = [...postItems, ...linkItems, ...quoteItems].sort(
		(a, b) => b.pubDate.getTime() - a.pubDate.getTime()
	);

	return rss({
		title: 'Genesis Tadeo — All entries',
		description: 'Posts, links, and quotes from Genesis Tadeo.',
		site,
		items,
	});
}
