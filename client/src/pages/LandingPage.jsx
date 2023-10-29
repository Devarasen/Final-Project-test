;import React, { useEffect } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import AuthService from '../utils/auth';  

function LandingPage() {
  const navigate = useNavigate();


  useEffect(() => {
    if (AuthService.loggedIn()) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSuccessfulLogin = () => {
    navigate('/profile');
  };

  const handleSuccessfulSignUp = () => {
    alert("Successfully registered! You can now log in.");
  };

  return (
    <div className="landing-page">
      <div className="log-in-form">
        <h2>Log In</h2>
        <LoginForm onLoginSuccess={handleSuccessfulLogin} />
      </div>
      <div className="sign-up-form">
        <h2>Sign Up</h2>
        <SignUpForm onSignUpSuccess={handleSuccessfulSignUp} />
      </div>
    </div>
  );
}

export default LandingPage;
