//src/pages/App.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';
import ProductCard from './ProductCard';
import Filters from './Filters';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa il React Router
import LoginPage from './pages/LoginPage'; // Assicurati di importare la pagina di login
import RegistrationPage from './pages/RegistrationPage'; // Importa il componente della pagina di registrazione
import CarrelloPage from './pages/CarrelloPage'; // Assicurati che il percorso sia corretto

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Inizializza loggedInUser a null


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Recupera il token JWT dalla memoria locale durante il caricamento iniziale
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Se c'è un token nella memoria locale, imposta l'utente come autenticato
      setLoggedInUser({ token });
    }
    
    async function fetchData() {
      try {
        const responseListaProdotti = await Axios.get('http://localhost:3001/api/v1/prodotti');
        const responseCategorieProdotti = await Axios.get('http://localhost:3001/api/v1/categorie');
        const dataListaProdotti = responseListaProdotti.data.products;

        if (Array.isArray(dataListaProdotti)) {
          setProducts(dataListaProdotti);
        } else {
          console.error("I dati della lista prodotti non sono un array:", dataListaProdotti);
        }

        setCategories(responseCategorieProdotti.data);
      } catch (error) {
        console.error("Errore durante la richiesta API dei prodotti:", error);
      }
    }

    fetchData();
  }, []); // Questo effetto viene eseguito solo una volta, all'avvio

  const applyFilters = (filteredData) => {
    setProducts(filteredData);
  };

  const handleSearch = async (searchTerm) => {
    try {
      const response = await Axios.get(`http://localhost:3001/api/v1/ricercaProdotti/${searchTerm}`);
      const data = response.data;
      applyFilters(data);
    } catch (error) {
      console.error("Errore durante la ricerca dei prodotti:", error);
    }
  };
  //<Navbar toggleSidebar={toggleSidebar} handleSearch={handleSearch} />

  return (
    <Router>
      <div className="app">
      <Navbar
          toggleSidebar={toggleSidebar}
          handleSearch={handleSearch}
          loggedInUser={loggedInUser} // Passa loggedInUser come prop
          setLoggedInUser={setLoggedInUser} // Passa la funzione per impostare l'utente
        />
        <Routes>
          <Route path="/" element={
            <div>
              <Filters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                applyFilters={applyFilters}
                sidebarOpen={sidebarOpen}
              />
              <h1>Elenco dei Prodotti</h1>
              <div className="products-container">
              {products.map((product) => (
              <ProductCard key={product.ID} product={product} loggedInUser={loggedInUser} />
            ))}
              </div>
            </div>
          } />
         <Route path="/login" element={<LoginPage setLoggedInUser={setLoggedInUser} />} />
          <Route path="/register" element={<RegistrationPage />}/>
          <Route path="/carrello" element={<CarrelloPage utenteID={loggedInUser?.id} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
