import React, { useState } from 'react';
import './reg.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Register = () => {
  const [username, setusername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      setErrorMessage('Passwords do not match');
      return;
    }

    axios
      .post('http://127.0.0.1:8000/auth/signup/', {
        username,
        password1,
        password2,
      })
      .then((response) => {
        setErrorMessage('');
        console.log('Registration successful:', response.data);
        navigate('/login'); // Redirect to the login page
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to register user. Please contact admin');
        }
      });
  };

  return (
    <div className="login-wrp">
      <div className="top">
        <div className="logo"></div>
      </div>
      <div className="bottom">
        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <h4 className="brands">Movie Zone</h4>
            <h4 className="h42">REGISTRATION</h4>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="btn1 btn-primary btn-block">
            SignUp
          </button>
          <br />
          <p className="text-center">
            <span>
              <small>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="btn btn-light btn-link w-25 bg-success text-white"
                >
                  Login
                </Link>
              </small>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
