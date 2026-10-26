import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Every page in dist/ is a route: dist/about/index.html is /about/.
export function routes(dir = 'dist', base = '') {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return routes(path, `${base}/${name}`);
        return name === 'index.html' ? [`${base}/`] : [];
    });
}

export const viewports = [
    { name: 'phone', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 900 },
];
