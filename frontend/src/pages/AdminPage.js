import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
  const [userIdsWithOrders, setUserIdsWithOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Effettua una richiesta per ottenere gli utenti con almeno un ordine
    axios.get('http://localhost:3001/api/v1/utenti/con-ordini')
      .then((response) => {
        setUserIdsWithOrders(response.data);
      })
      .catch((error) => {
        console.error('Errore durante il recupero degli utenti con ordini:', error);
      });
  }, []);

  const handleOrderClick = (utenteID) => {
    // Quando un utente con almeno un ordine viene selezionato, ottieni gli ordini e i dettagli
    axios.post('http://localhost:3001/api/v1/utenti/ordini', { utenteID })
      .then((ordersResponse) => {
        axios.post('http://localhost:3001/api/v1/ordini/dettagli', { UtenteID: utenteID })
          .then((detailsResponse) => {
            const order = {
              utenteID: utenteID,
              orders: ordersResponse.data,
              details: detailsResponse.data,
            };
            setSelectedOrder(order);
          })
          .catch((error) => {
            console.error('Errore durante il recupero dei dettagli dell\'ordine:', error);
          });
      })
      .catch((error) => {
        console.error('Errore durante il recupero degli ordini:', error);
      });
  };

  return (
    <div>
      <h1>Amministrazione - Ordini degli Utenti</h1>
      <div className="order-list">
        <h2>Elenco Utenti con Ordini</h2>
        <ul>
          {userIdsWithOrders.map((utenteID) => (
            <li key={utenteID}>
              <button onClick={() => handleOrderClick(utenteID)}>
                Utente ID: {utenteID}
              </button>
              {selectedOrder && selectedOrder.utenteID === utenteID && (
                <div className="order-details">
                  <h2>Dettagli dell'Ordine</h2>
                  <ul>
                    {selectedOrder.details.map((detail, index) => (
                      <li key={index}>
                        Prodotto: {detail.Prodotto.Nome}, Quantità: {detail.DettagliOrdine.Quantita}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
