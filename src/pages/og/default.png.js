import { renderCard } from '../../lib/ogCard.js';
import { siteDescription } from '../../lib/site.js';

export async function GET() {
    const png = await renderCard({
        title: 'oberio.me',
        description: siteDescription,
        byline: ['By Karl Oberio (\'doc-ko\')'],
    });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
