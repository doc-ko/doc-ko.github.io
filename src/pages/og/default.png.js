import { renderCard } from '../../lib/ogCard.js';
import { siteDescription } from '../../lib/site.js';

export async function GET() {
    const png = await renderCard({
        title: 'Karl Oberio',
        description: siteDescription,
        byline: ['By Karl Oberio'],
    });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
