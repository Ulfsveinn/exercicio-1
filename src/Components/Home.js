import React from "react";
import "./Home.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa os estilos do carrossel

function Home() {
  return (
    <>
      <section className="home-section">
        <div className="home-content">
          <h1>Bem-vindo ao Programa Mudas</h1>
          <p>Este é um programa incrível que faz muitas coisas interessantes. Aqui você pode aprender mais sobre o nosso trabalho e como você pode se envolver.</p>
          <a href="/sobre">
            <button className="btn">Leia mais</button>
          </a>
        </div>
        <div className="home-image-box">
          <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
            <div>
              <img src="/imgs/muda.jpg" alt="Muda 1" className="home-image" />
            </div>
            <div>
              <img src="/imgs/Sementes.jpg" alt="Muda 2" className="home-image" />
            </div>
            <div>
              <img src="/imgs/R.jpg" alt="Muda 3" className="home-image" />
            </div>
            <div>
              <img src="/imgs/sement.jpg" alt="Muda 4" className="home-image" />
            </div>
          </Carousel>
        </div>
      </section>
      
      <section className="main-content">
        <div className="objectives-section">
          <h2>Objetivos</h2>
          <p>Estimular o incremento da qualidade genética da pecuária de carne e leite em sistemas de agricultura e pecuária familiar do Rio Grande do Sul.</p>
          
          <h3>Objetivos Específicos</h3>
          <ul>
            <li>Aumentar os índices de eficiência reprodutiva dos rebanhos em propriedades de agricultura e pecuária familiar</li>
            <li>Aumentar a produtividade dos rebanhos de corte e leite em propriedades de agricultura e pecuária familiar</li>
            <li>Contribuir para o desenvolvimento das cadeias produtivas de pecuária de corte e leite do Rio Grande do Sul.</li>
          </ul>
        </div>
        
        <div className="news-section">
          <h2>Notícias</h2>
          <table className="news-table">
            <tbody>
              <tr>
                <td><img src="/imgs/sementeNoticia1.jpg" alt="Notícia 1" className="news-image" /></td>
                <td>
                  <a href="/noticia1"><h3>Título da Notícia 1</h3></a>
                  <p>Breve descrição da notícia 1.</p>
                </td>
              </tr>
              <tr>
                <td><img src="/imgs/sementeNoticia2.jpg" alt="Notícia 2" className="news-image" /></td>
                <td>
                  <a href="/noticia2"><h3>Título da Notícia 2</h3></a>
                  <p>Breve descrição da notícia 2.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="goals-section">
        <h2>Metas</h2>
        <p>Até o final de 2014, o DISSEMINA pretende alcançar as seguintes metas:</p>
        <ul>
          <li>Adesão de até 180 municípios;</li>
          <li>Disponibilização de, no mínimo, 360 mil doses de sêmen para os municípios conveniados</li>
          <li>Treinamento de todos os responsáveis técnicos indicados pelos municípios - Disponibilização anual dos resultados do Programa DISSEMINA. participantes do Programa DISSEMINA</li>
        </ul>
      </section>
    </>
  );
}

export default Home;