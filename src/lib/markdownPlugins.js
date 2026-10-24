import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import { remarkDirectives } from './remarkDirectives.js';
import { remarkEmail } from './remarkEmail.js';
import { remarkAiText } from './remarkAiText.js';

// The text that opens and closes a highlight: ==like this==. It is the same as
// :hl[like this]. Set it to null to leave == as ordinary text.
export const markShorthand = '==';

// remarkMath runs before remarkDirective so `$a:b$` is not read as a directive.
// remarkDirectives (:::note, :hl, ==, code brackets) and remarkEmail run before
// remarkAiText, which turns every directive it does not know back into text;
// remarkEmail before remarkAiText so an :email[] inside an :ai[...] phrase still works.
export const markdownPlugins = [
    remarkMath,
    remarkDirective,
    [remarkDirectives, { shorthand: markShorthand }],
    remarkEmail,
    remarkAiText,
];
