import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Components/Header";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Sobre from "./Components/Sobre";
import Contato from "./Components/Contato";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Sementes from "./Components/Sementes";
import Carrinho from "./Components/Carrinho";

import "./App.css";
import "./Components/Carrinho.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log("Usuário recuperado do localStorage:", parsedUser);
      return parsedUser;
    } catch (error) {
      console.error("Erro ao analisar o JSON do usuário armazenado:", error);
      return null;
    }
  });

  const [carrinho, setCarrinho] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]); // Define como vazio caso o banco esteja offline
      }
    };

    carregarProdutos();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const atualizarCarrinho = () => {
    if (user && user.id_usuario) {
      console.log("Buscando carrinho para o ID do usuário:", user.id_usuario);
      axios
        .get(`http://localhost:8000/carrinho/${user.id_usuario}`)
        .then((response) => {
          console.log("Dados do carrinho recebidos:", response.data);
          setCarrinho(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar carrinho:", error);
          console.error("URL chamada:", `http://localhost:8000/carrinho/${user.id_usuario}`);
        });
    } else {
      console.warn("ID do usuário não encontrado. Carrinho não será buscado.");
    }
  };

  useEffect(() => {
    atualizarCarrinho();
  }, [user]);

  const removerCarrinho = (id) => {
    axios
      .delete(`http://localhost:8000/carrinho/${id}`)
      .then(() => {
        console.log("Item removido do carrinho com sucesso!");
        atualizarCarrinho();
      })
      .catch((error) => console.error("Erro ao remover item do carrinho:", error));
  };

  const confirmarPedido = () => {
    axios
      .post("http://localhost:8000/confirmar-pedido", {
        carrinho,
        id_usuario: user.id_usuario,
      })
      .then(() => {
        console.log("Pedido confirmado com sucesso!");
        setCarrinho([]);
      })
      .catch((error) => console.error("Erro ao confirmar pedido:", error));
  };

  const adicionarCarrinho = (produto, quantidadeSelecionada = 1, id_usuario) => {
    if (!id_usuario) {
      console.error("Erro: ID do usuário não foi fornecido.");
      return;
    }

    console.log("Enviando dados para o backend:", {
      produto_id: produto.id,
      quantidade: quantidadeSelecionada,
      url_imagem: produto.url_imagem,
      id_usuario,
    });

    axios
      .post("http://localhost:8000/carrinho", {
        produto_id: produto.id,
        quantidade: quantidadeSelecionada,
        url_imagem: produto.url_imagem,
        id_usuario,
      })
      .then((response) => {
        console.log("Resposta do backend:", response.data);
        alert("Produto adicionado ao carrinho com sucesso!");
        atualizarCarrinho();
      })
      .catch((error) => {
        console.error("Erro ao adicionar produto ao carrinho:", error);
        alert("Erro ao adicionar produto ao carrinho. Tente novamente.");
      });
  };

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />
      <Nav user={user} />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleLogin={handleLogin} />} />
          <Route
            path="/sementes"
            element={
              <Sementes
                produtos={produtos}
                adicionarCarrinho={(produto, quantidade) =>
                  adicionarCarrinho(produto, quantidade, user?.id_usuario)
                }
              />
            }
          />
          <Route
            path="/carrinho"
            element={
              <Carrinho
                carrinho={carrinho}
                removerCarrinho={removerCarrinho}
                confirmarPedido={confirmarPedido}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
