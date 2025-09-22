import initView from './view.js';
import { urlSchema } from './validators.js';
import { loadFeed } from './api.js';
import { makeId } from './utils.js';

// элементы — подстраховка: подбираем селекторы гибко
const form = document.querySelector('form');
const input = document.querySelector('input[name="url"]') || document.querySelector('input[type="text"]');
const submit = document.querySelector('button[type="submit"]');
const feedsContainer = document.querySelector('#feeds');
const postsContainer = document.querySelector('#posts');
// элемент для сообщения об ошибке — bootstrap invalid-feedback
let feedback = document.querySelector('.invalid-feedback');
if (!feedback) {
  // создаём под полем ввода, если нет
  feedback = document.createElement('div');
  feedback.className = 'invalid-feedback';
  input.insertAdjacentElement('afterend', feedback);
}

const elements = {
  form,
  input,
  submit,
  feeds: feedsContainer,
  posts: postsContainer,
  feedback,
};

const state = {
  feeds: [],
  posts: [],
  ui: {
    status: 'idle',
    error: null,
  },
  handlers: {},
};

function addFeed(url) {
  state.ui.status = 'loading';
  state.ui.error = null;
  const existingUrls = state.feeds.map((f) => f.url);
  return urlSchema(existingUrls).validate(url)
    .then(() => loadFeed(url))
    .then((result) => {
      // result: { url, feed: {title, description}, posts: [...] }
      const feedId = makeId();
      const feed = {
        id: feedId,
        url: result.url,
        title: result.feed.title,
        description: result.feed.description,
      };
      state.feeds.push(feed);

      const newPosts = result.posts.map((p) => ({
        id: makeId(),
        feedId,
        title: p.title,
        link: p.link,
        description: p.description,
      }));
      state.posts = state.posts.concat(newPosts);

      state.ui.status = 'success';
      // UX: очистка поля и фокус
      elements.input.value = '';
      elements.input.focus();
      return Promise.resolve();
    })
    .catch((err) => {
      // нормируем текст ошибки для UI
      let message = err.message || 'Неизвестная ошибка';
      if (err.name === 'ValidationError') {
        message = err.message;
      } else if (message === 'invalidRss') {
        message = 'Ресурс не содержит корректный RSS';
      } else if (message === 'networkError') {
        message = 'Ошибка сети. Попробуйте позже';
      }
      state.ui.error = message;
      state.ui.status = 'error';
      return Promise.reject(err);
    });
}

state.handlers.addFeed = addFeed;

initView(state, elements);
