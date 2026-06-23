import './contenido.css';
import Hero from './tittle.jsx';
import ThreeCard from './ThreeCard.jsx';
import AboutMe from './AboutMe.jsx';
import SocialLinks from './SocialLinks.jsx';
import SimpleList from './SimpleList.jsx';

function Content() {
  return (
    <main className="content">
      <Hero />
      <ThreeCard />

      <div id="sobre-mi">
        <AboutMe />
      </div>

      <div id="lenguajes">
        <SimpleList />
      </div>

      <div id="contacto">
        <SocialLinks />
      </div>
    </main>
  );
}

export default Content;