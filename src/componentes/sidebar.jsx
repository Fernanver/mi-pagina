import { useState } from 'react';
import './sidebar.css';

const LINKS = [
  { label: 'SOBRE MÍ',    href: '#sobre-mi'    },
  { label: 'LENGUAJES',   href: '#lenguajes'   },
  { label: 'HERRAMIENTAS',href: '#herramientas'},
  { label: 'PROYECTOS',   href: '#proyectos'   },
  { label: 'CONTÁCTAME',  href: '#contacto'    },
];

function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Menú"
      >
        {open ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <h2>MI WEB</h2>

        <nav>
          {LINKS.map(({ label, href }) => (
            <a key={href} href={href} onClick={(e) => handleClick(e, href)}>
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;