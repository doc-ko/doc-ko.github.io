import { getCollection } from 'astro:content';

// All published posts, newest first.
export async function getPosts() {
    const posts = await getCollection('posts');
    return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post) {
    return `/posts/${post.id}/`;
}

export function getTags(posts) {
    return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

// Every tag with the number of posts that use it, in name order.
export function getTagCounts(posts) {
    return getTags(posts).map((tag) => [tag, posts.filter((post) => post.data.tags.includes(tag)).length]);
}
