import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          SynapseAI
        </Link>
        <div className="space-x-6">
          <Link to="/dashboard" className="text-white hover:text-purple-200 transition duration-150 ease-in-out">
            Dashboard
          </Link>
          <Link to="/flashcards" className="text-white hover:text-purple-200 transition duration-150 ease-in-out">
            Flashcards
          </Link>
          <Link to="/login" className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-150 ease-in-out">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;