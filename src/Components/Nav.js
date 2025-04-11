import React, { useState } from "react";
import { Link } from "react-router-dom"



function Nav({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função para fechar o menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="logo">
        <div className="logo-img">
          <img 
            src="https://seapi.rs.gov.br/matriz_common/images/logos/simbolo_RS.png" 
            alt="Logo"
          />
        </div>
        <div className="logo-text">
          <span className="subtitle">Secretaria Da
          </span>
          <h1 className="title">
            Agricultura, Pecuária, Produção Sustentável e Irragação
          </h1>
        </div>

      </div>

      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav ${menuOpen ? "show" : ""}`}>
        <ul className={menuOpen ? "show" : ""}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          {user && <li><Link to="/sementes" onClick={closeMenu}>Sementes</Link></li>}
          <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
          <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
