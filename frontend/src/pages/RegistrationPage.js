import Axios from 'axios';
import React, { useState } from 'react';
import './RegistrationPage.css';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // Definisci setLoggedInUser
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    const newUser = {
      Nome: nome,
      Email: email,
      Password: password,
    };

    try {
      const response = await Axios.post('http://localhost:3001/api/v1/registrazioneUtente', newUser);

      if (response.status === 201) {
        // Registrazione riuscita, gestisci il token JWT ottenuto
        const data = response.data;
        setLoggedInUser(data.token); // Imposta il token JWT
        // Puoi reindirizzare l'utente o fare altre azioni come l'accesso automatico
        alert("Registrazione riuscita!");
        navigate('/');

      } else {
        // Registrazione non riuscita, gestisci l'errore
        const data = response.data;
        alert("Errore: " + data.error);
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
    }
  };

  return (
    <div className="registration-container">
      <h1>Registrazione Utente</h1>
      <form onSubmit={handleRegistration}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}

export default RegistrationPage;
