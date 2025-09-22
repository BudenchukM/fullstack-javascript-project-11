import { parseRss } from './parser.js';

// ВАЖНО: полный внешний URL
const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

export const loadFeed = (url) => {
  return fetch(proxy + encodeURIComponent(url))
    .then((res) => {
      if (!res.ok) {
        throw new Error('networkError');
      }
      return res.json();
    })
    .then((data) => parseRss(data.contents))
    .then((parsed) => ({ url, ...parsed }))
    .catch((err) => Promise.reject(err));
};
