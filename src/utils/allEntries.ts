import { getCollection, type CollectionEntry } from 'astro:content';
import type { GetStaticPathsItem, Page } from 'astro';

export const PAGE_SIZE = 10;

export type PostEntry = CollectionEntry<'posts'>;
export type LinkEntry = CollectionEntry<'links'>;
export type QuoteEntry = CollectionEntry<'quotes'>;

export type TimelineEntry =
	| { type: 'post'; date: Date; post: PostEntry }
	| { type: 'link'; date: Date; link: LinkEntry }
	| { type: 'quote'; date: Date; quote: QuoteEntry };

const byNewest = <T extends { data: { date: Date } }>(a: T, b: T) =>
	b.data.date.getTime() - a.data.date.getTime();

const notTemplate = ({ id }: { id: string }) => !id.startsWith('_');

export async function getPosts() {
	return (await getCollection('posts', notTemplate)).sort(byNewest);
}

export async function getLinks() {
	return (await getCollection('links', ({ id, data }) =>
		notTemplate({ id }) && !data.draft
	)).sort(byNewest);
}

export async function getQuotes() {
	return (await getCollection('quotes', ({ id, data }) =>
		notTemplate({ id }) && !data.draft
	)).sort(byNewest);
}

export async function getAllEntries(): Promise<TimelineEntry[]> {
	const [posts, links, quotes] = await Promise.all([
		getPosts(),
		getLinks(),
		getQuotes(),
	]);

	return [
		...posts.map((post) => ({
			type: 'post' as const,
			date: post.data.date,
			post,
		})),
		...links.map((link) => ({
			type: 'link' as const,
			date: link.data.date,
			link,
		})),
		...quotes.map((quote) => ({
			type: 'quote' as const,
			date: quote.data.date,
			quote,
		})),
	].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function pageOne<T>(entries: T[]) {
	return entries.slice(0, PAGE_SIZE);
}

export function nextPageHref(entries: unknown[], href: string) {
	return entries.length > PAGE_SIZE ? href : undefined;
}

export function skipFirstPage(paths: GetStaticPathsItem[]) {
	return paths.filter(({ params }) => params.page !== '1');
}

export function previousPageHref(page: Pick<Page, 'currentPage' | 'url'>, firstHref: string) {
	return page.currentPage === 2 ? firstHref : page.url.prev;
}
