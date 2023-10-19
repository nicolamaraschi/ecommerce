//src/pages/Carello
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './CarrelloPage.css';

function CarrelloPage({ utenteID }) {
  const [prodottiCarrello, setProdottiCarrello] = useState([]);
  const [carrelloVuoto, setCarrelloVuoto] = useState(false);

  useEffect(() => {
    async function fetchCarrello() {
      try {
        // Ottieni il token JWT dal tuo frontend (assicurati di averlo correttamente autenticato)
        const token = localStorage.getItem('jwtToken'); // Ovvero da dove lo hai memorizzato

        if (!token) {
          console.error('Token JWT non trovato. Assicurati di aver effettuato il login e memorizzato il token correttamente.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Aggiungi il token JWT nell'header
          },
        };

        const response = await Axios.get(`http://localhost:3001/api/v1/utenti/${utenteID}/carrello`, config);
        const data = response.data;

        if (data && data.length > 0) {
          setProdottiCarrello(data);
        } else {
          setCarrelloVuoto(true);
        }
      } catch (error) {
        console.error("Errore durante il recupero del carrello:", error);
      }
    }

    fetchCarrello();
  }, [utenteID]);

  return (
    <div className="carrello-container">
      <h1>Il Tuo Carrello</h1>
      {carrelloVuoto ? (
        <p>Il tuo carrello è vuoto.</p>
      ) : (
        <ul className="carrello-list">
          {prodottiCarrello.map((prodotto) => (
            <li key={prodotto.ID} className="carrello-item">
              <div className="carrello-item-info">
                <h2>{prodotto.Nome}</h2>
                <p>{prodotto.Descrizione}</p>
                <p>Prezzo: {prodotto.Prezzo} €</p>
              </div>
              <div className="carrello-item-image">
                <img src={prodotto.ImmaginePath} alt={prodotto.Nome} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CarrelloPage;
