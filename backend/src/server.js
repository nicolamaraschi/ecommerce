const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken'); 
const app = express();
const path = require('path'); // Aggiungi questa linea per importare il modulo path
const port = 3001;
const cookieParser = require('cookie-parser'); // Aggiungi questa linea
const apiRoutes = require('./api'); // Importa il file api.js
const Prodotto = require('./prodotto');
const Categoria = require('./categoria');
const Utente = require('./utente');
const fetch = require('node-fetch');
const bodyParser = require('body-parser'); // Importa body-parser
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api/v1', apiRoutes);




app.get('/prodotti', async (req, res) => {
  try {
    const responseListaProdotti = await fetch('http://localhost:3001/api/v1/prodotti');
    const responseCategorieProdotti = await fetch('http://localhost:3001/api/v1/categorie');

    const dataListaProdotti = await responseListaProdotti.json();
    const dataCategorie = await responseCategorieProdotti.json();

    if (dataListaProdotti && dataListaProdotti.products) {
      const listaProdotti = dataListaProdotti.products;
      const categorie = dataCategorie;

      const selectedCategoria = req.query.categoria;
      const sortOption = req.query.sort || 'none';
      const searchTerm = req.query.search;

      let filteredProducts = listaProdotti;

      if (selectedCategoria) {
        const responseProdottiCategoria = await fetch(`http://localhost:3001/api/v1/prodotti/categoria/${selectedCategoria}`);
        const dataProdottiCategoria = await responseProdottiCategoria.json();
        if (dataProdottiCategoria && dataProdottiCategoria.products) filteredProducts = dataProdottiCategoria.products; 
      }

      if (searchTerm) {
        const responseRicercaProdotti = await fetch(`http://localhost:3001/api/v1/ricercaProdotti?keyword=${searchTerm}&sort=${sortOption}`);
        const dataRicercaProdotti = await responseRicercaProdotti.json();

        if (dataRicercaProdotti) filteredProducts = dataRicercaProdotti;
        
      }

      if (sortOption === 'asc') filteredProducts.sort((a, b) => a.Prezzo - b.Prezzo);
      else if (sortOption === 'desc') filteredProducts.sort((a, b) => b.Prezzo - a.Prezzo);
      

      const productCards = filteredProducts.map(product => createProductCard(product));
      const productCardsHTML = productCards.join('\n');

      const categoriesOptions = categorie.map(category => {
        return `<option value="${category.ID}" ${category.ID === parseInt(selectedCategoria) ? 'selected' : ''}>${category.Nome}</option>`;
      }).join('\n');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <!-- Definisci il titolo della pagina -->
        <title>Elenco Prodotti</title>
        </head>
        <body>
          <h1>Elenco dei Prodotti</h1>
          
          <!-- Barra di ricerca -->
          <label for="search">Cerca prodotti:</label>
          <input type="text" id="search" name="search" value="${searchTerm || ''}">
          <button onclick="searchProducts()">Cerca</button>
          
          <!-- Selettore dell'ordinamento -->
          <label for="sort">Ordina per prezzo:</label>
          <select id="sort" name="sort" onchange="sortProducts()">
            <option value="none" ${sortOption === 'none' ? 'selected' : ''}>Nessun ordinamento</option>
            <option value="asc" ${sortOption === 'asc' ? 'selected' : ''}>Crescente</option>
            <option value="desc" ${sortOption === 'desc' ? 'selected' : ''}>Decrescente</option>
          </select>
          
          <!-- Selettore delle categorie -->
          <label for="categoria">Seleziona una categoria:</label>
          <select id="categoria" name="categoria" onchange="filterCategory()">
            <option value="">Tutte le categorie</option>
            ${categoriesOptions}
          </select>
          
          <div id="products-container">
            ${productCardsHTML}
          </div>
          
          <script>
            function searchProducts() {
              const searchTerm = document.getElementById('search').value;
              window.location.href = '/prodotti?search=' + searchTerm;
            }
            
            function sortProducts() {
              const sortOption = document.getElementById('sort').value;
              window.location.href = '/prodotti?sort=' + sortOption;
            }
            
            function filterCategory() {
              const selectedCategoria = document.getElementById('categoria').value;
              window.location.href = '/prodotti?categoria=' + selectedCategoria;
            }
          </script>
        </body>
        </html>
      `;
      
      res.send(html);
    } else {
      res.status(500).send("Errore durante il recupero dei dati dei prodotti");
    }
  } catch (error) {
    console.error("Errore durante la richiesta API dei prodotti:", error);
    res.status(500).send("Errore durante il recupero dei dati dei prodotti");
  }
});

function createProductCard(product) {
  return `
      <div class="product-card">
          <h2>${product.Nome}</h2>
          <p>${product.Descrizione}</p>
          <p>Prezzo: $${parseFloat(product.Prezzo).toFixed(2)}</p>
          <img src="images/${product.ImmaginePath}" alt="${product.ImmaginePath}">
      </div>
  `;
}



// Configura il middleware cookie-parser
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); // DEVO METTERE TUTTE LE PAGINE HTML nella directory "public"

app.use(session({
  secret: 'mySecretKey', // Sostituisci con una chiave segreta sicura
  resave: false,
  saveUninitialized: true
}));

// Pagina principale
app.get('/lezzo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
});


// Pagina di elenco dei prodotti
app.get('/prodottiLoggati', (req, res) => {
  res.send('Elenco dei prodotti disponibili');
});

// Pagina di dettagli del prodotto
app.get('/prodotti/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`Dettagli del prodotto con ID ${productId}`);
});

// Pagina del carrello dell'utente (richiede l'autenticazione)
app.get('/carrello', verificaAutenticazione, (req, res) => {
if (isUserLoggedIn(req)) {
  // L'utente è autenticato, quindi puoi accedere all'utente tramite req.session.utente
  res.sendFile(path.join(__dirname, 'public', 'carrelloUtente.html'));
} else {
  res.redirect('/login'); // Reindirizza l'utente alla pagina di login se non è autenticato
}
});



// Pagina di registrazione
app.get('/registrazione', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.redirect('/'); // Reindirizza l'utente alla pagina principale
  } else {
    res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
  }
});

// Pagina di login
app.get('/login', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.redirect('/'); // Reindirizza l'utente alla pagina principale
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});





// Funzione per verificare se l'utente è loggato
function isUserLoggedIn(req) {
  // Verifica se l'utente è autenticato attraverso la sessione
  if (req.session && req.session.utente) {
    // L'utente è autenticato, restituisci true
    return true;
  }

  // Verifica se l'utente è autenticato attraverso un token JWT
  const authToken = getAuthToken(req);
  if (authToken) {
    // Esegui la verifica del token JWT e restituisci true se è valido
    // Altrimenti, restituisci false
    if (verificaETokenJWT(authToken)) {
      return true;
    }
  }

  // L'utente non è autenticato, restituisci false
  return false;
}

// Funzione per ottenere il token di autenticazione se l'utente è loggato
function getAuthToken(req) {
  // Verifica se il token JWT è presente nell'header della richiesta
  const token = req.header('Authorization');
  if (token) {
    return token;
  }

  // Verifica se il token è presente nei cookie o in altri metodi di autenticazione
  // e restituiscilo se presente
  const cookieToken = req.cookies.token; // Esempio per i cookie
  if (cookieToken) {
    return cookieToken;
  }

  // Restituisci null se il token non è presente
  return null;
}

// Funzione di verifica del token JWT
function verificaETokenJWT(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return true; // Il token è valido
  } catch (error) {
    return false; // Il token non è valido
  }
}


// Middleware per verificare l'autenticazione
function verificaAutenticazione(req, res, next) {
  if (isUserLoggedIn(req)) {
    next(); // Prosegui con la richiesta successiva
  } else {
    res.status(500).send('Errore del server interno');
  }
}




// Aggiungi un endpoint API per ottenere lo stato di autenticazione e il token
app.get('/api/v1/auth-status', (req, res) => {
  if (isUserLoggedIn(req)) {
    const authToken = getAuthToken(req);
    const userData = {
      isLoggedIn: true,
      authToken: authToken,
    };
    res.json(userData);
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.get('/api/v1/get-auth-token', (req, res) => {
  const authToken = getAuthToken(req);
  res.json({ authToken });
});



 


// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.use(express.json());

