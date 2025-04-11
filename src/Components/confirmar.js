import React from "react";

function confirmar() {
  return (
    <section>
      <div>
        <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://th.bing.com/th/id/R.229079c8f5240851cece598cf8eee770?rik=JND2PKmC%2fxzB1w&riu=http%3a%2f%2fpngimg.com%2fuploads%2femail%2femail_PNG11.png&ehk=6sNwAjueFilXp3tCehLPbXDGgZgsYZdR7y6dZ3vpSk4%3d&risl=&pid=ImgRaw&r=0" 
            alt="Acesse seu Gmail" 
            height={100} 
            width={150} 
          />
        </a>
      </div>
      <div>
        <p>Foi enviado um e-mail de confirmação! Acesse seu e-mail e clique para verificar.</p>
      </div>
    </section>
  );
}

export default confirmar;
