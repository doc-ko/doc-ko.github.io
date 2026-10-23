import { emailReversed } from '../data/contact.js';

// :email[] links to the contact address and shows it as the link text;
// :email[some words] uses those words instead. The HTML only carries the
// address reversed, in data-email; src/scripts/email.js builds the real link.

export function remarkEmail() {
    return (tree) => {
        transform(tree);
    };
}

function transform(parent) {
    if (!parent.children) {
        return;
    }

    for (const node of parent.children) {
        if (node.type === 'textDirective' && node.name === 'email') {
            // A new type, so remarkAiText does not turn it back into text.
            node.type = 'emailLink';
            node.data = {
                hName: 'a',
                hProperties: { dataEmail: emailReversed },
            };
        }
        transform(node);
    }
}
