// Turn links marked with data-email into working mailto links. The address
// arrives reversed (see src/data/contact.js) so scrapers reading the HTML miss it.
for (const link of document.querySelectorAll('a[data-email]')) {
    const address = [...link.dataset.email].reverse().join('');
    link.href = `mailto:${address}`;
    if (!link.textContent.trim()) {
        link.textContent = address;
    }
}
