//src/pages/LoginPage.js

import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Esegui il login e controlla le credenziali
    if (email === 'tuo@email.com' && password === 'passwordsegreta') {
      onLogin(true); // Passa `true` per indicare il login riuscito
    } else {
      onLogin(false); // Passa `false` per indicare il login non riuscito
    }
  };

  return (
    <div className="login-container">
      <h1>Login Utente</h1>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        value={email}
        onChange={handleEmailChange}
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        value={password}
        onChange={handlePasswordChange}
      />

      <button onClick={handleLogin}>Accedi</button>
    </div>
  );
}

export default Login;
