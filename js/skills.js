// phone
const navBtn = document.getElementById('navToggle');
const navMenu = document.getElementById('nav');
if (navBtn && navMenu) {
  navBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// skills
(function(){
  const wrap = document.getElementById('skillsGroups');
  const empty = document.getElementById('skillsEmpty');
  if (!wrap) return;

  fetch('json/skills.json')
    .then(r => r.json())
    .then(data => {
      const sections = Array.isArray(data?.sections) ? data.sections : [];
      if (!sections.length) {
        if (empty) empty.style.display = 'block';
        return;
      }
      if (empty) empty.style.display = 'none';
      wrap.innerHTML = '';

      sections.forEach(sec => {
        const group = document.createElement('section');
        group.className = 'skill-group';

        const h2 = document.createElement('h2');
        h2.className = 'skill-title';
        h2.textContent = sec.title || 'No title';

        const list = document.createElement('div');
        list.className = 'skill-tags';

        if (Array.isArray(sec.items)) {
          sec.items.forEach(txt => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = txt;
            list.appendChild(tag);
          });
        }

        group.appendChild(h2);
        group.appendChild(list);
        wrap.appendChild(group);
      });
    })
    .catch(err => {
      console.log('Error Loading:', err);
      if (empty) empty.style.display = 'block';
    });
})();
