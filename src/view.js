import onChange from 'on-change';

const renderFeeds = (feeds, container) => {
  container.innerHTML = '';
  feeds.forEach((feed) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${feed.title}</h5>
        <p class="card-text">${feed.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
};

const renderPosts = (posts, container) => {
  container.innerHTML = '';
  const list = document.createElement('ul');
  list.className = 'list-group';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
    list.appendChild(li);
  });
  container.appendChild(list);
};

const renderError = (error, input, feedback) => {
  if (!error) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    return;
  }
  input.classList.add('is-invalid');
  feedback.textContent = error;
};

export default function initView(state, elems) {
  return onChange(state, (path) => {
    if (path === 'feeds') {
      renderFeeds(state.feeds, elems.feeds);
    }
    if (path === 'posts') {
      renderPosts(state.posts, elems.posts);
    }
    if (path === 'ui.error') {
      renderError(state.ui.error, elems.input, elems.feedback);
    }
  });
}
