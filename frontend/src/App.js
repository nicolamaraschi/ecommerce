import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';
import ProductCard from './ProductCard';
import Filters from './Filters';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa il React Router
import LoginPage from './pages/LoginPage'; // Assicurati di importare la pagina di login

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
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

  return (
    <Router>
      <div className="app">
        <Navbar toggleSidebar={toggleSidebar} handleSearch={handleSearch} />
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
                  <ProductCard key={product.ID} product={product} />
                ))}
              </div>
            </div>
          } />
          <Route path="/login" element={<LoginPage />} />
          {/* Aggiungi altre route qui, se necessario */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
