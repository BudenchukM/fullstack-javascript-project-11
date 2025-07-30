import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Инициализация приложения
document.getElementById('app').innerHTML = `
  <div class="container mt-5">
    <h1 class="mb-4">RSS Aggregator</h1>
    <form id="rss-form" class="mb-5">
      <div class="row">
        <div class="col-8">
          <input type="text" class="form-control" placeholder="RSS URL" required>
        </div>
        <div class="col-4">
          <button type="submit" class="btn btn-primary w-100">Add</button>
        </div>
      </div>
    </form>
    <div id="feeds"></div>
  </div>
`;

// Обработка формы
document.getElementById('rss-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = e.target.querySelector('input').value;
  // Здесь будет логика добавления RSS
  console.log('Adding RSS:', url);
});
