import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { authService } from '../services/authService';
import { FaArrowLeft } from 'react-icons/fa';

const NavBar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const handleLogout = () => {

      authService.logout();
      logout();

    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="w-full bg-[#0a1a2a] p-4 shadow-md">
      <div className="flex justify-between items-center">
        {isAuthPage ? (
          <Link to="/" className="text-[#00fff5] hover:text-white transition duration-300">
            <FaArrowLeft size={24} />
          </Link>
        ) : (
          <>
            <Link to="/" className="text-[#00fff5] text-2xl font-bold hover:text-white transition duration-300">
              SynapseAI
            </Link>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="bg-[#4a5d7e] text-white px-4 py-2 rounded-full hover:bg-[#00fff5] hover:text-[#0a1a2a] transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;