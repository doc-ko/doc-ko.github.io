export const siteName = 'oberio.me';
export const site = 'https://oberio.me';

export const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });
