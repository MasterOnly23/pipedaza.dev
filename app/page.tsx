import { Reveal } from "@/components/reveal";
import { profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";

const featured = projects.filter((project) => project.category === "featured");
const secondary = projects.filter((project) => project.category === "secondary");
const experiments = projects.filter((project) => project.category === "experiment");

function ProjectVisual({ project }: { project: Project }) {
  if (project.name === "PartyUp") {
    return (
      <div className="project-visual party-visual" aria-hidden="true">
        <div className="mock-window party-window">
          <div className="window-bar"><span /><span /><span /></div>
          <div className="party-layout">
            <div className="party-copy"><small>FIND YOUR SQUAD</small><strong>Good games start with the right people.</strong><i /></div>
            <div className="party-card party-card-back"><span>03 / 05</span></div>
            <div className="party-card party-card-front"><span>ONLINE</span><b>Night run</b><small>Ranked · LATAM</small></div>
          </div>
        </div>
        <span className="project-arrow">↗</span>
      </div>
    );
  }

  return (
    <div className="project-visual ocr-visual" aria-hidden="true">
      <div className="scan-grid" />
      <div className="document document-back"><span>RAW_017.PDF</span></div>
      <div className="document document-front">
        <div className="doc-head"><span>K</span><i>PROCESSING</i></div>
        <b>Financial document</b>
        <div className="doc-lines"><i /><i /><i /><i /></div>
        <div className="doc-result"><span>Confidence</span><strong>98.4%</strong></div>
      </div>
      <span className="scan-line" />
      <span className="project-arrow">↗</span>
    </div>
  );
}

function ProjectCard({ project, reversed = false }: { project: Project; reversed?: boolean }) {
  return (
    <article className={`project-card project-${project.accent} ${reversed ? "project-reversed" : ""}`}>
      <a href={project.url} target="_blank" rel="noreferrer" className="project-hitbox" aria-label={`Abrir ${project.name} en una pestaña nueva`} />
      <div className="project-info">
        <div className="project-meta"><span>{project.index}</span><span>{project.eyebrow}</span><span className="project-status">{project.status}</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="stack-list" aria-label={`Tecnologías de ${project.name}`}>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <ProjectVisual project={project} />
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Navegación principal">
        <a className="brand" href="#top" aria-label="Ir al inicio"><span aria-hidden="true">&gt;_</span><span>pipedaza.dev</span></a>
        <div className="nav-links"><a href="#projects">Projects</a><a href="#about">About</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a><a href="#contact">Contact</a></div>
      </nav>

      <section className="hero shell" id="top" aria-labelledby="hero-title">
        <div className="hero-copy intro-sequence">
          <p className="kicker"><span /> Available for interesting work</p>
          <h1 id="hero-title">{profile.name}<span>{profile.role}</span></h1>
          <p className="hero-intro">Construyo aplicaciones, herramientas y productos digitales que hacen cosas útiles de verdad.</p>
          <div className="hero-actions" aria-label="Enlaces principales">
            <a className="button button-primary" href="#projects">Ver proyectos <span aria-hidden="true">↘</span></a>
            <a className="button button-quiet" href={profile.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a className="button button-quiet" href="#contact">Contacto</a>
          </div>
        </div>
        <div className="hero-signal intro-signal" aria-hidden="true">
          <span className="signal-label">CURRENT FOCUS</span>
          <div className="signal-orbit"><span className="signal-core">build</span><span className="signal-node node-one">01</span><span className="signal-node node-two">02</span><span className="signal-node node-three">03</span></div>
          <span className="signal-coord">04°39′N / 74°05′W</span>
        </div>
      </section>

      <section className="projects shell" id="projects" aria-labelledby="projects-title">
        <Reveal className="section-heading"><p className="section-index">01 / Selected work</p><h2 id="projects-title">Things I&apos;ve been building.</h2></Reveal>
        <div className="featured-list">{featured.map((project, index) => <Reveal key={project.name}><ProjectCard project={project} reversed={index % 2 === 1} /></Reveal>)}</div>
        <Reveal className="secondary-heading"><p className="section-index">Also in progress</p><p>Focused tools and product explorations.</p></Reveal>
        <div className="secondary-grid">
          {secondary.map((project, index) => (
            <Reveal key={project.name} delay={index * 100}>
              <article className={`small-project small-${project.accent}`}>
                <div className="small-top"><span>{project.index}</span><span>{project.status}</span></div>
                <div className="small-visual" aria-hidden="true"><span className="small-axis" /><strong>{project.name === "Orbit" ? "ORBIT / LIBRARY_03" : "TASK_14 / COMPLETE"}</strong><i /><i /><i /></div>
                <div className="small-copy"><p>{project.eyebrow}</p><h3>{project.name}</h3><span>{project.description}</span></div>
                <ul className="stack-list">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.name}`}><span>View project</span><span aria-hidden="true">↗</span></a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about shell" id="about" aria-labelledby="about-title">
        <Reveal className="about-copy"><p className="section-index">02 / About</p><h2 id="about-title">I like software with a reason to exist.</h2><p>Soy desarrollador Full Stack. Trabajo principalmente construyendo aplicaciones web, herramientas internas, automatizaciones y productos propios.</p><p className="about-note">Del primer flujo al último detalle: me interesa entender el problema, construir el sistema y hacer que se sienta bien al usarlo.</p></Reveal>
        <Reveal className="stack-panel" delay={100}>
          <p>Working stack <span>2026</span></p>
          <ul>{profile.stack.map(([index, technology]) => <li key={technology}><span>{index}</span><strong>{technology}</strong></li>)}</ul>
        </Reveal>
      </section>

      <section className="playground shell" id="playground" aria-labelledby="playground-title">
        <Reveal className="playground-head"><div><p className="section-index">03 / Playground</p><h2 id="playground-title">Built out of curiosity.</h2></div><p>Pruebas pequeñas, ideas incompletas y software que existe porque quería saber qué pasaba si lo construía.</p></Reveal>
        <div className="experiment-list">
          {experiments.map((project, index) => (
            <Reveal key={project.name} delay={index * 80}>
              <a className="experiment-row" href={project.url} target="_blank" rel="noreferrer">
                <span>{project.index}</span><h3>{project.name}</h3><p>{project.description}</p><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul><i aria-hidden="true">↗</i>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contact shell" id="contact" aria-labelledby="contact-title">
        <Reveal>
          <p className="section-index">04 / Contact</p>
          <div className="contact-main"><h2 id="contact-title">¿Tienes una idea<br />interesante?</h2><a className="contact-mail" href={`mailto:${profile.email}`}><span>Escríbeme</span><strong>{profile.email}</strong><i aria-hidden="true">↗</i></a></div>
          <footer><span>© {new Date().getFullYear()} Juan Felipe Daza</span><div><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a href="#top">Back to top ↑</a></footer>
        </Reveal>
      </section>
    </main>
  );
}

