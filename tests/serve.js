// A tiny static server for dist/, so the grid test needs no extra tooling.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.argv[2]);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, 'http://x').pathname));
    const file = join('dist', path.endsWith('/') ? `${path}index.html` : path);
    try {
        response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
        response.end(await readFile(file));
    } catch {
        response.writeHead(404).end('not found');
    }
}).listen(port);
