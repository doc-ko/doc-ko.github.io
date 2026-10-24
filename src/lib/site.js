export const siteName = 'oberio.me';
export const siteDescription = 'Karl Oberio is a technical writer with engineering depth.';

export const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });
