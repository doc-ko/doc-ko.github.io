import { renderCard } from '../../../lib/ogCard.js';
import { getPosts } from '../../../lib/posts.js';
import { postDescription } from '../../../lib/postDescription.js';
import { formatDate } from '../../../lib/site.js';

export async function getStaticPaths() {
    const posts = await getPosts();
    return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export async function GET({ props: { post } }) {
    const png = await renderCard({
        title: post.data.title,
        description: postDescription(post),
        byline: [`By ${post.data.author ?? 'Karl Oberio'}`, formatDate(post.data.pubDate)],
    });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
