import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const render = () => {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container mt-5">
      <h1 class="mb-4">RSS Aggregator</h1>
      <form id="rss-form" class="mb-5">
        <div class="row">
          <div class="col-8">
            <input 
              type="text" 
              id="url-input" 
              class="form-control" 
              placeholder="RSS URL" 
              required
            >
          </div>
          <div class="col-4">
            <button 
              type="submit" 
              class="btn btn-primary w-100"
            >
              Add
            </button>
          </div>
        </div>
      </form>
      <div id="feeds" class="row"></div>
    </div>
  `;

  const form = document.getElementById('rss-form');
  const input = document.getElementById('url-input');
  const feedsContainer = document.getElementById('feeds');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const url = input.value.trim();
    
    // Валидация URL
    if (!url) {
      // Здесь можно добавить обработку ошибок
      console.error('URL is required');
      return;
    }

    // Создаем промис для обработки RSS
    new Promise((resolve) => {
      console.log('Adding RSS:', url);
      // Здесь будет реальная логика загрузки RSS
      // Пока просто имитируем успешную загрузку
      setTimeout(() => resolve({ url, title: `Feed ${Date.now()}` }), 1000);
    })
    .then((feed) => {
      // Добавляем новый фид в список
      feedsContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${feed.title}</h5>
              <p class="card-text">${feed.url}</p>
            </div>
          </div>
        </div>`
      );
      input.value = '';
    })
    .catch((error) => {
      console.error('Error adding RSS feed:', error);
      // Здесь можно добавить отображение ошибки пользователю
    });
  };

  form.addEventListener('submit', handleFormSubmit);
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', render);
