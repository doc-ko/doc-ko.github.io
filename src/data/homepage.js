import { load } from 'js-yaml';
import homepageYaml from './homepage.yaml?raw';

// Keep a stable JavaScript export for Astro components while making homepage
// copy easier to edit in YAML.
export const homepage = load(homepageYaml);
