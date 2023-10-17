import React, { useState } from 'react';
import Axios from 'axios';
import './Filters.css';

const Filters = ({ categories, selectedCategory, setSelectedCategory, sortOption, setSortOption, searchTerm,  applyFilters }) => {
  const [sidebarOpen] = useState(false);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);

    if (newCategory !== '') {
      Axios.get(`http://localhost:3001/api/v1/prodottiCategoria/${newCategory}`)
        .then((response) => {
          applyFilters(response.data.products);
        })
        .catch((error) => {
          console.error("Errore durante il recupero dei prodotti per la categoria:", error);
        });
    } else {
      applyFilters([]);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await Axios.get(`http://localhost:3001/api/v1/ricercaProdotti/${searchTerm}`);
      const data = response.data;
      applyFilters(data);
    } catch (error) {
      console.error("Errore durante la ricerca dei prodotti:", error);
    }
  };

  return (
    <div className={`filters ${sidebarOpen ? 'sidebar-open' : ''}`}>
      
      
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <h2>Categorie</h2>
        <a href="#" onClick={() => handleCategoryChange('')}>
        </a>
        {categories.map((category) => (
          <a
            key={category.ID}
            href="#"
            onClick={() => handleCategoryChange(category.ID)}
            className={category.ID === selectedCategory ? 'active' : ''}
          >
            {category.Nome}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Filters;