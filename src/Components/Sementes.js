import React, { useState, useEffect } from "react";
import "./Sementes.css";

function Sementes({ adicionarCarrinho, produtos }) {
  const [quantidade, setQuantidade] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtosLocais, setProdutosLocais] = useState(produtos);

  useEffect(() => {
    setProdutosLocais(produtos);
  }, [produtos]);

  const abrirPopup = (produto) => {
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

    const user = JSON.parse(localStorage.getItem("user"));
    const id_usuario = user ? user.id_usuario : null;

    if (!id_usuario) {
      alert("Você precisa estar logado para adicionar produtos ao carrinho.");
      return;
    }

    adicionarCarrinho(produtoSelecionado, quantidade, id_usuario);
    fecharPopup();

    // Atualiza a interface local
    setProdutosLocais((prevProdutos) =>
      prevProdutos.map((p) =>
        p.id === produtoSelecionado.id
          ? { ...p, quantidade: p.quantidade - quantidade }
          : p
      )
    );

    // Atualiza o banco de dados
    try {
      await fetch(`http://localhost:8000/produtos/${produtoSelecionado.id}/atualizar-quantidade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          novaQuantidade: produtoSelecionado.quantidade - quantidade,
        }),
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade no banco:", error);
    }
  };

  return (
    <div>
      <section className="sementes-section">
        <h2>Sementes e Mudas</h2>
        <p>Confira abaixo as opções de sementes e mudas disponíveis:</p>

        <div className="produtos-container">
          {produtosLocais.map((produto) => (
            <div
              key={produto.id}
              className={`produto-box ${produto.quantidade === 0 ? "desativado" : ""}`}
            >
              <img
                src={process.env.PUBLIC_URL + produto.url_imagem}
                alt={produto.nome}
                className="produto-imagem"
              />
              <h5 className={`produto-nome ${produto.quantidade === 0 ? "desativado" : ""}`}>
                {produto.nome} {produto.quantidade > 0 ? `(${produto.quantidade} disponíveis)` : "(Indisponível)"}
              </h5>
              <button onClick={() => abrirPopup(produto)} disabled={produto.quantidade === 0}>
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
