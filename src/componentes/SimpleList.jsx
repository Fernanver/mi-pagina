import './SimpleList.css'

function Hero() {
  return (
    <section className="hero-section">

      <h3>Lenguajes</h3>
      <ul>
        <li>Python</li>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
      </ul>

      <h3>Herramientas</h3>
      <ul>
        <li>Linux (Arch/CachyOS)</li>
        <li>Git</li>
        <li>Godot</li>
        <li>VS Code / Neovim / Kitty</li>
      </ul>

      <h3>Proyectos</h3>
      <ul>
        <li>Configuración de entornos Linux.</li>
        <li>Desarrollo de videojuegos con Godot.</li>
        <li>Experimentación con modelos de IA mediante Ollama.</li>
        <li>Desarrollo web.</li>
      </ul>

      <h3>"No necesitas una suite de gigabytes para hacer algo hermoso en una computadora."</h3>
      <h4>-Terry A. Davis</h4>

    </section>
  )
}

export default Hero