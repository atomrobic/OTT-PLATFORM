import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });

    axios
      .post('http://127.0.0.1:8000/auth/login/', { username, password })
      .then((response) => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('accessToken', token);
          navigate('/Movieshowlist');
        } else {
          setErrorMessage('Login successful, but no token received.');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            setErrorMessage('Your account is blocked. Please contact support.');
          } else if (error.response.status === 400) {
            setErrorMessage('Invalid username or password.');
          } else {
            setErrorMessage('Something went wrong. Please try again.');
          }
        } else {
          setErrorMessage('Unable to connect to the server.');
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo"></div>
      </div>
      <div className="login-body">
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <h4 className="login-title">Login Now</h4>
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit" className="btn btn-submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
