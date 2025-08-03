import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import initApp from './app.js';

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
              name="url"
              class="form-control" 
              placeholder="RSS URL" 
              required
              autofocus
            >
            <div id="feedback" class="form-text"></div>
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

  initApp();
};

document.addEventListener('DOMContentLoaded', render);
