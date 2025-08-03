import createValidator from './validator.js';
import createView from './view.js';

const initApp = () => {
  const state = {
    form: {
      valid: true,
      error: '',
    },
    feeds: [],
    urls: [],
  };

  const elements = {
    form: document.getElementById('rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.getElementById('feedback'),
    feedsContainer: document.getElementById('feeds'),
  };

  const watchedState = createView(state, elements);

  const validateUrl = (url) => {
    const validator = createValidator(watchedState.urls);
    return validator.validate({ url })
      .then(() => {
        watchedState.form.valid = true;
        return true;
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.errors[0];
        return false;
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    validateUrl(url)
      .then((isValid) => {
        if (!isValid) return;

        // Имитация загрузки RSS
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              url,
              title: `Feed ${Date.now()}`,
            });
          }, 1000);
        });
      })
      .then((feed) => {
        watchedState.urls.push(feed.url);
        watchedState.feeds.push(feed);
        elements.input.value = '';
        elements.input.focus();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  elements.form.addEventListener('submit', handleFormSubmit);
  elements.input.addEventListener('input', () => {
    if (elements.input.classList.contains('is-invalid')) {
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = '';
    }
  });
};

export default initApp;
