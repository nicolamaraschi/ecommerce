const express = require('express');
const mysql = require('mysql2');
const exphbs = require('express-handlebars');
const router = express.Router();



// Importa la classe Utente
const Utente = require('./Utente'); 
const Prodotto = require('./prodotto');
const ShoppingCartItem = require('./ShoppingCartItem');
const DettagliOrdine = require('./DettagliOrdine');
const Ordine = require('./Ordine');

const bodyParser = require('body-parser'); // Importa body-parser 

// Configura la connessione al database MySQL
 db = mysql.createConnection({
    host: '127.0.0.1',  // Host
    port: '3306',       // Porta
    user: 'root',       // Nome utente
    password: 'marase01', // Password
    database: 'eccomerce', // Nome del database
    // Puoi anche configurare altre opzioni, come SSL_cipher, se necessario.
  });

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database: ' + err.message);
  } else {
    console.log('Connessione al database MySQL riuscita');
  }
});

const jwt = require('jsonwebtoken');
const secretKey = 'e4a84578fc546ac8d2c066fd09148c93b1f2d3750eb1c36d3bced6f622c2991a6';

// Middleware per verificare il token nelle richieste
function verificaToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'Token mancante' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token non valido' });
    }
    req.utente = decoded; // Salva le registrazione dell'utente per l'uso nelle rotte successive
    next();
  });
}


