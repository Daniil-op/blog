import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logotype from "../../components/header/logo.svg";
import { useAuth } from '../../context/AuthContext';
import './registration.css';

const Reg = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await register(email, username, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
        </div>
        <div className="input-container">
          <input
            className="col-sm-12 username-input with-placeholder"
            id="username"
            type="text"
            placeholder="Username"
            maxLength="8"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <input
          id="sign-up-button"
          type="submit"
          value={isLoading ? "Processing..." : "Sign Up"}
          disabled={isLoading}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account? <Link to="/auth">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Reg;