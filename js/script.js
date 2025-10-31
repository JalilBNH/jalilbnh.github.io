// phone
const navBtn = document.getElementById('navToggle');
const navMenu = document.getElementById('nav');

if (navBtn && navMenu) {
  navBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Pc
(function() {
  const list = document.getElementById('newsList');
  const btnMore = document.getElementById('newsShowMore');
  const msgEmpty = document.getElementById('newsEmpty');

  if (!list) return; 

  let items = [];
  let shown = 0;
  const firstLoad = 3; 
  const step = 3;      

  // render news
  function renderItem(news) {
    const li = document.createElement('li');
    li.className = 'news-item';

    const dateDiv = document.createElement('div');
    dateDiv.className = 'news-date';
    let day = '', month = '', year = '';

    if (news.date) {
      const d = new Date(news.date);
      if (!isNaN(d)) {
        day = String(d.getDate()).padStart(2, '0');
        month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        year = d.getFullYear();
      } else {
        mois = news.date;
      }
    }

    dateDiv.innerHTML = `
      <div class="day">${day}</div>
      <div class="month">${month}</div>
      <div class="year">${year}</div>
    `;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'news-content';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'news-title';

    if (news.link) {
      const a = document.createElement('a');
      a.href = news.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = news.title || 'No title';
      titleDiv.appendChild(a);
    } else {
      titleDiv.innerHTML = news.title || 'No title';
    }

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'news-tags';

    if (Array.isArray(news.tags)) {
      news.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerHTML = tag;
        tagsDiv.appendChild(span);
      });
    }

    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(tagsDiv);

    li.appendChild(dateDiv);
    li.appendChild(contentDiv);
    list.appendChild(li);
  }

  function renderNext(n) {
    const next = items.slice(shown, shown + n);
    next.forEach(renderItem);
    shown += next.length;

    if (btnMore) {
      btnMore.style.display = shown < items.length ? 'inline-block' : 'none';
    }
  }

  fetch('json/news.json')
    .then(res => res.json())
    .then(data => {
      items = Array.isArray(data) ? data : [];

      items.sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        return db - da;
      });

      if (!items.length) {
        if (msgEmpty) msgEmpty.style.display = 'block';
        if (btnMore) btnMore.style.display = 'none';
        return;
      }

      if (msgEmpty) msgEmpty.style.display = 'none';
      list.innerHTML = '';
      renderNext(firstLoad);
    })
    .catch(err => {
      console.log('Error Loading:', err);
      if (msgEmpty) msgEmpty.style.display = 'block';
      if (btnMore) btnMore.style.display = 'none';
    });

  if (btnMore) {
    btnMore.addEventListener('click', () => renderNext(step));
  }
})();
