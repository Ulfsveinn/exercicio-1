import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RedefinirSenha.css"; // Certifique-se de criar um arquivo CSS para estilização semelhante ao Home.js

function RedefinirSenha() {
  const [formData, setFormData] = useState({
    email: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.novaSenha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem. Tente novamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/redefinirsenha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.novaSenha
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Senha redefinida com sucesso!");
        setTimeout(() => navigate("/login"), 3000); // Redireciona para login após 3 segundos
      } else {
        setErro(data.error || "Erro ao redefinir a senha.");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="redefinir-senha-container">
      <section className="redefinir-senha-section">
        <h2>Redefinir Senha</h2>
        <p>Insira seu e-mail e a nova senha para redefinir sua conta.</p>

        <form className="redefinir-senha-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha:</label>
            <input
              type="password"
              id="novaSenha"
              name="novaSenha"
              value={formData.novaSenha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha:</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>
          {mensagem && <p className="success-message">{mensagem}</p>}
          {erro && <p className="error-message">{erro}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn">Redefinir Senha</button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/login")}
            >
              Voltar para o Login
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default RedefinirSenha;
