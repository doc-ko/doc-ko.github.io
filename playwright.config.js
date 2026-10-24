import { defineConfig } from '@playwright/test';

// The grid check runs against the built site (npm run build first), served by
// a small static server on its own port so it never touches the dev server.
const PORT = 4323;

export default defineConfig({
    testDir: 'tests',
    use: { baseURL: `http://localhost:${PORT}` },
    webServer: {
        command: `node tests/serve.js ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
    },
});
