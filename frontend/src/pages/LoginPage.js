import React, { useState } from 'react';
import Axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setLoggedInUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState({});
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/api/v1/loginUtente', {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        setLoggedInUser({
          id: data.utente.id,
          ruolo: data.utente.Ruolo, // Aggiungi il ruolo utente
          token: data.token,
        });

        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('utenteID', data.utente.id);
        localStorage.setItem('role', data.utente.Ruolo);
       
    

        setMessage(data.message);
        setMessageStyle({ color: 'green' });
        navigate('/');
      } else {
        const data = response.data;
        setMessage(data.error);
        setMessageStyle({ color: 'red' });
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setMessage('Errore durante il login');
      setMessageStyle({ color: 'red' });
    }

    setTimeout(() => {
      setMessage('');
      setMessageStyle({});
    }, 4000);
  };

  return (
    <div className="login-container">
      <h1>Login Utente</h1>
      <form>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Indirizzo email"
          value={email}
          onChange={handleEmailChange}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <div class="button-container">
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default LoginPage;
