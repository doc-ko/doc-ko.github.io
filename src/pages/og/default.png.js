import { renderCard } from '../../lib/ogCard.js';
import { homepage } from '../../data/homepage.js';

export async function GET() {
    const png = await renderCard({
        title: 'oberio.me',
        description: homepage.meta.description,
        showSite: false,
        byline: ['By Karl Oberio (\'doc-ko\')'],
    });
    return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
