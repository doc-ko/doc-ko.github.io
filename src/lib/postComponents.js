import CodeBlock from '../components/CodeBlock.astro';
import Highlight from '../components/Highlight.astro';
import Note from '../components/Note.astro';

// Passed to <Content> so a post can use these without an import line.
export const postComponents = { CodeBlock, Highlight, Note };
