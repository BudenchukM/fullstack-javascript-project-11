import onChange from 'on-change';

const createView = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.valid':
        if (!state.form.valid) {
          elements.input.classList.add('is-invalid');
          elements.feedback.textContent = state.form.error;
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.textContent = 'RSS added successfully';
          elements.feedback.classList.remove('text-danger');
          elements.feedback.classList.add('text-success');
          setTimeout(() => {
            elements.feedback.textContent = '';
          }, 3000);
        }
        break;

      case 'feeds':
        elements.feedsContainer.innerHTML = state.feeds.map((feed) => `
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${feed.title}</h5>
                <p class="card-text">${feed.url}</p>
              </div>
            </div>
          </div>
        `).join('');
        break;

      default:
        break;
    }
  });

  return watchedState;
};

export default createView;
