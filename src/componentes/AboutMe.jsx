import './AboutMe.css';

// ── Cambia estos datos por los tuyos ─────────────────────────────────────────
const DATA = {
  name:        "Fernando Sebastian Vera Ramos",
  role:        "Estudiante",
  university:  "Universidad Catolica San Pablo",
  career:      "Computer Science",                // o tu carrera                            // año que cursas
  about: `Me apasiona el software libre porque promueve la libertad de aprender, modificar y compartir. 
  Disfruto trabajar con Linux, experimentar con diferentes tecnologías y desarrollar proyectos que me permitan comprender mejor 
  cómo funcionan los sistemas. Siempre busco aprender algo nuevo y convertir esa curiosidad en proyectos reales.`,
};
// ─────────────────────────────────────────────────────────────────────────────

function AboutMe() {
  return (
    <section className="about-me">

      {/* ── Nombre y rol ── */}
      <div className="about-me__header">
        <h1 className="about-me__name">{DATA.name}</h1>
        <span className="about-me__role">{DATA.role}</span>
      </div>

      {/* ── Universidad ── */}
      <div className="about-me__uni">
        <span className="about-me__label">Universidad</span>
        <span className="about-me__value">{DATA.university}</span>
        <span className="about-me__value about-me__value--small">
          {DATA.career} · {DATA.year}
        </span>
      </div>

      {/* ── Sobre mí ── */}
      <div className="about-me__bio">
        <span className="about-me__label">Sobre mí</span>
        <p className="about-me__text">{DATA.about}</p>
      </div>

    </section>
  );
}

export default AboutMe;