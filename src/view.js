import onChange from 'on-change';

export default (state, elements) => onChange(state, (path, value) => {
  if (path === 'form.error') {
    if (value) {
      elements.input.classList.add('is-invalid');
      elements.feedback.textContent = value;
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
    } else {
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = '';
    }
  }

  if (path === 'form.valid' && value === true) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.textContent = '';
  }

  if (path === 'form.success') {
    elements.feedback.textContent = value;
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
  }

  if (path === 'feeds') {
    elements.feedsContainer.innerHTML = '';
    state.feeds.forEach((feed) => {
      const div = document.createElement('div');
      div.textContent = feed.title;
      elements.feedsContainer.appendChild(div);
    });
  }
});
