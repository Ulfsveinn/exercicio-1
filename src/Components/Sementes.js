import React, { useState, useEffect } from "react";
import "./Sementes.css";

function Sementes({ adicionarCarrinho, produtos }) {
  const [quantidade, setQuantidade] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const abrirPopup = (produto) => {
    if (produto.quantidade_disponivel === 0) {
      alert("Este produto está indisponível.");
      return;
    }
    setProdutoSelecionado(produto);
    setQuantidade(1);
  };

  const fecharPopup = () => {
    setProdutoSelecionado(null);
  };

  const aumentarQuantidade = () => {
    setQuantidade((prev) => prev + 1);
  };

  const diminuirQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const adicionarAoCarrinho = async () => {
    if (!produtoSelecionado) {
      alert("Nenhum produto selecionado.");
      return;
    }

    if (produtoSelecionado.quantidade_disponivel <= 0) {
      alert("Este produto está indisponível e não pode ser adicionado ao carrinho.");
      return;
    }

    if (produtoSelecionado.quantidade_disponivel < quantidade) {
      alert("Quantidade selecionada excede a disponível.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const id_usuario = user ? user.id_usuario : null;

    if (!id_usuario) {
      alert("Você precisa estar logado para adicionar produtos ao carrinho.");
      return;
    }

    adicionarCarrinho(produtoSelecionado, quantidade, id_usuario);
    fecharPopup();
  };

  if (!produtos || produtos.length === 0) {
    return <p>Não há produtos disponíveis no momento.</p>;
  }

  return (
    <div>
      <section className="sementes-section">
        <h2>Sementes e Mudas</h2>
        <p>Confira abaixo as opções de sementes e mudas disponíveis:</p>

        <div className="produtos-container">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={`produto-box ${produto.quantidade_disponivel === 0 ? "desativado" : ""}`}
            >
              <img
                src={process.env.PUBLIC_URL + produto.url_imagem}
                alt={produto.nome}
                className="produto-imagem"
              />
              <h5 className={`produto-nome ${produto.quantidade_disponivel === 0 ? "desativado" : ""}`}>
                {produto.nome}{" "}
                {produto.quantidade_disponivel > 0
                  ? `(${produto.quantidade_disponivel} disponíveis)`
                  : "(Indisponível)"}
              </h5>
              <button onClick={() => abrirPopup(produto)} disabled={produto.quantidade_disponivel === 0}>
                Escolher Quantidade
              </button>
            </div>
          ))}
        </div>
      </section>

      {produtoSelecionado && (
        <div className="popup">
          <div className="popup-content">
            <h3>{produtoSelecionado.nome}</h3>
            <div className="quantidade-controle">
              <button onClick={diminuirQuantidade}>-</button>
              <span>{quantidade}</span>
              <button onClick={aumentarQuantidade}>+</button>
            </div>
            <div className="popup-buttons">
              <button onClick={adicionarAoCarrinho}>Adicionar ao Carrinho</button>
              <button onClick={fecharPopup}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sementes;
