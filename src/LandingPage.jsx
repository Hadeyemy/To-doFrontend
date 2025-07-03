import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Header from './Header';

export default function LandingPage({ setToken }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (token) => {
    setToken(token);
    setShowLogin(false); // Close login popup on success
  };

  const handleSignupSuccess = () => {
    setShowSignup(false); // Close signup popup on success
    setShowLogin(true); // Optionally, open login after successful signup
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center text-center p-8">
      <Header />
      <h1 className="text-6xl font-extrabold text-blue-700 mb-6 drop-shadow-lg">
        Welcome to TaskBucket!
      </h1>
      <p className="text-xl text-gray-700 mb-10 max-w-2xl">
        Organize your life with ease. Manage tasks, set reminders, and keep track of everything that matters.
      </p>
      <div className="space-x-4 mb-12">
        <button
          onClick={() => { setShowLogin(true); setShowSignup(false); }}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-blue-300/50"
        >
          Login
        </button>
        <button
          onClick={() => { setShowSignup(true); setShowLogin(false); }}
          className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-blue-300/50"
        >
          Sign Up
        </button>
      </div>

      {/* <Link to="/features" className="text-orange-600 hover:underline text-lg font-semibold mb-12">
        Learn more about our features
      </Link> */}

      {/* Login Popup - Glassmorphism */}
      {showLogin && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white bg-opacity-30 rounded-lg p-8 relative max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 opacity-100 border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold bg-white bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <Login setToken={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* Signup Popup - Glassmorphism */}
      {showSignup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white bg-opacity-30 rounded-lg p-8 relative max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 opacity-100 border border-white border-opacity-40 backdrop-blur-sm shadow-blue-300/50">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold bg-white bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <Signup onSignupSuccess={handleSignupSuccess} />
          </div>
        </div>
      )}

      <footer className="mt-auto text-gray-600 text-sm">
        © {new Date().getFullYear()} TaskBucket. Designed by Habeeb Oladapo. Inspired by DevTown Academy.
      </footer>
    </div>
  );
} 