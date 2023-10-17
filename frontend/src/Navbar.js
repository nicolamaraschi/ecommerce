import React, { useState } from 'react';
import Axios from 'axios';
import './Navbar.css';
import './Filters.css';
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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="logo.png" alt="Logo" />
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
        <button>Carrello</button>
        <button onClick={showLogin}>
          <Link to="/login">Login</Link>
        </button>
        <button>Registrazione</button>
        <select>
          <option value="it">Italiano</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar;
