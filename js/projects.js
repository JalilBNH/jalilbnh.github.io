// phone
const navBtn = document.getElementById('navToggle');
const navMenu = document.getElementById('nav');
if (navBtn && navMenu) {
  navBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

//  projects 
(function(){
  const list = document.getElementById('projectList');
  if (!list) return;

  fetch('json/projects.json')
    .then(r => r.json())
    .then(items => {
      if (!Array.isArray(items) || !items.length) return;

      items.forEach(p => {
        const li = document.createElement('li');
        li.className = 'project-card';

        if (p.image) {
          const img = document.createElement('img');
          img.className = 'project-cover';
          img.src = p.image;
          img.alt = p.title ? `Project Image ${p.title}` : 'Project Image';
          li.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'project-body';

        const h3 = document.createElement('h3');
        h3.className = 'project-title';
        if (p.link) {
          const a = document.createElement('a');
          a.href = p.link;
          a.target = '_blank';
          a.rel = 'noopener';
          a.innerHTML = p.title || 'No title';
          h3.appendChild(a);
        } else {
          h3.innerHTML = p.title || 'No title';
        }

        const intro = document.createElement('p');
        intro.innerHTML = p.description || '';

        const feats = document.createElement('ul');
        feats.className = 'project-features';
        if (Array.isArray(p.points)) {
          p.points.forEach(txt => {
            const liPoint = document.createElement('li');
            liPoint.innerHTML = txt;
            feats.appendChild(liPoint);
          });
        }

        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'project-tags';
        if (Array.isArray(p.skills)) {
          p.skills.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'tag';
            chip.innerHTML = t;
            tagsWrap.appendChild(chip);
          });
        }

        body.appendChild(h3);
        body.appendChild(intro);
        body.appendChild(feats);
        body.appendChild(tagsWrap);

        li.appendChild(body);
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.log('Error Loading:', err);
    });
})();
