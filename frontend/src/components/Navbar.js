import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';

const NavBar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    authService.logout(); // This will remove the token from localStorage
    logout(); // This will update the user state in the context
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0a260c] to-[#217e38] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-[#aff195] text-2xl font-bold hover:text-white transition duration-300">
          SynapseAI
        </Link>
        <div className="space-x-6">
          <Link to="/dashboard" className="text-[#aff195] hover:text-white transition duration-300">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#59a742] text-white px-4 py-2 rounded-full hover:bg-[#aff195] hover:text-[#0a260c] transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;