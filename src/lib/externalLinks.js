import { site } from './site.js';

// A link is external when it points at a different host from the site.
// Relative paths, #fragments and mailto:/tel: links stay in the same tab.
export function isExternal(href) {
    if (typeof href !== 'string') {
        return false;
    }

    let url;
    try {
        url = new URL(href, site);
    } catch {
        return false;
    }

    return (url.protocol === 'http:' || url.protocol === 'https:') && url.host !== new URL(site).host;
}

// Spread onto an <a>: {...externalLinkAttributes(href)}.
export function externalLinkAttributes(href) {
    return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

// Rehype plugin: adds the same attributes to external links in rendered Markdown.
export function rehypeExternalLinks() {
    return (tree) => {
        visit(tree);
    };
}

function visit(node) {
    if (node.type === 'element' && node.tagName === 'a' && isExternal(node.properties?.href)) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
    }

    node.children?.forEach(visit);
}
