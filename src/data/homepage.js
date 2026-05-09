// Edit this file for homepage words, lists, and links.
// The Astro components read from these plain objects, so most routine
// homepage updates should not require changing component markup.

export const homepage = {
    meta: {
        title: 'Karl Oberio | Technical Writer',
        description:
            'Karl Oberio is a technical writer working at the intersection of mathematics, language, philosophy, and computation.',
    },
    hero: {
        kicker: 'Karl Oberio',
        headline: 'Technical writing as mathematical notation.',
        lede:
            'A small public notebook for developer documentation, formal ideas, linguistic structure, and the diagrams that make abstractions easier to hold.',
        lemma: {
            label: 'Working lemma',
            notation: 'docs = context + operation + consequence',
            body:
                'Good documentation behaves like a proof: every symbol introduced, every inference visible, no needless ornament.',
        },
        links: [
            { label: 'writing samples', href: '/work/' },
            { label: 'about', href: '/about/' },
            { label: 'email', href: 'mailto:yarn@docko.dev' },
        ],
        margin: {
            label: 'marginal note',
            body:
                'The page is intentionally quiet: a homepage closer to lecture notes than a portfolio pitch.',
        },
    },
    sections: {
        fields: {
            number: '01',
            title: 'One desk, four shelves.',
            note:
                'The visual system treats the site as a mathematical notebook: definitions, sketches, and cross-references before presentation polish.',
            marginLabel: 'index',
            margin:
                'Each field is a shelf in the garden. The homepage should let them touch without turning into a resume.',
        },
        writing: {
            number: '02',
            title: 'Selected writing paths.',
            note: 'A sparse list, closer to a bibliography than a project gallery.',
            marginLabel: 'notation',
            margin:
                'The monospace fragments are labels, not slogans: a tiny reminder of the operation each page performs.',
        },
        method: {
            number: '03',
            title: 'Small formal blocks.',
            note: 'Definitions and propositions give the page its lecture-note rhythm.',
        },
    },
    fields: [
        {
            symbol: '∑',
            title: 'mathematics',
            description: 'proof structure, notation, abstraction',
            accent: 'amber',
        },
        {
            symbol: 'λ',
            title: 'computer science',
            description: 'interfaces, state, developer tools',
            accent: 'cyan',
        },
        {
            symbol: 'φ',
            title: 'philosophy',
            description: 'definitions, arguments, careful distinctions',
            accent: 'violet',
        },
        {
            symbol: '⟦x⟧',
            title: 'linguistics',
            description: 'syntax, semantics, language as system',
            accent: 'paper',
        },
    ],
    writing: [
        {
            kind: 'API note',
            title: 'API Docs Snippet',
            href: '/work/api-docs-snippet/',
            description: 'Authentication, errors, and response conventions in compact form.',
            notation: 'request → response',
            accent: 'cyan',
        },
        {
            kind: 'Workflow',
            title: 'Building Redoc Output from OpenAPI Specs',
            href: '/work/redoc-openapi/',
            description: 'A practical path from exported OpenAPI source to publishable reference output.',
            notation: 'spec → render → publish',
            accent: 'amber',
        },
        {
            kind: 'Garden note',
            title: 'Notebook fragments',
            href: '/blog/',
            description: 'Short public notes and unfinished paths through adjacent ideas.',
            notation: 'draft ⊂ archive',
            accent: 'violet',
        },
    ],
    propositions: [
        {
            kind: 'Definition',
            title: 'A technical note',
            notation: 'note := term + example + boundary',
            body:
                'A note is useful when it gives a reader a stable term, a concrete instance, and a visible edge where the claim stops.',
            accent: 'amber',
        },
        {
            kind: 'Proposition',
            title: 'Diagrams lower the cost of re-reading',
            notation: 'picture ⊢ memory',
            body:
                'A restrained diagram can carry state, hierarchy, and implication without asking the prose to do every job at once.',
            accent: 'cyan',
        },
        {
            kind: 'Corollary',
            title: 'Voice follows structure',
            notation: 'structure ⇒ tone',
            body:
                'When the page already has order, the prose can stay plain, personal, and precise.',
            accent: 'violet',
        },
    ],
    garden: {
        number: '04 / contact and paths',
        heading: 'Digital garden index',
        note:
            'A homepage can be a table of contents: fields, samples, notes, contact, and a few symbols that explain how to read the place.',
        links: [
            { label: 'work', href: '/work/' },
            { label: 'blog', href: '/blog/' },
            { label: 'tags', href: '/tags/' },
            { label: 'github', href: 'https://github.com/doc-ko' },
        ],
    },
};
