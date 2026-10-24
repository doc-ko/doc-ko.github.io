import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import { remarkEmail } from './remarkEmail.js';
import { remarkAiText } from './remarkAiText.js';

// remarkMath runs before remarkDirective so `$a:b$` is not read as a directive.
// remarkEmail runs before remarkAiText so an :email[] inside an :ai[...] phrase still works.
export const markdownPlugins = [remarkMath, remarkDirective, remarkEmail, remarkAiText];
