import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime()
	);

	return rss({
		title: 'Genesis Tadeo',
		description: "Delivering people's need through my knowledge and craft.",
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description ?? '',
			link: `/posts/${post.id}/`,
		})),
	});
}
