import { loadFeed } from './api.js';
import initView from './view.js';

const form = document.querySelector('#rss-form');
const input = document.querySelector('#url-input');
const feedback = document.querySelector('#feedback');
const feedsContainer = document.querySelector('#feeds');

// добавим контейнер для постов (его нет в твоём index.html → добавь руками)
let postsContainer = document.querySelector('#posts');
if (!postsContainer) {
  postsContainer = document.createElement('div');
  postsContainer.id = 'posts';
  postsContainer.className = 'row mt-4';
  feedsContainer.insertAdjacentElement('afterend', postsContainer);
}

const state = {
  feeds: [],
  posts: [],
  ui: {
    error: null,
  },
};

const elements = {
  form,
  input,
  feedback,
  feeds: feedsContainer,
  posts: postsContainer,
};

const watchedState = initView(state, elements);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value.trim();
  watchedState.ui.error = null;

  loadFeed(url)
    .then((result) => {
      const feed = {
        id: Date.now(),
        url: result.url,
        title: result.feed.title,
        description: result.feed.description,
      };
      watchedState.feeds.push(feed);

      const newPosts = result.posts.map((p) => ({
        id: Date.now() + Math.random(),
        feedId: feed.id,
        title: p.title,
        link: p.link,
        description: p.description,
      }));
      watchedState.posts = watchedState.posts.concat(newPosts);

      input.value = '';
      input.focus();
    })
    .catch((err) => {
      let message = 'Неизвестная ошибка';
      if (err.message === 'invalidRss') {
        message = 'Ресурс не содержит корректный RSS';
      } else if (err.message === 'networkError') {
        message = 'Ошибка сети';
      }
      watchedState.ui.error = message;
    });
});
