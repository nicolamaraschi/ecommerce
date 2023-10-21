import React, { useState } from 'react';
import Axios from 'axios';
import './Navbar.css';
import { Link } from 'react-router-dom'; // Importa il componente Link per il routing
import LoginPage from './pages/LoginPage'; // Importa il componente LoginPage

function Navbar({ toggleSidebar, handleSearch, loggedInUser, setLoggedInUser }) {
  const [searchInput, setSearchInput] = useState('');
  const [isLoginVisible, setLoginVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setLoggedInUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const search = () => {
    handleSearch(searchInput);
  };

  const showLogin = () => {
    setLoginVisible(true);
  };

  const showRegister = () => {};

  const showCarrello = () => {};

  const isAdmin = () => {
    const userRole = localStorage.getItem('role'); // Ottieni il ruolo utente memorizzato nel localStorage
    return loggedInUser && userRole === 'Amministratore';
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
        {loggedInUser ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">
              <button onClick={showLogin}>Login</button>
            </Link>
            <Link to="/register">
              <button onClick={showRegister}>Register</button>
            </Link>
          </>
        )}
        {isAdmin() && (
          <Link to="/AdminPage">
              <button>Admin Page</button>
          </Link>
        )}
        <Link to="/carrello">
          <button onClick={showCarrello}>Carrello</button>
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
