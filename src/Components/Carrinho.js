import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Carrinho.css";

function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Recupera o usuário do localStorage
    const id_usuario = user ? user.id_usuario : null;

    if (!id_usuario) {
      console.error("Erro: ID do usuário não encontrado.");
      alert("Você precisa estar logado para acessar o carrinho.");
      return;
    }

    // Busca os itens do carrinho diretamente do backend
    axios
      .get(`http://localhost:8000/carrinho/${id_usuario}`)
      .then((response) => {
        console.log("Dados do carrinho recebidos:", response.data);
        setCarrinho(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar carrinho:", error);
        alert("Erro ao carregar o carrinho. Tente novamente mais tarde.");
      });
  }, []);

  const alterarQuantidade = (id, operacao) => {
    const item = carrinho.find((produto) => produto.carrinho_id === id);
    if (!item) return;

    const novaQuantidade = operacao === "aumentar" ? item.quantidade + 1 : item.quantidade - 1;

    if (novaQuantidade < 1) {
      alert("A quantidade não pode ser menor que 1.");
      return;
    }

    axios
      .put(`http://localhost:8000/carrinho/${id}`, { quantidade: novaQuantidade })
      .then(() => {
        console.log("Quantidade atualizada com sucesso!");
        setCarrinho((prevCarrinho) =>
          prevCarrinho.map((produto) =>
            produto.carrinho_id === id ? { ...produto, quantidade: novaQuantidade } : produto
          )
        );
      })
      .catch((error) => console.error("Erro ao atualizar a quantidade:", error));
  };

  const removerItem = (id) => {
    axios
      .delete(`http://localhost:8000/carrinho/${id}`)
      .then(() => {
        console.log("Item removido do carrinho com sucesso!");
        setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.carrinho_id !== id));
      })
      .catch((error) => console.error("Erro ao remover item do carrinho:", error));
  };

  const handleConfirmarPedido = () => {
    setMensagemSucesso("Pedido enviado com sucesso!");
    setTimeout(() => {
      setMensagemSucesso("");
      navigate("/confirmar");
    }, 5000);
  };

  return (
    <div className="carrinho-container">
      <h2>Carrinho de Compras</h2>
      {carrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="itens-carrinho">
          {carrinho.map((item) => (
            <div key={item.carrinho_id} className="item-carrinho">
              <img src={item.url_imagem} alt={item.produto_nome} className="imagem-produto" />
              <div className="detalhes-produto">
                <h4>{item.produto_nome}</h4>
                <div className="quantidade-controle">
                  <button onClick={() => alterarQuantidade(item.carrinho_id, "diminuir")}>-</button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => alterarQuantidade(item.carrinho_id, "aumentar")}>+</button>
                </div>
                <button onClick={() => removerItem(item.carrinho_id)} className="remover-produto">
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {carrinho.length > 0 && (
        <button onClick={handleConfirmarPedido} className="btn-confirmar-pedido">
          Confirmar Pedido
        </button>
      )}

      {mensagemSucesso && (
        <div className="mensagem-sucesso">
          <p>{mensagemSucesso}</p>
        </div>
      )}
    </div>
  );
}

export default Carrinho;