import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          email,
          id_usuario: data.id_usuario,
          userName: data.userName, // <- Corrigido para userName
        };
        console.log("Usuário logado:", userData); // Log para verificar o usuário
        onLogin(userData); // Atualiza o estado global com o usuário
        localStorage.setItem("user", JSON.stringify(userData)); // Salva o usuário no localStorage
        navigate("/");
      } else {
        setErrorMessage(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      setErrorMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <form id="login-form" className="login-form" autoComplete="off" role="main" onSubmit={handleSubmit}>
      <h1 className="a11y-hidden">Entrar</h1>
      <div>
        <label className="label-email">
          <input 
            type="email" 
            className="text" 
            name="email" 
            placeholder="Email" 
            tabIndex="1" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="required">Email</span>
        </label>
      </div>

      <input
        type="checkbox"
        name="show-password"
        className="show-password a11y-hidden"
        id="show-password"
        tabIndex="3"
        onChange={handlePasswordToggle}
      />
      <label className="label-show-password" htmlFor="show-password">
        <span>Mostrar senha</span>
      </label>

      <div>
        <label className="label-password">
          <input
            type={showPassword ? "text" : "password"}
            className="text"
            name="password"
            placeholder="Senha"
            tabIndex="2"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="required">Senha</span>
        </label>
      </div>
      <input type="submit" value="Entrar" />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="email">
        <Link to="/redefinir-senha">Esqueceu a senha?</Link>
      </div>
      <figure aria-hidden="true">
        <div className="person-body"></div>
        <div className="neck skin"></div>
        <div className="head skin">
          <div className="eyes"></div>
          <div className="mouth"></div>
        </div>
        <div className="hair"></div>
        <div className="ears"></div>
        <div className="shirt-1"></div>
        <div className="shirt-2"></div>
      </figure>
    </form>
  );
}

export default Login;
