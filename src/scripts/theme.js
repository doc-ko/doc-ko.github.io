// The inline script in BaseLayout sets data-theme from localStorage before
// first paint. This wires the header toggle. With no stored choice the page
// follows the system, so aria-pressed tracks the system setting too.
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
const sync = () => toggle?.setAttribute('aria-pressed', isDark().toString());

if (toggle) {
    sync();
    systemDark.addEventListener('change', sync);
    toggle.addEventListener('click', () => {
        const next = isDark() ? 'light' : 'dark';
        root.dataset.theme = next;
        try {
            localStorage.setItem('theme', next);
        } catch {}
        sync();
    });
}
