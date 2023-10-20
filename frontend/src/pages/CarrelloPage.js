import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './CarrelloPage.css';

function CarrelloPage() {
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [carrelloVuoto, setCarrelloVuoto] = useState(false);

  useEffect(() => {
    async function fetchCarrello() {
      try {
        // Recupera l'utenteID persistente da localStorage
        const utenteID = localStorage.getItem('utenteID');

        // Ottieni il token JWT dal tuo frontend (assicurati di averlo correttamente autenticato)
        const token = localStorage.getItem('jwtToken');

        if (!token) {
          console.error('Token JWT non trovato. Assicurati di aver effettuato il login e memorizzato il token correttamente.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await Axios.get(`http://localhost:3001/api/v1/utenti/${utenteID}/carrello`, config);
        const data = response.data;

        if (data.shoppingCartItems && data.shoppingCartItems.length > 0) {
          setShoppingCartItems(data.shoppingCartItems);
          setProducts(data.products);
        } else {
          setCarrelloVuoto(true);
        }
      } catch (error) {
        console.error("Errore durante il recupero del carrello:", error);
      }
    }

    fetchCarrello();
  }, []); // Non è necessario dipendere da utenteID poiché lo stiamo recuperando da localStorage

  // Rimuovi l'argomento "utenteID" da handleQuantitaChange poiché non è più necessario
  const handleQuantitaChange = async (item, newQuantita) => {
    // Crea il corpo della richiesta
    const requestBody = {
      prodottoID: item.ProdottoID,
      quantita: newQuantita,
    };

    try {
      // Effettua una richiesta PUT per aggiornare la quantità
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await Axios.put('http://localhost:3001/api/v1/modifica-quantita', requestBody, config);

      // Aggiorna la quantità nel componente
      setShoppingCartItems((prevItems) => {
        const updatedItems = prevItems.map((prevItem) => {
          if (prevItem.ID === item.ID) {
            // Aggiorna solo la quantità dell'elemento desiderato
            return { ...prevItem, Quantita: newQuantita };
          }
          return prevItem;
        });
        return updatedItems;
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della quantità:', error);
    }
  };

  return (
    <div className="carrello-container">
      <h1>Il Tuo Carrello</h1>
      {carrelloVuoto ? (
        <p>Il tuo carrello è vuoto.</p>
      ) : (
        <ul className="carrello-list">
          {shoppingCartItems.map((item) => {
            const product = products.find((p) => p.ID === item.ProdottoID);

            return (
              <li key={item.ID} className="carrello-item">
                <div className="carrello-item-info">
                  <h2>{product.Nome}</h2>
                  <p>{product.Descrizione}</p>
                  <p>Prezzo: {item.Prezzo} €</p>
                  <label>Quantità:</label>
                  <input
                    type="number"
                    value={item.Quantita}
                    onChange={(e) => handleQuantitaChange(item, e.target.value)}
                  />
                </div>
                <div className="carrello-item-image">
                  <img src={product.ImmaginePath} alt={product.Nome} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CarrelloPage;
