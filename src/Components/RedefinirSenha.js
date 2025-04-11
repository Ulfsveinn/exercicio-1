import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Reutilizando o estilo do Login

function RedefinirSenha({ emailGlobal }) {
  // Estados para armazenar a nova senha, confirmação, mensagens de sucesso e erro
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem."); // Exibe erro se as senhas não forem iguais
      return;
    }

    try {
      // Envia a nova senha para o backend
      const response = await axios.post("http://localhost:8000/redefinir-senha", { email: emailGlobal, senha });
      setMensagem(response.data.message); // Exibe mensagem de sucesso
      setTimeout(() => navigate("/login"), 5000); // Redireciona para a página de login após 5 segundos
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao redefinir a senha."); // Exibe mensagem de erro
    }
  };

  return (
    <div>
      <form id="reset-password-form" className="login-form" autoComplete="off" role="main" onSubmit={handleSubmit}>
        <h1 className="a11y-hidden">Redefinir Senha</h1>
        <div>
          <label className="label-password">
            <input 
              type="password" 
              className="text" 
              name="senha" 
              placeholder="Nova senha" 
              tabIndex="1" 
              required 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} // Atualiza o estado da senha
            />
            <span className="required">Nova senha</span>
          </label>
        </div>
        <div>
          <label className="label-password">
            <input 
              type="password" 
              className="text" 
              name="confirmarSenha" 
              placeholder="Confirme a nova senha" 
              tabIndex="2" 
              required 
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} // Atualiza o estado da confirmação
            />
            <span className="required">Confirme a nova senha</span>
          </label>
        </div>
        {mensagem && <p className="success-message">{mensagem}</p>} {/* Exibe mensagem de sucesso */}
        {erro && <p className="error-message">{erro}</p>} {/* Exibe mensagem de erro */}
        <input type="submit" value="Redefinir Senha" /> {/* Botão para enviar o formulário */}
      </form>
    </div>
  );
}

export default RedefinirSenha;
