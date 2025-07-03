import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ onLogout }) {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg w-full shadow-blue-300/50">
      <div className="flex items-center space-x-4">
        {/* Placeholder for Logo */}
        <div className="text-3xl font-extrabold text-white">
          <i className="fas fa-check-double"></i> 
        </div>
        <Link to="/" className="text-white text-2xl font-bold hover:text-blue-100 transition-colors duration-200">
          TaskBucket
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-blue-700 hover:text-white focus:bg-blue-800 focus:outline-none">
              Home
            </Link>
          </li>
          <li>
            <Link to="/features" className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-blue-700 hover:text-white focus:bg-blue-800 focus:outline-none">
              Features
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 hover:bg-blue-700 hover:text-white focus:bg-blue-800 focus:outline-none">
              Dashboard
            </Link>
          </li>
          {onLogout && (
            <li>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow transition-colors duration-200 shadow-red-300/50"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
} 