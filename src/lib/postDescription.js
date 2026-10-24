// The text a post's link preview shows when its frontmatter has no description:
// the first paragraph of prose, with the Markdown stripped and cut at a word.
const LIMIT = 150;

export function postDescription(post) {
    if (post.data.description) return post.data.description;

    const paragraph = (post.body ?? '')
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .find((block) => block && !/^(#|import |export |<|```|:::|\$\$|[-*>|]|\d+\.)/.test(block));
    if (!paragraph) return undefined;

    const text = paragraph
        .replace(/:[a-z]+\[([^\]]*)\](\{[^}]*\})?/g, '$1')
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ');
    if (text.length <= LIMIT) return text;
    return text.slice(0, LIMIT).replace(/\s+\S*$/, '') + '…';
}
