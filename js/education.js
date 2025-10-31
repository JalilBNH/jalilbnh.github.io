// phone 
const navBtn = document.getElementById('navToggle');
const navMenu = document.getElementById('nav');
if (navBtn && navMenu) {
  navBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

function fmtMonthYear(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const m = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const y = d.getFullYear();
  return `${m} ${y}`;
}

(function () {
  const list = document.getElementById('educationList');
  const empty = document.getElementById('educationEmpty');
  if (!list) return;

  fetch('json/education.json')
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items) || !items.length) {
        if (empty) empty.style.display = 'block';
        return;
      }

      items.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      list.innerHTML = '';

      items.forEach(ed => {
        const li = document.createElement('li');
        li.className = 'education-item';

        const dates = document.createElement('div');
        dates.className = 'education-date';
        const start = fmtMonthYear(ed.startDate);
        const end = ed.endDate ? fmtMonthYear(ed.endDate) : 'Présent';
        dates.innerHTML = `
          <div class="period">
            <span class="start">${end}</span>
            <span class="dash">|</span>
            <span class="end">${start}</span>
          </div>
        `;

        const content = document.createElement('div');
        content.className = 'education-content';

        const header = document.createElement('div');
        header.className = 'education-header';

        header.innerHTML = `<h2>${ed.degree || 'No title'}</h2>`;
        const intro = document.createElement('p');
        intro.textContent = ed.intro || '';

        const schoolInfo = document.createElement('div');
        schoolInfo.className = 'education-school';
        schoolInfo.textContent = [ed.university, ed.location].filter(Boolean).join(' - ');

        const tags = document.createElement('div');
        tags.className = 'education-tags';
        if (Array.isArray(ed.courses)) {
          ed.courses.forEach(c => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = c;
            tags.appendChild(span);
          });
        }

        content.appendChild(header);
        if (ed.intro) content.appendChild(intro);
        if (ed.university || ed.location) content.appendChild(schoolInfo);
        content.appendChild(tags);

        li.appendChild(dates);
        li.appendChild(content);
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.log('Error Loading:', err);
      if (empty) empty.style.display = 'block';
    });
})();

(function () {
  const grid = document.getElementById('certList');
  const empty = document.getElementById('certEmpty');
  if (!grid) return;

  fetch('json/certifications.json')
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items) || !items.length) {
        if (empty) empty.style.display = 'block';
        return;
      }
      grid.innerHTML = '';

      items.forEach(c => {
        const card = document.createElement('li');
        card.className = 'cert-card';

        if (c.image) {
          const img = document.createElement('img');
          img.className = 'cert-cover';
          img.src = c.image;
          img.alt = c.name ? `Certification ${c.name}` : 'Certification';
          card.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'cert-body';

        const h3 = document.createElement('h3');
        h3.className = 'cert-title';
        if (c.link) {
          const a = document.createElement('a');
          a.href = c.link;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = c.name || 'No title';
          h3.appendChild(a);
        } else {
          h3.textContent = c.name || 'No title';
        }

        const tags = document.createElement('div');
        tags.className = 'cert-tags';
        if (Array.isArray(c.skills)) {
          c.skills.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'tag';
            chip.textContent = t;
            tags.appendChild(chip);
          });
        }

        body.appendChild(h3);
        body.appendChild(tags);
        card.appendChild(body);
        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.log('Error loading:', err);
      if (empty) empty.style.display = 'block';
    });
})();
