import remarkDirective from 'remark-directive';
import { remarkEmail } from './remarkEmail.js';
import { remarkAiText } from './remarkAiText.js';

// remarkEmail runs first so an :email[] inside an :ai[...] phrase still works.
export const markdownPlugins = [remarkDirective, remarkEmail, remarkAiText];
