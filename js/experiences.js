// phone
const navBtn = document.getElementById("navToggle");
const navMenu = document.getElementById("nav");

if (navBtn && navMenu) {
  navBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

(function () {
  const list = document.getElementById("experienceList");
  const btnMore = document.getElementById("experienceShowMore");
  const msgEmpty = document.getElementById("experienceEmpty");

  if (!list) return;

  let items = [];
  let shown = 0;
  const firstLoad = 3;
  const step = 3;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = d.getFullYear();
    return `${month} ${year}`;
  }

  function renderItem(exp) {
    const li = document.createElement("li");
    li.className = "experience-item";

    const dateDiv = document.createElement("div");
    dateDiv.className = "experience-date";

    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : "Présent";

    dateDiv.innerHTML = `
      <div class="period">
        <span class="start">${start}</span>
        <span class="dash">-</span>
        <span class="end">${end}</span>
      </div>
    `;

    const contentDiv = document.createElement("div");
    contentDiv.className = "experience-content";

    const headerDiv = document.createElement("div");
    headerDiv.className = "experience-header";

    const h2 = document.createElement("h2");

    if (exp.link) {
      const a = document.createElement("a");
      a.href = exp.link;
      a.target = "_blank"; 
      a.rel = "noopener noreferrer";
      a.textContent = exp.title || "No title";
      h2.appendChild(a);
    } else {
      h2.textContent = exp.title || "No title";
    }

    const locationSpan = document.createElement("span");
    locationSpan.className = "location";
    locationSpan.textContent = exp.location || "";

    headerDiv.appendChild(h2);
    headerDiv.appendChild(locationSpan);

    const introP = document.createElement("p");
    introP.innerHTML = exp.intro || "";

    const taskUl = document.createElement("ul");
    taskUl.className = "tasks";
    if (Array.isArray(exp.tasks)) {
      exp.tasks.forEach((t) => {
        const liTask = document.createElement("li");
        liTask.innerHTML = t;
        taskUl.appendChild(liTask);
      });
    }

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "experience-tags";
    if (Array.isArray(exp.skills)) {
      exp.skills.forEach((skill) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.innerHTML = skill;
        tagsDiv.appendChild(span);
      });
    }

    const mentorsDiv = document.createElement("div");
    mentorsDiv.className = "experience-mentors";
    if (Array.isArray(exp.mentors)) {
      exp.mentors.forEach((m) => {
        const a = document.createElement("a");
        a.href = `mailto:${m.email}`;
        a.innerHTML = m.name;
        mentorsDiv.appendChild(a);
      });
    }

    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(introP);
    contentDiv.appendChild(taskUl);
    contentDiv.appendChild(tagsDiv);
    contentDiv.appendChild(mentorsDiv);

    li.appendChild(dateDiv);
    li.appendChild(contentDiv);
    list.appendChild(li);
  }

  function renderNext(n) {
    const next = items.slice(shown, shown + n);
    next.forEach(renderItem);
    shown += next.length;
    if (btnMore) {
      btnMore.style.display = shown < items.length ? "inline-block" : "none";
    }
  }

  fetch("json/experiences.json")
    .then((res) => res.json())
    .then((data) => {
      items = Array.isArray(data) ? data : [];
      items.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      if (!items.length) {
        if (msgEmpty) msgEmpty.style.display = "block";
        if (btnMore) btnMore.style.display = "none";
        return;
      }

      if (msgEmpty) msgEmpty.style.display = "none";
      list.innerHTML = "";
      renderNext(firstLoad);
    })
    .catch((err) => {
      console.log("Error Loading:", err);
      if (msgEmpty) msgEmpty.style.display = "block";
      if (btnMore) btnMore.style.display = "none";
    });

  if (btnMore) {
    btnMore.addEventListener("click", () => renderNext(step));
  }
})();
