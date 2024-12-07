import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Welcome.css';

function Welcome() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

  return (
    <div className="welcome-container">
      <h1>Welcome to Group Purchase Platform</h1>
      <div className="button-group">
        <button onClick={() => navigateTo('/login')}>Login</button>
        <button onClick={() => navigateTo('/register/user')}>Register as User</button>
        <button onClick={() => navigateTo('/register/business')}>Register as Business</button>
      </div>
    </div>
  );
}

export default Welcome;