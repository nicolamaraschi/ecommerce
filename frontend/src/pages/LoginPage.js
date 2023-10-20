import React, { useState } from 'react';
import Axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setLoggedInUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Stato per il messaggio
  const [messageStyle, setMessageStyle] = useState({}); // Stato per lo stile del messaggio
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
        // Login riuscito
        const data = response.data;

        // Assicurati che setLoggedInUser accetti un oggetto utente
        setLoggedInUser({
          id: data.utente.id, // Assumi che ci sia un campo "id" nell'oggetto utente
          token: data.token,
        });

        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('utenteID', data.utente.id); // Salva l'utenteID

        setMessage(data.message);
        setMessageStyle({ color: 'green' });
        navigate('/');
      } else {
        // Login non riuscito
        const data = response.data;
        setMessage(data.error);
        setMessageStyle({ color: 'red' });
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setMessage('Errore durante il login');
      setMessageStyle({ color: 'red' });
    }

    // Nascondi il messaggio dopo 4 secondi
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

      {/* Visualizza il messaggio con lo stile appropriato */}
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default LoginPage;
