import remarkDirective from 'remark-directive';

// AI-generated text is declared by hand, never detected. In Markdown, mark a
// phrase with :ai[...] and whole blocks with a :::ai container; unmarked text
// counts as written by Karl. Each marked element gets data-origin="ai", which
// is what global.css styles. A phrase can carry an explanation that shows on
// hover and focus: :ai[AInese]{note="..."}.

const TAG = {
    textDirective: 'span',
    leafDirective: 'p',
    containerDirective: 'div',
};

export function remarkAiText() {
    return (tree, file) => {
        transform(tree, String(file.value ?? ''));
    };
}

function transform(parent, source) {
    if (!parent.children) {
        return;
    }

    parent.children = parent.children.map((node) => {
        if (!(node.type in TAG)) {
            transform(node, source);
            return node;
        }

        if (node.name !== 'ai') {
            return restore(node, source);
        }

        transform(node, source);
        const note = node.type === 'textDirective' ? node.attributes?.note : undefined;
        node.data = {
            hName: TAG[node.type],
            hProperties: {
                className: ['ai-text'],
                dataOrigin: 'ai',
                // A note replaces the browser tooltip and needs focus so
                // keyboard users can reach it.
                ...(note ? { tabIndex: 0 } : { title: 'AI-generated' }),
            },
        };
        node.children.unshift(screenReaderLabel());
        if (note) {
            node.children.push(noteText(note));
        }
        return node;
    });
}

// remark-directive treats any ":word" as a directive, so ordinary text such as
// "ratio a:b" would otherwise disappear. Put the original source back.
function restore(node, source) {
    const { start, end } = node.position ?? {};
    const value = start && end ? source.slice(start.offset, end.offset) : `:${node.name}`;
    const text = { type: 'text', value };

    return node.type === 'textDirective' ? text : { type: 'paragraph', children: [text] };
}

function screenReaderLabel() {
    return {
        type: 'text',
        value: 'AI-generated: ',
        data: {
            hName: 'span',
            hProperties: { className: ['visually-hidden'] },
        },
    };
}

function noteText(note) {
    return {
        type: 'text',
        value: note,
        data: {
            hName: 'span',
            hProperties: { className: ['ai-note'] },
        },
    };
}

export const aiTextPlugins = [remarkDirective, remarkAiText];
