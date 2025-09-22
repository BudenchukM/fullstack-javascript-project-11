export const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    return Promise.reject(new Error('invalidRss'));
  }

  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title')?.textContent ?? '';
  const feedDescription = channel.querySelector('description')?.textContent ?? '';

  const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
  }));

  return Promise.resolve({ feed: { title: feedTitle, description: feedDescription }, posts: items });
};
