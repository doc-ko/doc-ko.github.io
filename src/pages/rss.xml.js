import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts.js';

export async function GET(context) {
    const posts = await getPosts();
    return rss({
        title: 'Karl Oberio',
        description: 'Writing by Karl Oberio',
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: postUrl(post),
        })),
    });
}
