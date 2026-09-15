import { projects } from "./projects-20260915.js";

const visual = (project) => project.image
  ? `<div class="project-visual image-visual image-${project.imageShape || "desktop"}"><img src="${project.image}" alt="${project.imageAlt}" decoding="async"><span class="project-arrow" aria-hidden="true">↗</span></div>`
  : `<div class="project-visual party-visual" aria-hidden="true">
      <div class="party-window"><div class="window-bar"><span></span><span></span><span></span></div>
        <div class="party-layout"><div class="party-copy"><small>FIND YOUR SQUAD</small><strong>Good games start with the right people.</strong><i></i></div>
          <div class="party-card party-card-back"><span>03 / 05</span></div>
          <div class="party-card party-card-front"><span>ONLINE</span><b>Night run</b><small>Ranked · LATAM</small></div>
        </div>
      </div><span class="project-arrow" aria-hidden="true">↗</span>
    </div>`;

const projectList = document.querySelector("#project-list");
projectList.innerHTML = projects.map((project, index) => `
  <article class="project-card project-${project.accent} ${index % 2 ? "project-reversed" : ""} reveal">
    <a href="${project.url}" target="_blank" rel="noreferrer" class="project-hitbox" aria-label="Abrir ${project.name} en una pestaña nueva"></a>
    <div class="project-info">
      <div class="project-meta"><span>${project.index}</span><span>${project.eyebrow}</span><span class="project-status">${project.status}</span></div>
      <h3>${project.name}</h3><p>${project.description}</p>
      <ul class="stack-list" aria-label="Tecnologías de ${project.name}">${project.stack.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>${visual(project)}
  </article>`).join("");

document.querySelector("#year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}
