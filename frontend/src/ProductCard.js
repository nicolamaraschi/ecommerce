// src/ProductCard.js
import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h2>{product.Nome}</h2>
      <p>{product.Descrizione}</p>
      <p>Prezzo: ${parseFloat(product.Prezzo).toFixed(2)}</p>
      <img src={`images/${product.ImmaginePath}`} alt={product.ImmaginePath} />
    </div>
  );
}

export default ProductCard;
