// src/Filters.js
import React from 'react';

function Filters({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  searchTerm,
  setSearchTerm,
  applyFilters,
}) {
  return (
    <div className="filters">
      <label htmlFor="search">Cerca prodotti:</label>
      <input
        type="text"
        id="search"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={applyFilters}>Cerca</button>

      <label htmlFor="sort">Ordina per prezzo:</label>
      <select
        id="sort"
        name="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="none">Nessun ordinamento</option>
        <option value="asc">Crescente</option>
        <option value="desc">Decrescente</option>
      </select>

      <label htmlFor="categoria">Seleziona una categoria:</label>
      <select
        id="categoria"
        name="categoria"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Tutte le categorie</option>
        {categories.map((category) => (
          <option key={category.ID} value={category.ID}>
            {category.Nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
