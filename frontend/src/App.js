import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';
import ProductCard from './ProductCard';
import Filters from './Filters';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const responseListaProdotti = await Axios.get('http://192.168.1.2:3001/api/v1/prodotti');
        const responseCategorieProdotti = await Axios.get('http://192.168.1.2:3001/api/v1/categorie');
        const dataListaProdotti = responseListaProdotti.data.products; // Accedi a "products" nell'oggetto restituito

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
  }, []);

  const applyFilters = () => {
    // Applica filtri qui e aggiorna lo stato dei prodotti
  };

  return (
    <div className="app">
      <h1>Elenco dei Prodotti</h1>
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={applyFilters}
      />
      <div className="products-container">
        {products.map((product) => (
          <ProductCard key={product.ID} product={product} />
        ))}
      </div>
    </div>
  );
}

export default App;
