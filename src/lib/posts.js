import { getCollection } from 'astro:content';

// All published posts, newest first.
export async function getPosts() {
    const posts = await getCollection('posts');
    return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post) {
    return `/posts/${post.id}/`;
}

// A post's date as 2026-10-24, the form the site shows everywhere.
export function postDate(post) {
    return post.data.pubDate.toISOString().slice(0, 10);
}

export function getTags(posts) {
    return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}
