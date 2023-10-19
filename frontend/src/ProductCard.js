// ProductCard.js
import React, { useState } from 'react';
import Axios from 'axios';


function ProductCard({ product, loggedInUser }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/api/v1/aggiungiProdottoCarrello', {
        id: product.ID,
        quantity: quantity,
        utenteID: loggedInUser?.id,
      });

      if (response.status === 201) {
        // Product added to the cart successfully
        console.log('Product added to the cart successfully');
      } else {
        console.error('Error while adding to the cart');
      }
    } catch (error) {
      console.error('Error while adding to the cart:', error);
    }
  };

  return (
    <div className="product-card">
      <h2>{product.Nome}</h2>
      <img src={`images/${product.ImmaginePath}`} alt={product.Nome} />
      <p>{product.Descrizione}</p>
      <p>Price: $ {parseFloat(product.Prezzo).toFixed(2)}</p>
      <label>Quantity: </label>
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        min="1"
        max={product.Stock}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
