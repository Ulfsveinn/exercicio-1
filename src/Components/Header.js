import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Importe o CSS do Header

function Header({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controle do menu hambúrguer

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna o estado do menu (aberto/fechado)
  };

  return (
    <header>
      <div>
        {user ? (
          <>
            <div>
              {/* Nome do usuário com click para abrir o menu hambúrguer */}
              <span onClick={toggleMenu} style={{ cursor: "pointer" }}>
                Bem-vindo, {user.userName} {/* Exibe o nome do usuário ao logar */}
              </span>
              {isMenuOpen && (
                <div className="hamburger-menu">
                  <ul>
                    <li>
                      <Link to="/Carrinho" onClick={() => setIsMenuOpen(false)}>Carrinho</Link> {/* Link para a página do carrinho */}
                    </li>
                    <li>
                      <button onClick={onLogout}>Sair</button> {/* Função de logout */}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <Link to="/login">Entrar</Link> | 
              <Link to="/register">Criar Conta</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