// prende tutti prodotti del carrello dell utente
router.get('/utenti/:utenteID/carrello',verificaToken, (req, res) => {
  const utenteID = req.params.utenteID;

  // Effettua una query al database per recuperare i prodotti nel carrello di un utente
  const query = `
    SELECT pc.*, p.Nome, p.Descrizione, p.Prezzo, p.Stock, p.CategoriaID, p.ImmaginePath
    FROM ProdottiNelCarrello AS pc
    INNER JOIN Prodotti AS p ON pc.ProdottoID = p.ID
    WHERE pc.UtenteID = ?;
  `;

  db.query(query, [utenteID], (err, results) => {
    if (err) {
      console.error("Errore durante l'esecuzione della query:", err);
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    // Controlla se la query ha restituito risultati validi
    if (results && results.length > 0) {
      // Mappa i risultati sulla classe Prodotto
      const shoppingCartItems = results.map((row) => new ShoppingCartItem(row.ID, row.UtenteID, row.ProdottoID, row.Quantita, row.Prezzo));
      
      // Mappa i risultati sulla classe Prodotto
      const products = results.map((row) => new Prodotto(row.ProdottoID, row.Nome, row.Descrizione, row.Prezzo, row.Stock, row.CategoriaID, row.ImmaginePath));

      res.json({ shoppingCartItems, products });
    } else {
      res.status(404).json({ error: 'Nessun prodotto trovato nel carrello' });
    }
  });
});


// http://localhost:3000/api/v1/ricercaProdotti/a
router.get('/ricercaProdotti/:prodottoNome', (req, res) => {
  const prodottoNome = req.params.prodottoNome;

  // Esegui una query SQL per cercare i prodotti con un nome che contiene il valore fornito
  const query = `SELECT ID, Nome, Descrizione, Prezzo, Stock, CategoriaID, ImmaginePath
                 FROM Prodotti
                 WHERE Nome LIKE ?`;

  db.query(query, [`%${prodottoNome}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    // Mappa i risultati della query sulla classe Prodotto
    const products = results.map((row) => {
      return new Prodotto(
        row.ID,
        row.Nome,
        row.Descrizione,
        row.Prezzo,
        row.Stock,
        row.CategoriaID,
        row.ImmaginePath
      );
    });

    res.json(products);
  });
});


// Endpoint API per ottenere prodotti con Stock > 0
router.get('/prodotti', (req, res) => {
  // Effettua una query al tuo database per recuperare l'elenco dei prodotti con Stock > 0
  db.query('SELECT * FROM Prodotti WHERE Stock > 0', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    // Mappa i risultati della query su oggetti JavaScript
    const products = results.map((row) => {
      return {
        ID: row.ID,
        Nome: row.Nome,
        Descrizione: row.Descrizione,
        Prezzo: row.Prezzo,
        Stock: row.Stock,
        CategoriaID: row.CategoriaID,
        ImmaginePath: row.ImmaginePath
      };
    });

    res.json({ products });
  });
});


// ottieni tutti i prodotti di una categoria
router.get('/prodottiCategoria/:categoriaID', (req, res) => {
  // Ottenimento del parametro dell'ID della categoria dall'URL
  const categoriaID = req.params.categoriaID;

  // Definizione della query SQL per recuperare i prodotti della categoria specifica
  const query = 'SELECT * FROM Prodotti WHERE CategoriaID = ?';

  // Esecuzione della query SQL con il parametro categoriaID
  db.query(query, [categoriaID], (err, results) => {
    // Gestione degli errori in caso di errore nella query
    if (err) {
      console.error('Errore nella query:', err);
      // Restituzione di una risposta di errore con codice HTTP 500 (Internal Server Error)
      return res.status(500).json({ error: 'Errore del server' });
    }

    // Mappatura dei risultati della query in un array di oggetti prodotto
    const products = results.map((row) => ({
      ID: row.ID,
      Nome: row.Nome,
      Descrizione: row.Descrizione,
      Prezzo: row.Prezzo,
      Stock: row.Stock,
      CategoriaID: row.CategoriaID,
      ImmaginePath: row.ImmaginePath
    }));

    // Restituzione dei prodotti come risposta JSON
    res.json({ products });
  });
});

  // selezioni tutta la lista delle categorie, non i prodotti ma proprio il nome delle caterie prodotti
  router.get('/categorie', (req, res) => {
    // Effettua una query al tuo database per recuperare l'elenco delle categorie di prodotti cosmetici
    // e restituiscile come risposta in formato JSON
  
    db.query('SELECT * FROM Categorie', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      res.json(results);
    });
  });

  //grazie a questo funziona la registrazione
  router.use(express.json()); 


// Rotta per la registrazione di un nuovo utente
router.post('/registrazioneUtente', (req, res) => {
  const utente = req.body;

  if (!utente || !utente.Nome || !utente.Email || !utente.Password) {
    res.status(400).json({ error: 'Dati utente incompleti' });
    return;
  }

  utente.Ruolo = 'Cliente';

  const query = 'INSERT INTO Utenti (Nome, Email, Password, Ruolo) VALUES (?, ?, ?, ?)';
  const values = [utente.Nome, utente.Email, utente.Password, utente.Ruolo];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    const utenteInserito = {
      id: results.insertId,
      Nome: utente.Nome,
      Email: utente.Email,
      Ruolo: utente.Ruolo,
    };

    // Genera un token JWT per il nuovo utente
    const token = jwt.sign(utenteInserito, secretKey, { expiresIn: '1h' }); // Il token scadrà dopo 1 ora

    res.status(201).json({ utente: utenteInserito, token });
  });
});


// per il login degli utenti
router.post('/loginUtente', (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400).json({ error: 'Dati mancanti' });
    return;
  }

  const query = 'SELECT * FROM Utenti WHERE Email = ? AND Password = ?';
  db.query(query, [Email, Password], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Credenziali non valide' });
      return;
    }

    const user = results[0];
    const utente = {
      id: user.ID,
      Nome: user.Nome,
      Email: user.Email,
      Ruolo: user.Ruolo,
    };

    // Genera un token JWT
    const token = jwt.sign(utente, secretKey, { expiresIn: '1h' }); // Il token scadrà dopo 1 ora

    res.status(200).json({ utente, message: 'Login riuscito', token });
  });
});


//creo carrello utente
router.post('/creaCarrello', (req, res) => {
  const { utenteId } = req.body;

  // Query per verificare se l'utente esiste
  const checkUserQuery = 'SELECT * FROM Utenti WHERE ID = ?';
  db.query(checkUserQuery, [utenteId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore1' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Utente non trovato' });
      return;
    }

    // Query per verificare se l'utente ha già un carrello
    const checkCartQuery = 'SELECT * FROM Carrelli WHERE UtenteID = ?';
    db.query(checkCartQuery, [utenteId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore2' });
        return;
      }

      if (results.length > 0) {
        res.status(409).json({ error: 'Creazione di carrello fallita, carrello già esistente' });
        return;
      }

      // Altrimenti, crea un nuovo carrello e assegnalo all'utente
      const insertQuery = 'INSERT INTO Carrelli (UtenteID) VALUES (?)';

      db.query(insertQuery, [utenteId], (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Errore del server' });
          return;
        }
        res.status(201).json({ message: 'Nuovo carrello creato con successo e assegnato all\'utente' });
      });
    });
  });
});




//{ "quantity": 50} for testing
// aggiungi un prodotto al carrelo della quantita richiesta
router.post('/aggiungiProdottoCarrello', (req, res) => {
  const productId = req.body.id;
  const quantity = req.body.quantity || 1; // Consenti all'utente di specificare la quantità, utilizza 1 come valore predefinito
  const utenteId = req.body.utenteID; // Ottieni l'ID dell'utente dal corpo della richiesta

  const insertQuery = 'INSERT INTO ProdottiNelCarrello (UtenteID, ProdottoID, Quantita, Prezzo) VALUES (?, ?, ?, (SELECT Prezzo FROM Prodotti WHERE ID = ?))';

  db.query(insertQuery, [utenteId, productId, quantity, productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.status(201).json({ message: 'Prodotto aggiunto al carrello con successo' });
  });
});


//elimina un prodotto del carrello della quantita richiesto
router.delete('/:id/rimuovi-dal-carrello', (req, res) => {
  const productId = req.params.id;
  const quantity = req.body.quantity || 1; // Quantità da rimuovere, valore predefinito 1

  const utenteId = 1; // Sostituisci con la logica per ottenere l'ID dell'utente corrente o l'ID del carrello

  // Verifica se il prodotto è presente nel carrello dell'utente
  const checkQuery = 'SELECT Quantita FROM ProdottiNelCarrello WHERE UtenteID = ? AND ProdottoID = ?';

  db.query(checkQuery, [utenteId, productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Prodotto non trovato nel carrello' });
      return;
    }

    const currentQuantity = results[0].Quantita;

    // Verifica se la quantità richiesta è maggiore della quantità attualmente presente nel carrello
    if (quantity > currentQuantity) {
      res.status(400).json({ error: 'Quantità richiesta maggiore della quantità disponibile nel carrello' });
      return;
    }

    // Aggiorna la quantità nel carrello
    const newQuantity = currentQuantity - quantity;
    const updateQuery = 'UPDATE ProdottiNelCarrello SET Quantita = ? WHERE UtenteID = ? AND ProdottoID = ?';

    db.query(updateQuery, [newQuantity, utenteId, productId], (err, updateResult) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }

      res.status(200).json({ message: 'Quantità del prodotto nel carrello aggiornata con successo' });
    });
  });
});

// Modifica la quantità di un prodotto nel carrello
router.put('/modifica-quantita', (req, res) => {
  const productId = req.body.prodottoID; // ID del prodotto da modificare
  const newQuantity = req.body.quantita; // Nuova quantità specificata nel corpo della richiesta
  const utenteId = req.body.utenteID; // ID dell'utente

  // Verifica se il prodotto è presente nel carrello dell'utente
  const checkQuery = 'SELECT Quantita FROM ProdottiNelCarrello WHERE UtenteID = ? AND ProdottoID = ?';

  db.query(checkQuery, [utenteId, productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Prodotto non trovato nel carrello' });
      return;
    }

    const currentQuantity = results[0].Quantita;

    // Assicurati che la nuova quantità sia maggiore di zero
    if (newQuantity <= 0) {
      res.status(400).json({ error: 'La quantità deve essere maggiore di zero' });
      return;
    }

    // Aggiorna la quantità nel carrello
    const updateQuery = 'UPDATE ProdottiNelCarrello SET Quantita = ? WHERE UtenteID = ? AND ProdottoID = ?';

    db.query(updateQuery, [newQuantity, utenteId, productId], (err, updateResult) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }

      res.status(200).json({ message: 'Quantità del prodotto nel carrello aggiornata con successo' });
    });
  });
});




router.post('/utenti/ordini', (req, res) => {
  const utenteID = req.body.utenteID; // Dati passati nel corpo della richiesta
  const query = 'SELECT * FROM Ordini WHERE UtenteID = ?';

  db.query(query, [utenteID], (err, results) => {
    if (err) {
      console.error('Errore durante la query: ' + err);
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    // Mappa i risultati sulla classe Ordine
    const ordini = results.map((row) => {
      return new Ordine(row.ID, row.UtenteID, row.DataOrdine, row.Totale);
    });

    res.json(ordini);
  });
});


/*
router.post('/ordini/dettagli', (req, res) => {
  const ordineID = req.body.OrdineID; // Dati passati nel corpo della richiesta
  const utenteID = req.body.UtenteID; // Dati passati nel corpo della richiesta
  const query = 'SELECT d.*, p.ID AS ProdottoID, p.Nome AS NomeProdotto, p.Descrizione AS DescrizioneProdotto, ' +
                'p.Prezzo AS PrezzoProdotto, p.Stock AS StockProdotto ' +
                'FROM DettagliOrdini d ' +
                'JOIN Prodotti p ON d.ProdottoID = p.ID ' +
                'WHERE d.OrdineID = ? AND d.UtenteID = ?';

  db.query(query, [ordineID, utenteID], (err, results) => {
    if (err) {
      console.error('Errore durante la query: ' + err);
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    // Mappa i risultati sulla classe DettagliOrdine con informazioni sui prodotti
    const dettagliOrdini = results.map((row) => {
      const prodotto = new Prodotto(row.ID, row.Nome, row.Descrizione, row.Prezzo, row.Stock);
      return new DettagliOrdine(row.ID, row.OrdineID, row.ProdottoID, row.Quantita, row.Prezzo);
    });

    res.json(dettagliOrdini);
  });
});

*/



























// ottiene tutti gli utenti
router.get('/utenti', (req, res) => {
  db.query('SELECT * FROM Utenti', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.json(results);
  });
});


// eliminare un utente (solo se è Ruolo: Amministratore)
router.delete('/eliminaUtente', (req, res) => {
  const { amministratoreId, utenteDaEliminareId } = req.body; // Ottieni i due ID dall'oggetto JSON

  // Esegui una query per ottenere il ruolo dell'utente amministratore
  db.query('SELECT Ruolo FROM Utenti WHERE ID = ?', [amministratoreId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Utente amministratore non trovato' });
      return;
    }

    const ruolo = results[0].Ruolo;

    // Esegui una verifica per assicurarti che l'utente autenticato sia un Amministratore
    if (ruolo !== 'Amministratore') {
      res.status(403).json({ error: 'Accesso negato' });
      return;
    }

    // Esegui l'eliminazione dell'utente specificato
    db.query('DELETE FROM Utenti WHERE ID = ?', [utenteDaEliminareId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      res.json({ message: 'Utente eliminato con successo' });
    });
  });
});




    

 
  //TESTATA
  // api per modificare dati del utentne 
router.put('/aggiornaCredenzialiUtente', (req, res) => {
  const userIdToUpdate = req.body.id; // Ottieni l'ID utente dal corpo della richiesta JSON
  const { Nome, Email, Password } = req.body;

  const updateQuery = 'UPDATE Utenti SET Nome = ?, Email = ?, Password = ? WHERE ID = ?';
  db.query(updateQuery, [Nome, Email, Password, userIdToUpdate], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.json({ message: 'Informazioni utente aggiornate con successo' });
  });
});


  // recuperare le credenziali del utente in base al suo id
  router.get('/utenti/:id', (req, res) => {
    const userIdToRetrieve = req.params.id;

    db.query('SELECT * FROM Utenti WHERE ID = ?', [userIdToRetrieve], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Utente non trovato' });
        return;
      }
      res.json(results[0]);
    });
  });


  //TESTATA
  //aggiorna password utente
  router.put('/utenti/:id/aggiorna-password', (req, res) => {
    const userIdToUpdate = req.params.id;
    const { VecchiaPassword, NuovaPassword } = req.body;
  
    // Esegui la verifica della vecchia password e l'aggiornamento della password dell'utente nel tuo database
    // Assicurati di gestire la validazione dei dati e gli errori
  
    const updatePasswordQuery = 'UPDATE Utenti SET Password = ? WHERE ID = ? AND Password = ?';
    db.query(updatePasswordQuery, [NuovaPassword, userIdToUpdate, VecchiaPassword], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(401).json({ error: 'Vecchia password non valida' });
        return;
      }
      res.json({ message: 'Password utente aggiornata con successo' });
    });
  });
  

  // ricera prodotti preazzo crescente non usata perche uso la ricerca con asc e desc
  router.get('/prodotti/prezzo-crescente', (req, res) => {
    // Effettua una query al tuo database per selezionare tutti i prodotti e ordinarli per prezzo in ordine crescente
    // e restituiscili come risposta in formato JSON
  
    db.query('SELECT * FROM Prodotti ORDER BY Prezzo ASC', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      res.json(results);
    });
  });
  
  // ricera prodotti preazzo descrente non usata perche uso la ricerca con asc e desc
  router.get('/prodotti/prezzo-decrescente', (req, res) => {
    // Effettua una query al tuo database per selezionare tutti i prodotti e ordinarli per prezzo in ordine decrescente
    // e restituiscili come risposta in formato JSON
  
    db.query('SELECT * FROM Prodotti ORDER BY Prezzo DESC', (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      res.json(results);
    });
  });
  



//TESTATO
 // eliminare un prodotto (solo se è Ruolo: Amministratore)
 router.delete('/eliminaProdotti', (req, res) => {
  const { productId, authenticatedUserRole } = req.body;

  // Esegui una verifica per assicurarti che l'utente autenticato sia un Amministratore
  if (authenticatedUserRole !== 'Amministratore') {
    res.status(403).json({ error: 'Accesso negato' });
    return;
  }

  // Esegui l'eliminazione del prodotto specificato
  db.query('DELETE FROM Prodotti WHERE ID = ?', [productId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.json({ message: 'Prodotto eliminato con successo' });
  });
});








//TESTATO
// permettere agli utenti di creare un nuovo ordine dai prodotti nel loro carrello
router.post('/ordini/crea', (req, res) => {
  const { userId, products } = req.body;
  let total = 0;

  // Crea un nuovo ordine nella tabella Ordini
  db.query('INSERT INTO Ordini (UtenteID, DataOrdine, Totale) VALUES (?, NOW(), ?)', [userId, total], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    const orderId = results.insertId;

    // Funzione per aggiungere dettagli dell'ordine per un prodotto
    function aggiungiDettagliOrdine(product) {
      db.query('SELECT Stock, Prezzo FROM Prodotti WHERE ID = ?', [product.productId], (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Errore del server' });
          return;
        }
        if (results.length === 0) {
          res.status(404).json({ error: 'Prodotto non trovato' });
          return;
        }
        const productData = results[0];
        const quantity = product.quantity;

        if (productData.Stock < quantity) {
          res.status(400).json({ error: 'Quantità non disponibile' });
          return;
        }

        const totalPrice = quantity * productData.Prezzo;

        db.query('INSERT INTO DettagliOrdini (OrdineID, ProdottoID, Quantita, Prezzo) VALUES (?, ?, ?, ?)', [orderId, product.productId, quantity, totalPrice], (err, results) => {
          if (err) {
            res.status(500).json({ error: 'Errore del server' });
            return;
          }
          total += totalPrice;
        });
      });
    }

    // Aggiungi i dettagli dell'ordine per ciascun prodotto da acquistare
    for (const product of products) {
      aggiungiDettagliOrdine(product);
    }

    // Aggiorna il totale dell'ordine
    db.query('UPDATE Ordini SET Totale = ? WHERE ID = ?', [total, orderId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Errore del server' });
        return;
      }
      res.status(201).json({ message: 'Ordine creato con successo' });
    });
  });
});


  
//TESTATO
router.get('/ordini/:orderId', (req, res) => {
  const orderId = req.params.orderId; // Ottieni l'ID dell'ordine dalla richiesta dei parametri

  db.query('SELECT * FROM Ordini WHERE ID = ?', [orderId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.json(results);
  });
});


  
//TESTATO
// Endpoint per aggiungere un commento a un prodotto
router.post('/prodotti/:productId/commenta', (req, res) => {
  const productId = req.params.productId; // Ottieni l'ID del prodotto dalla richiesta dei parametri
  const { userId, Testo } = req.body; // Ottieni userId dal corpo della richiesta

  // Esegui la validazione del commento e dell'autenticazione

  const insertQuery = 'INSERT INTO Commenti (UtenteID, ProdottoID, Testo, DataCommento) VALUES (?, ?, ?, NOW())';

  db.query(insertQuery, [userId, productId, Testo], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Errore del server' });
      return;
    }
    res.status(201).json({ message: 'Commento aggiunto con successo' });
  });
});


  module.exports = router;