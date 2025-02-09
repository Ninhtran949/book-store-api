import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/home.css';

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to Book Store</h1>
      {user && (
        <div className="welcome-message">
          <p>Welcome, {user.name}!</p>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;