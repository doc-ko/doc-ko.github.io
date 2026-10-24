import MarginNote from '../components/MarginNote.astro';
import NoteBlock from '../components/NoteBlock.astro';

// Passed to <Content> so a post can use these without an import line.
export const postComponents = { MarginNote, NoteBlock };
