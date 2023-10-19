import React, { useState } from 'react';
import Axios from 'axios';
import './Navbar.css';
import { Link } from 'react-router-dom'; // Importa il componente Link per il routing
import LoginPage from './pages/LoginPage'; // Importa il componente LoginPage

function Navbar({ toggleSidebar, handleSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [isLoginVisible, setLoginVisible] = useState(false);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const search = () => {
    handleSearch(searchInput);
  };

  const showLogin = () => {
    setLoginVisible(true);
  };
  const showRegister = () => {
    
  };
  const showCarrello = () => {
    // Implementa la navigazione al carrello
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <Link to="/">
        <img src="/images/logo.ico" alt="Logo" />
        </Link>
      </div>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Cerca..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button onClick={search}>Cerca</button>
      </div>
      <div className="navbar-buttons">

      <Link to="/carrello">
          <button onClick={showCarrello}>Carrello</button>
        </Link>

        <Link to="/login">
          <button onClick={showLogin}>Login</button>
        </Link>

        <Link to="/register">
          <button onClick={showRegister}>Register</button>
        </Link>

        <select>
          <option value="it">Italiano</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar;
