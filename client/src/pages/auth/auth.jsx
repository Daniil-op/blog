import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logotype from "../../components/header/logo.svg";
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="sign-up-modal">
      <Link to="/">
        <div id="close-modal-button" onClick={() => console.log('Close modal')}>
          <span></span>
        </div>
      </Link>
      <div className="logo-container">
        <Link to="/" className="logotype-auth">
          <img src={Logotype} alt="logo" style={style_image} />
          <h2 className="logotype-text-auth">FutureTech</h2>
        </Link>
      </div>

      <form className="details" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            className="col-sm-12 email-input with-placeholder"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            className="col-sm-12 password-input with-placeholder"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <input id="sign-up-button" type="submit" value="Sign In" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don't have an account? <Link to="/registration">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Auth;